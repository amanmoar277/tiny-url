import * as redis from "redis"

export namespace RedisService {
  let client

  export const connect = async () => {
    client = redis.createClient(process.env.REDIS_URL)
  }

  export const getClient = () => {
    return client
  }
}

export default RedisService
