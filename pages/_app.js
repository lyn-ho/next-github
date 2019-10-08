import App, { Container } from 'next/app'
import 'antd/dist/antd.css'
import { Provider } from 'react-redux'

import MyContext from '../lib/my-context'
import Layout from '../components/Layout'
import store from '../store'

import testHoc from '../lib/test-hoc'

class MyApp extends App {
  state = {
    context: 'value',
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Layout>
          <Provider store={store}>
            <MyContext.Provider value={this.state.context}>
              <Component {...pageProps} />
            </MyContext.Provider>
          </Provider>
        </Layout>
      </Container>
    )
  }
}

export default testHoc(MyApp)
