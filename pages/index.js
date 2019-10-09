import { Button, Icon } from 'antd'
import getConfig from 'next/config'
import { connect } from 'react-redux'

const { publicRuntimeConfig } = getConfig()
const api = require('../lib/api')

function Index({ userRepos, userStaredRepos, user }) {
  if (!user || !user.id) {
    return (
      <div className="root">
        <p>亲，您还没有登录～</p>
        <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>
          点击登录
        </Button>
        <style jsx>{`
          .root {
            height: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="root">
      <div className="user-info">
        <img src={user.avatar_url} alt="user  avatar" className="avatar" />
        <span className="login">{user.login}</span>
        <span className="name">{user.name}</span>
        <span className="bio">{user.bio}</span>
        <p className="email">
          <Icon type="mail" style={{ marginRight: 10 }}></Icon>
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </p>
      </div>
      <div className="user-repos">
        <p>User Repos</p>
      </div>

      <style jsx>{`
        .root {
          display: flex;
          align-items: flex-start;
          padding: 20px 0;
        }

        .user-info {
          with: 200px;
          margin-right: 40px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }

        .login {
          font-weight: 800;
          font-size: 20px;
          margin-top: 20px;
        }

        .name {
          font-size: 16px;
          color: #777;
        }

        .bio {
          margin-top: 20px;
          color: #333;
        }

        .avatar {
          width: 100%;
          border-radius: 5px;
        }
      `}</style>
    </div>
  )
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

export default connect(function mapState(state) {
  return {
    user: state.user,
  }
})(Index)
