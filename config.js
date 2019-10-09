const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user%20repo'
const github = {
  client_id: '034659d6d9443e25a018',
  client_secret: '50a6ffe554863434730884ab59d48334bbe6d745',
  request_token_url: 'https://github.com/login/oauth/access_token',
}

module.exports = {
  github,
  GITHUB_OAUTH_URL,
  OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${github.client_id}&scope=${SCOPE}`,
}
