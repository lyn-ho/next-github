import { useEffect } from 'react'
import axios from 'axios'
// import Router from 'next/router'
import { connect } from 'react-redux'
import getConfig from 'next/config'

import { add } from '../store'

const { publicRuntimeConfig } = getConfig()

const events = [
  'routeChangeStart',
  'routeChangeComplete',
  'routeChangeError',
  'beforeHistoryChange',
  'hashChangeStart',
  'hashChangeComplete',
]

// function makeEvent(type) {
//   return (...args) => {
//     console.log(type, ...args)
//   }
// }

// events.forEach((event) => {
//   Router.events.on(event, makeEvent(event))
// })

const Index = ({ counter, username, add, rename }) => {
  useEffect(() => {
    axios.get('/api/user/info').then((resp) => {
      console.log(resp)
    })
  }, [])

  return (
    <>
      <h3>Count: {counter}</h3>
      <h3>Username: {username}</h3>
      <input value={username} onChange={(e) => rename(e.target.value)} />
      <button onClick={() => add(counter)}>do add</button>
      <a href={publicRuntimeConfig.OAUTH_URL}>去登录</a>
    </>
  )
}

Index.getInitialProps = async ({ reduxStore }) => {
  reduxStore.dispatch(add(3))
  return {}
}

export default connect(
  function mapStateToProps(state) {
    return {
      counter: state.counter.count,
      username: state.user.username,
    }
  },
  function mapDispatchToProps(dispatch) {
    return {
      add: (num) => dispatch({ type: 'ADD', num }),
      rename: (name) => dispatch({ type: 'UPDATE_USERNAME', name }),
    }
  }
)(Index)
