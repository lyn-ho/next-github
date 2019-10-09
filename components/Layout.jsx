import { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  Button,
  Layout,
  Icon,
  Input,
  Avatar,
  Tooltip,
  Dropdown,
  Menu,
} from 'antd'
import getConfig from 'next/config'
import { connect } from 'react-redux'

import Container from './Container'

const { publicRuntimeConfig } = getConfig()

const { Header, Content, Footer } = Layout

const githubIconStyle = {
  color: 'white',
  fontSize: 40,
  display: 'block',
  paddingTop: 10,
  marginRight: 20,
}

const footerStyle = {
  textAlign: 'center',
}

const Comp = ({ color, children, style }) => (
  <div style={{ color, ...style }}>{children}</div>
)

function MyLayout({ children, user }) {
  const [search, setSearch] = useState('')

  const handleSearchChange = useCallback(
    (evt) => {
      setSearch(evt.target.value)
    },
    [setSearch]
  )

  const handleOnSearch = useCallback(() => {}, [])

  const userDropdown = (
    <Menu>
      <Menu.Item>
        <a href="#">登出</a>
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout>
      <Header>
        <Container renderer={<div className="header-inner" />}>
          <div className="header-left">
            <div className="logo">
              <Icon type="github" style={githubIconStyle} />
            </div>
            <div>
              <Input.Search
                placeholder="搜索仓库"
                value={search}
                onChange={handleSearchChange}
                onSearch={handleOnSearch}
              />
            </div>
          </div>
          <div className="header-right">
            <div className="user">
              {user && user.id ? (
                <Dropdown overlay={userDropdown}>
                  <a href="/">
                    <Avatar size={40} src={user.avatar_url} />
                  </a>
                </Dropdown>
              ) : (
                <Tooltip title="点击进行登录">
                  <a href={publicRuntimeConfig.OAUTH_URL}>
                    <Avatar size={40} icon="user" />
                  </a>
                </Tooltip>
              )}
            </div>
          </div>
        </Container>
      </Header>
      <Content>
        <Container>{children}</Container>
      </Content>
      <Footer style={footerStyle}>
        Develop by Lyn @
        <a href="mailto:lyn4develop@gmail.com">lyn4develop@gmail.com</a>
      </Footer>

      <style jsx>{`
        .content {
          color: red;
        }

        .header-inner {
          display: flex;
          justify-content: space-between;
        }

        .header-left {
          display: flex;
          justify-content: flex-start;
        }
      `}</style>

      <style jsx global>{`
        #__next {
          height: 100%;
        }

        .ant-layout {
          height: 100%;
        }

        .ant-layout-header {
          padding-left: 0;
          padding-right: 0;
        }
      `}</style>
    </Layout>
  )
}

export default connect(function mapState(state) {
  return {
    user: state.user,
  }
})(MyLayout)
