import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const userInitialState = {}

// 纯函数
// 返回新对象 （组件更新判断）
// 通过 combineReducers 进行合并

function userReducer(state = userInitialState, action) {
  switch (action.type) {
    default:
      return state
  }
}

const allReducers = combineReducers({
  user: userReducer,
})

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
