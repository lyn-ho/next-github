import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'

const initialState = {
  count: 0,
}

const userInitialState = {
  username: 'lyn',
  age: 18,
}

const ADD = 'ADD'

// 纯函数
// 返回新对象 （组件更新判断）
// 通过 combineReducers 进行合并
function counterReducer(state = initialState, action) {
  console.log(state, action)
  switch (action.type) {
    case ADD:
      return { count: state.count + (action.num || 1) }
    default:
      return state
  }
}

const UPDATE_USERNAME = 'UPDATE_USERNAME'
function userReducer(state = userInitialState, action) {
  switch (action.type) {
    case UPDATE_USERNAME:
      return {
        ...state,
        username: action.name,
      }
    default:
      return state
  }
}

const allReducers = combineReducers({
  counter: counterReducer,
  user: userReducer,
})

const store = createStore(
  allReducers,
  {
    counter: initialState,
    user: userInitialState,
  },
  applyMiddleware(ReduxThunk)
)

// action creator
function add(num) {
  return { type: ADD, num }
}

function addAsync(num) {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(add(num))
    }, 1000)
  }
}

// console.log(store.getState())
store.dispatch(add(2))
// console.log(store.getState())

store.subscribe(() => {
  console.log('subscribe ----- ', store.getState())
})

// store.dispatch({ type: ADD })
store.dispatch(addAsync(5))
store.dispatch({ type: UPDATE_USERNAME, name: 'test' })

export default store
