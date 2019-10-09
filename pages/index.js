const api = require('../lib/api')

function Index({ userRepos, userStaredRepos, isLogin }) {
  console.log('is login ', isLogin)
  console.log(userRepos)
  console.log(userStaredRepos)
  return <span>Index</span>
}

Index.getInitialProps = async ({ ctx, reduxStore }) => {
  const user = reduxStore.getState().user

  if (!user || !user.id) {
    return {
      isLogin: false,
    }
  }

  const repos = await api.request({ url: '/user/repos' }, ctx.req, ctx.res)

  const staredRepos = await api.request(
    { url: '/user/starred' },
    ctx.req,
    ctx.res
  )

  return {
    isLogin: true,
    userRepos: repos.data,
    userStaredRepos: staredRepos.data,
  }
}

export default Index
