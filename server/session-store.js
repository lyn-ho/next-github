function getRedisSessionId(sid) {
  return `ssid:${sid}`
}

class RedisSessionStore {
  constructor(client) {
    this.client = client
  }

  async get(sid) {
    const id = getRedisSessionId(sid)
    console.log('get session', id)
    const data = await this.client.get(id)

    if (!data) {
      return null
    }

    try {
      const res = JSON.parse(data)
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async set(sid, sess, ttl) {
    const id = getRedisSessionId(sid)
    console.log('set session', id)

    if (typeof ttl === 'number') {
      ttl = Math.ceil(ttl / 1000)
    }

    try {
      const sessStr = JSON.stringify(sess)

      if (ttl) {
        await this.client.setex(id, ttl, sessStr)
      } else {
        await this.client.set(id, sessStr)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async destroy(sid) {
    const id = getRedisSessionId(sid)
    console.log('destroy session', id)

    await this.client.del(id)
  }
}

module.exports = RedisSessionStore
