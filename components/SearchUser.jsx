import { useState, useCallback, useRef } from 'react'
import { Select, Spin } from 'antd'
import debounce from 'lodash.debounce'

import api from '../lib/api'

const Option = Select.Option

function SearchUser({ onChange, value }) {
  const lastFetchIdRef = useRef(0)
  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState([])

  const fetchUser = useCallback(
    debounce((value) => {
      console.log('fetching user ', value)

      lastFetchIdRef.current += 1
      const fetchId = lastFetchIdRef.current
      setFetching(true)
      setOptions([])

      api.request({ url: `/search/users?q=${value}` }).then((resp) => {
        console.log('users: ', resp)

        if (fetchId !== lastFetchIdRef.current) {
          return
        }
        const data = resp.data.items.map((user) => ({
          text: user.login,
          value: user.login,
        }))

        setFetching(false)
        setOptions(data)
      })
    }, 500),
    []
  )

  const handleChange = (value) => {
    setOptions([])
    setFetching(false)

    onChange(value)
  }

  return (
    <Select
      showSearch={true}
      notFoundContent={fetching ? <Spin size="small" /> : <span>nothing</span>}
      filterOption={false}
      placeholder="创建者"
      value={value}
      onSearch={fetchUser}
      onChange={handleChange}
      allowClear={true}
      style={{ width: 200 }}
    >
      {options.map((op) => (
        <Option value={op.value} key={op.value}>
          {op.text}
        </Option>
      ))}
    </Select>
  )
}

export default SearchUser
