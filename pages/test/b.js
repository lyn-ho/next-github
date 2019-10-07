import React, { useState, useEffect, useReducer } from 'react'

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

  // setCount(1)
  // setCount(count + 1)  // 闭包陷阱，
  // setCount((c) => c + 1)

  useEffect(() => {
    const interval = setInterval(() => {
      // setCount((c) => c + 1)
      dispatchCount({ type: 'add' })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <h2>{count}</h2>
}

export default MyCountFunc
