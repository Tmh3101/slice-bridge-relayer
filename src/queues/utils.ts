export const getPortFromRedisUrl = (redisUrl: string): number => {
  try {
    const url = new URL(redisUrl)
    return Number(url.port) || 6379
  } catch {
    return 6379
  }
}

export const getHostFromRedisUrl = (redisUrl: string): string => {
  try {
    const url = new URL(redisUrl)
    return url.hostname
  } catch {
    return 'localhost'
  }
}