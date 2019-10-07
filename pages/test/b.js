import React, { useState, useEffect } from 'react'

function MyCountFunc() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <h2>{count}</h2>
}

export default MyCountFunc
