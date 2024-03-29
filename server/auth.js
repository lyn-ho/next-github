const axios = require('axios')

const config = require('../config')

const { client_id, client_secret, request_token_url } = config.github

module.exports = (server) => {
  server.use(async (ctx, next) => {
    if (ctx.path === '/auth') {
      const code = ctx.query.code

      if (!code) {
        ctx.body = 'code not exist'
        return
      }

      const result = await axios({
        method: 'post',
        url: request_token_url,
        data: {
          client_id,
          client_secret,
          code,
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        proxy: false,
      })

      // console.log('auth ---------- ', result.status, result.data)

      if (result.status === 200) {
        ctx.session.githubAuth = result.data

        const { access_token, token_type } = result.data

        const userInfoResp = await axios({
          url: 'https://api.github.com/user',
          headers: {
            Authorization: `${token_type} ${access_token}`,
          },
          proxy: false,
        })

        // console.log('user info resp --- ', userInfoResp.data)
        ctx.session.userInfo = userInfoResp.data

        ctx.redirect((ctx.session && ctx.session.urlBeforeOAuth) || '/')
        ctx.session.urlBeforeOAuth = ''
      } else {
        const errorMsg = result.data && result.data.error
        ctx.body = `request token failed ${errorMsg}`
      }
    } else {
      await next()
    }
  })

  server.use(async (ctx, next) => {
    const { path, method } = ctx

    if (path === '/logout' && method === 'POST') {
      ctx.session = null
      ctx.body = `logout success`
    } else {
      await next()
    }
  })

  server.use(async (ctx, next) => {
    const { path, method } = ctx

    if (path === '/prepare-auth' && method === 'GET') {
      const { url } = ctx.query
      ctx.session.urlBeforeOAuth = url
      // ctx.body = 'ready'
      ctx.redirect(config.OAUTH_URL)
    } else {
      await next()
    }
  })
}
