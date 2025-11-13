import { Queue, Worker, Job } from 'bullmq'
import Redis from 'ioredis'
import { QueueAdapter, QueueName } from './types'
import { BridgeJob } from '@/db/schemas/bridgeJob'
import { getHostFromRedisUrl, getPortFromRedisUrl } from './utils'
import { logger } from '@/core/logger'

type Handler = (payload: BridgeJob) => Promise<void>

export class BullMqAdapter implements QueueAdapter {
  private redis: Redis
  private queues: Record<QueueName, Queue> = {} as any
  private workers: Record<QueueName, Worker> = {} as any
  private handlers: Record<QueueName, Handler | null> = {
    locked: null,
    burned: null,
  }

  constructor(redisUrl: string, queuePrefix = 'slice-bridge') {
    // Create Redis connection
    this.redis = new Redis(
        getPortFromRedisUrl(redisUrl),
        getHostFromRedisUrl(redisUrl),
        {
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        }
    )

    // Initialize queues
    this.queues.locked = new Queue('locked', {
      connection: this.redis,
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
      prefix: queuePrefix,
    })

    this.queues.burned = new Queue('burned', {
      connection: this.redis,
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
      prefix: queuePrefix,
    })

    this.redis.on('connect', () => {
      logger.info('Redis connected for BullMQ')
    })

    this.redis.on('error', (err) => {
      logger.error({ detail: err }, 'Redis connection error')
    })
  }

  async enqueue(queueName: QueueName, payload: BridgeJob): Promise<void> {
    const queue = this.queues[queueName]
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`)
    }

    // Use srcTxHash + srcChainId as unique job ID to prevent duplicates
    const jobId = `${payload.srcChainId}-${payload.srcTxHash}-${payload.srcNonce}`
    
    await queue.add(queueName, payload, {
      jobId,
    })

    logger.info(`Enqueued ${queueName} job: ${jobId}`)
  }

  async process(queueName: QueueName, handler: Handler): Promise<void> {
    if (this.handlers[queueName]) {
      logger.warn(`Handler for ${queueName} already set, skipping`)
      return
    }

    this.handlers[queueName] = handler

    const worker = new Worker(
      queueName,
      async (job: Job<BridgeJob>) => {
        const handler = this.handlers[queueName]
        if (!handler) {
          throw new Error(`No handler registered for queue: ${queueName}`)
        }

        logger.info(`Processing ${queueName} job: ${job.id}`)
        
        try {
          await handler(job.data)
          logger.info(`Completed ${queueName} job: ${job.id}`)
        } catch (error) {
          logger.error({ detail: error }, `Failed ${queueName} job: ${job.id}`)
          throw error
        }
      },
      {
        connection: this.redis,
        concurrency: 5, // Process 5 jobs concurrently
        prefix: this.queues[queueName].opts.prefix,
      }
    )

    this.workers[queueName] = worker

    worker.on('completed', (job) => {
      logger.info(`Job completed: ${job.id} in queue ${queueName}`)
    })

    worker.on('failed', (job, err) => {
      logger.error({ detail: err }, `Job failed: ${job?.id} in queue ${queueName}`)
    })

    worker.on('error', (err) => {
      logger.error({ detail: err }, `Worker error in queue ${queueName}`)
    })

    logger.info(`Worker started for queue: ${queueName}`)
  }

  async close(): Promise<void> {
    logger.info('Closing BullMQ connections...')
    
    // Close all workers
    for (const [queueName, worker] of Object.entries(this.workers)) {
      try {
        await worker.close()
        logger.info(`Closed worker for queue: ${queueName}`)
      } catch (error) {
        logger.error({ detail: error }, `Error closing worker for queue ${queueName}`)
      }
    }

    // Close all queues
    for (const [queueName, queue] of Object.entries(this.queues)) {
      try {
        await queue.close()
        logger.info(`Closed queue: ${queueName}`)
      } catch (error) {
        logger.error({ detail: error }, `Error closing queue ${queueName}`)
      }
    }

    // Close Redis connection
    try {
      await this.redis.disconnect()
      logger.info('Redis connection closed')
    } catch (error) {
      logger.error({ detail: error }, 'Error closing Redis connection')
    }
  }

  // Helper method to get queue stats
  async getStats(queueName: QueueName) {
    const queue = this.queues[queueName]
    if (!queue) return null

    return {
      waiting: await queue.getWaiting(),
      active: await queue.getActive(),
      completed: await queue.getCompleted(),
      failed: await queue.getFailed(),
    }
  }
}