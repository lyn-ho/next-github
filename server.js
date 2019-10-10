const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const session = require('koa-session')
const Redis = require('ioredis')
const koaBody = require('koa-body')
const atob = require('atob')

const auth = require('./server/auth')
const api = require('./server/api')

const RedisSessionStore = require('./server/session-store')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const redis = new Redis()

global.atob = atob

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  server.keys = ['Lyn develop Github App']

  server.use(koaBody())

  const SESSION_CONFIG = {
    key: 'jid',
    // maxAge: 60 * 1000,
    store: new RedisSessionStore(redis),
  }

  server.use(session(SESSION_CONFIG, server))

  // github oAuth
  auth(server)
  api(server)

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
    ctx.req.session = ctx.session
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.listen(3000, () => {
    console.log('koa server listening on 3000')
  })
})
