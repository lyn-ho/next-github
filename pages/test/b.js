import React, { useState, useEffect, useReducer, useLayoutEffect } from 'react'

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

    return () => console.log('effect detached')
  }, [count]) // [], [name, count]  dependencies

  useLayoutEffect(() => {
    console.log('layout effect invoked')

    return () => console.log('layout effect detached')
  }, [count]) // [], [name, count]  dependencies

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => dispatchCount({ type: 'add' })}>{count}</button>
    </div>
  )
}

export default MyCountFunc
