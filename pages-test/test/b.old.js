import React, {
  useState,
  useEffect,
  useReducer,
  useLayoutEffect,
  useContext,
  useRef,
} from 'react'

import MyContext from '../../lib/my-context'

function countReducer(state, action) {
  switch (action.type) {
    case 'add':
      return state + 1
    case 'minus':
      return state - 1
    default:
      return state
  }
}

function MyCountFunc() {
  // const [count, setCount] = useState(0)

  const [count, dispatchCount] = useReducer(countReducer, 0)
  const [name, setName] = useState('lyn')

  // setCount(1)
  // setCount(count + 1)  // 闭包陷阱，
  // setCount((c) => c + 1)

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // setCount((c) => c + 1)
  //     dispatchCount({ type: 'add' })
  //   }, 1000)

  //   return () => clearInterval(interval)
  // }, [])

  useEffect(() => {
    console.log('effect invoked')

    console.log(inputRef)

    return () => console.log('effect detached')
  }, [count]) // [], [name, count]  dependencies

  // useLayoutEffect(() => {
  //   console.log('layout effect invoked')

  //   return () => console.log('layout effect detached')
  // }, [count]) // [], [name, count]  dependencies

  const context = useContext(MyContext)

  const inputRef = useRef()

  return (
    <div>
      <input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={() => dispatchCount({ type: 'add' })}>{count}</button>
      <p>{context}</p>
    </div>
  )
}

export default MyCountFunc
