import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import axios from 'axios'

const userInitialState = {}

const LOGOUT = 'LOGOUT'

// 纯函数
// 返回新对象 （组件更新判断）
// 通过 combineReducers 进行合并

function userReducer(state = userInitialState, action) {
  switch (action.type) {
    case LOGOUT:
      return {}
    default:
      return state
  }
}

/**
 * {
 *  user: {}
 * }
 */
const allReducers = combineReducers({
  user: userReducer,
})

// action creators

export function logout() {
  return (dispatch) => {
    axios
      .post('/logout')
      .then((resp) => {
        if (resp.status === 200) {
          dispatch({
            type: LOGOUT,
          })
        } else {
          console.log('logout failed, ', resp)
        }
      })
      .catch((err) => {
        console.log('logout failed, ', err)
      })
  }
}

export default function initializeStore(state) {
  const store = createStore(
    allReducers,
    Object.assign(
      {},
      {
        user: userInitialState,
      },
      state
    ),
    composeWithDevTools(applyMiddleware(ReduxThunk))
  )

  return store
}
