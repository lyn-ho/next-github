const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const session = require('koa-session')
const Redis = require('ioredis')

const auth = require('./server/auth')

const RedisSessionStore = require('./server/session-store')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const redis = new Redis()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  server.keys = ['Lyn develop Github App']
  const SESSION_CONFIG = {
    key: 'jid',
    // maxAge: 60 * 1000,
    store: new RedisSessionStore(redis),
  }

  server.use(session(SESSION_CONFIG, server))

  // github oAuth
  auth(server)

  router.get('/a/:id', async (ctx) => {
    const id = ctx.params.id

    await handle(ctx.req, ctx.res, {
      pathname: '/a',
      query: { id },
    })
    ctx.respond = false
  })

  router.get('/api/user/info', async (ctx) => {
    const user = ctx.session.userInfo
    if (!user) {
      ctx.status = 401
      ctx.body = 'Need Login'
    } else {
      ctx.body = ctx.session.userInfo
      ctx.set('Content-Type', 'application/json')
    }
  })

  server.use(router.routes())

  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.listen(3000, () => {
    console.log('koa server listening on 3000')
  })
})
