const Redis = require('ioredis')

async function test() {
  const redis = new Redis({
    port: 6378,
    password: 'cat',
  })

  const keys = await redis.keys('*')

  await redis.set('a', 123)
  await redis.setex('e', 10, 456)

  console.log(keys)
  console.log(await redis.get('a'))
}

test()
