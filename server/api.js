const { requestGithub } = require('../lib/api')

module.exports = (server) => {
  server.use(async (ctx, next) => {
    const { path, method } = ctx

    if (path.startsWith('/github')) {
      const githubAuth = ctx.session && ctx.session.githubAuth
      const headers = {}

      if (githubAuth && githubAuth.access_token) {
        headers[
          'Authorization'
        ] = `${githubAuth.token_type} ${githubAuth.access_token}`
      }

      const result = await requestGithub(
        method,
        ctx.url.replace('/github/', '/'),
        {},
        headers
      )

      ctx.status = result.status
      ctx.body = result.data
    } else {
      await next()
    }
  })
}

// module.exports = (server) => {
//   server.use(async (ctx, next) => {
//     const path = ctx.path

//     if (path.startsWith('/github')) {
//       const githubAuth = ctx.session.githubAuth
//       const githubPath = `${github_base_url}${ctx.url.replace('/github/', '/')}`

//       const token = githubAuth && githubAuth.access_token

//       let headers = {}
//       if (token) {
//         headers['Authorization'] = `${githubAuth.token_type} ${token}`
//       }

//       try {
//         const result = await axios({
//           method: 'get',
//           url: githubPath,
//           headers,
//           proxy: false,
//         })

//         if (result.status === 200) {
//           ctx.body = result.data
//           ctx.set('Content-Type', 'application/json')
//         } else {
//           ctx.status = result.status
//           ctx.body = {
//             success: false,
//           }
//           ctx.set('Content-Type', 'application/json')
//         }
//       } catch (error) {
//         ctx.body = {
//           success: false,
//         }
//         ctx.set('Content-Type', 'application/json')
//         console.log(error)
//       }
//     } else {
//       await next()
//     }
//   })
// }
