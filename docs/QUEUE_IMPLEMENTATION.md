# 🚀 Slice Bridge Service - Queue Implementation with BullMQ & Redis

## 📋 Overview

This document covers the complete implementation of **BullMQ queue system with Redis backend** for the Slice Bridge Service. The implementation provides robust job processing for blockchain bridge operations with advanced features like job deduplication, retry logic, and monitoring.

## 🏗️ Architecture

### Queue System Components

```mermaid
graph TD
    A[Bridge Events] --> B[Queue Adapter]
    B --> C{Redis Available?}
    C -->|Yes| D[BullMQ Adapter]
    C -->|No| E[Memory Adapter]
    D --> F[Redis Queue]
    F --> G[Workers]
    G --> H[Bridge Processors]
    H --> I[Blockchain Operations]
```

### Key Components

1. **Queue Adapters** (`src/queues/`)
   - `bullmq.ts`: Redis-backed BullMQ implementation
   - `memory.ts`: Fallback in-memory queue
   - `index.ts`: Factory for adapter selection

2. **Workers** (`src/workers/`)
   - `locked.ts`: Processes BSC -> Lens bridge jobs
   - `burned.ts`: Processes Lens -> BSC bridge jobs

3. **Infrastructure**
   - `docker-compose.yml`: Multi-service orchestration
   - `Dockerfile`: Containerized deployment
   - Redis: Message broker and job storage

## 🔧 Features

### BullMQ Implementation Features

- ✅ **Job Deduplication**: Prevents duplicate jobs using `srcTxHash + srcChainId`
- ✅ **Retry Logic**: Configurable retry attempts with exponential backoff
- ✅ **Concurrency Control**: Configurable concurrent job processing
- ✅ **Graceful Shutdown**: Proper cleanup of connections and workers
- ✅ **Health Monitoring**: Redis connection health checks
- ✅ **Error Handling**: Comprehensive error logging and recovery

### Redis Configuration

- **Persistence**: AOF (Append Only File) enabled
- **Memory Management**: 256MB with noeviction policy
- **Health Checks**: Automatic Redis health monitoring
- **Network Isolation**: Internal Docker networking

## 📦 Installation & Setup

### 1. Prerequisites

```bash
- Docker & Docker Compose
- Node.js 20+ (for local development)
- pnpm package manager
```

### 2. Environment Configuration

Copy and configure environment variables:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```bash
# Queue Configuration
REDIS_URL=redis://localhost:6380
USE_REDIS=true
QUEUE_PREFIX=slice-bridge

# Database
DATABASE_URL=postgresql://username:password@host:port/dbname

# Blockchain Configuration
LENS_CHAIN_ID=37111
BSC_CHAIN_ID=97

# Relayer
RELAYER_PK=your_private_key_here
```

### 3. Docker Deployment

#### Production Deployment

```bash
# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs app
docker-compose logs redis
```

#### Development with Monitoring Tools

```bash
# Start with debug profile (includes Redis Commander & BullMQ Board)
docker-compose --profile debug up -d

# Access monitoring tools
# Redis Commander: http://localhost:8081 (admin/admin)
# BullMQ Board: http://localhost:3000
```

#### Local Development

```bash
# Start only Redis
docker-compose up -d redis

# Install dependencies
pnpm install

# Run in development mode
pnpm dev
```

## 🔍 Monitoring & Debugging

### Service Health Checks

```bash
# Application health
curl http://localhost:8787/health

# Redis health  
docker-compose exec redis redis-cli ping
```

### Logs Analysis

```bash
# Application logs
docker-compose logs -f app

# Redis logs
docker-compose logs -f redis

# Filter for queue-related logs
docker-compose logs app | grep -E "BullMQ|Redis|Worker|Queue"
```

### Queue Monitoring

**BullMQ Board Dashboard** (when using `--profile debug`):
- **URL**: http://localhost:3000
- **Features**: Real-time job monitoring, queue statistics, job details
- **Capabilities**: Retry failed jobs, delete jobs, view job data

**Redis Commander** (when using `--profile debug`):
- **URL**: http://localhost:8081
- **Credentials**: admin/admin
- **Features**: Redis key inspection, memory usage, configuration

## 📊 Queue Operations

### Job Flow

1. **Event Detection**: Blockchain listeners detect bridge events
2. **Job Creation**: Events are converted to bridge jobs
3. **Queue Addition**: Jobs are added to appropriate queue (locked/burned)
4. **Deduplication**: System checks for existing jobs using `srcTxHash+srcChainId`
5. **Processing**: Workers process jobs with retry logic
6. **Completion**: Successful jobs update database and emit events

### Job Structure

```typescript
interface BridgeJob {
  srcTxHash: string;        // Source transaction hash
  srcChainId: number;       // Source chain ID
  amount: bigint;           // Bridge amount
  user: string;             // User address
  // ... additional job data
}
```

### Queue Configuration

```typescript
// Queue settings
const queueOptions = {
  defaultJobOptions: {
    removeOnComplete: 100,    // Keep last 100 successful jobs
    removeOnFail: 50,         // Keep last 50 failed jobs
    attempts: 3,              // Retry up to 3 times
    backoff: {
      type: 'exponential',
      delay: 5000,            // Start with 5 second delay
    },
  },
};
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Redis Connection Failed
```bash
Error: ECONNREFUSED redis:6379

Solutions:
- Check Redis service: docker-compose ps
- Verify network connectivity: docker-compose logs redis
- Ensure REDIS_URL is correct in environment variables
```

#### 2. Port Already in Use
```bash
Error: Bind for 0.0.0.0:6379 failed: port is already allocated

Solutions:
- Change Redis port in docker-compose.yml
- Stop conflicting Redis instances: docker ps | grep redis
```

#### 3. Database Connection Issues
```bash
Error: ENETUNREACH database

Solutions:
- Verify DATABASE_URL is accessible
- Check network connectivity to database host
- Ensure database credentials are correct
```

#### 4. BullMQ Eviction Policy Warning
```bash
IMPORTANT! Eviction policy is allkeys-lru. It should be "noeviction"

Solutions:
- Update Redis configuration to use noeviction policy
- Restart Redis with updated docker-compose.yml
```

### Debug Commands

```bash
# Check container logs
docker-compose logs --tail=50 app

# Execute commands in containers
docker-compose exec app sh
docker-compose exec redis redis-cli

# Inspect Redis data
docker-compose exec redis redis-cli keys "bull:*"

# Monitor Redis commands
docker-compose exec redis redis-cli monitor
```

## 🔒 Security Considerations

### Production Security

1. **Environment Variables**
   - Never commit `.env` files
   - Use proper secret management
   - Rotate private keys regularly

2. **Redis Security**
   - Use Redis AUTH if exposing externally
   - Configure firewall rules
   - Use TLS for external connections

3. **Container Security**
   - Run containers as non-root user
   - Use minimal base images
   - Regularly update dependencies

### Network Security

```yaml
# Production network configuration
networks:
  slice-bridge-network:
    driver: bridge
    internal: true  # Prevent external access
```

## 📈 Performance Optimization

### Queue Performance

```typescript
// Optimized worker configuration
const worker = new Worker('queueName', processor, {
  concurrency: 5,           // Process 5 jobs concurrently
  limiter: {
    max: 10,               // Max 10 jobs per duration
    duration: 1000,        // Per 1 second
  },
  settings: {
    stalledInterval: 30000,  // Check for stalled jobs every 30s
    maxStalledCount: 1,      // Max 1 stalled attempt
  },
});
```

### Redis Optimization

```bash
# Redis configuration for production
redis-server \
  --maxmemory 512mb \
  --maxmemory-policy noeviction \
  --appendonly yes \
  --appendfsync everysec \
  --save 900 1
```

## 🧪 Testing

### Unit Tests

```bash
# Run queue tests
pnpm test:unit queues

# Run integration tests
pnpm test:integration
```

### Load Testing

```bash
# Test queue performance
docker-compose exec app node scripts/queue-load-test.js
```

## 📚 API Reference

### Queue Adapter Interface

```typescript
interface QueueAdapter {
  addJob(queueName: string, data: any, options?: JobOptions): Promise<void>;
  getWorker(queueName: string): Worker;
  close(): Promise<void>;
  isHealthy(): boolean;
}
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REDIS_URL` | Yes | - | Redis connection string |
| `USE_REDIS` | No | true | Enable Redis-based queues |
| `QUEUE_PREFIX` | No | slice-bridge | Queue name prefix |
| `MAX_CONCURRENT_JOBS` | No | 5 | Max concurrent job processing |
| `JOB_RETRY_ATTEMPTS` | No | 3 | Number of retry attempts |
| `JOB_RETRY_BACKOFF_MS` | No | 5000 | Retry backoff delay |

## 🤝 Contributing

### Development Workflow

1. **Setup Development Environment**
   ```bash
   git clone <repository>
   cd slice-bridge-service
   pnpm install
   cp .env.example .env
   # Configure environment variables
   docker-compose up -d redis
   pnpm dev
   ```

2. **Making Changes**
   - Follow TypeScript conventions
   - Add tests for new features
   - Update documentation
   - Test with both Redis and memory adapters

3. **Testing Changes**
   ```bash
   pnpm test
   pnpm build
   docker-compose build --no-cache
   docker-compose up -d
   ```

## 📄 License

This project is licensed under the MIT License.

---

## 🎯 Next Steps

1. **Enhanced Monitoring**: Implement Prometheus metrics
2. **Queue Analytics**: Add job processing analytics
3. **Auto-scaling**: Implement queue-based auto-scaling
4. **Job Scheduling**: Add scheduled job support
5. **Dead Letter Queue**: Implement failed job recovery

---

**Documentation Version**: 1.0  
**Last Updated**: $(date)  
**Author**: GitHub Copilot Assistant