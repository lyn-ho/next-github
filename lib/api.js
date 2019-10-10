const axios = require('axios')

const github_base_url = 'https://api.github.com'

const isServer = typeof window === 'undefined'

async function requestGithub(method, url, data, headers) {
  return await axios({
    method,
    url: `${github_base_url}${url}`,
    data,
    headers,
    proxy: false,
  })
}

async function request({ method = 'GET', url, data = {} }, req, res) {
  if (!url) {
    throw Error('url must provide')
  }

  console.log('request url ----- ', url)

  if (isServer) {
    const { session } = req
    const githubAuth = session.githubAuth || {}
    const headers = {}

    if (githubAuth.access_token) {
      headers[
        'Authorization'
      ] = `${githubAuth.token_type} ${githubAuth.access_token}`
    }

    return await requestGithub(method, url, data, headers)
  } else {
    return await axios({
      method,
      url: `/github${url}`,
      data,
    })
  }
}

module.exports = {
  request,
  requestGithub,
}
