const axios = require('axios')
const tunnel = require('tunnel')

const tunnelProxy = tunnel.httpsOverHttp({
  proxy: {
    host: 'you_host',
    port: 'you_port',
  },
})

const config = require('../config')

const { client_id, client_secret, request_token_url } = config.github

const data = {
  client_id,
  client_secret,
  code: 'd00a66f79930cc5a0f20',
}

console.log(request_token_url)
console.log(data)

axios({
  method: 'post',
  url: request_token_url,
  data: {
    client_id,
    client_secret,
    code: 'd00a66f79930cc5a0f20',
  },
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  proxy: false,
})
  .then((res) => {
    console.log(res.data)
  })
  .catch((err) => {
    console.log('err ---- ', err)
  })
