import { useState, useCallback } from 'react'
import { Avatar, Button, Select, Spin } from 'antd'
import dynamic from 'next/dynamic'

import withRepoBasic from '../../components/with-repo-basic'
import SearchUser from '../../components/SearchUser'

import api from '../../lib/api'
import { getLastUpdated } from '../../lib/util'

const MDRenderer = dynamic(() => import('../../components/MarkdownRenderer'))

function IssueDetail({ issue }) {
  return (
    <div className="root">
      <MDRenderer content={issue.body} />
      <div className="actions">
        <Button href={issue.html_url} target="_blank">
          打开 Issue 讨论页面
        </Button>
      </div>
      <style jsx>{`
        .root {
          background: #fafafa;
          padding: 20px;
        }

        .actions {
          text-align: right;
        }
      `}</style>
    </div>
  )
}

function IssueItem({ issue }) {
  const [showDetail, setShowDetail] = useState(false)

  const toggleShowDetail = useCallback(() => {
    setShowDetail((showDetail) => !showDetail)
  }, [])

  return (
    <div>
      <div className="issue">
        <Button
          type="primary"
          size="small"
          style={{ position: 'absolute', right: 10, top: 10 }}
          onClick={toggleShowDetail}
        >
          {showDetail ? '隐藏' : '查看'}
        </Button>
        <div className="avatar">
          <Avatar src={issue.user.avatar_url} shape="square" size={50} />
        </div>
        <div className="main-info">
          <h6>
            <span>{issue.title}</span>
          </h6>
          <p className="sub-info">
            <span>Updated at {getLastUpdated(issue.updated_at)}</span>
          </p>
        </div>

        <style jsx>{`
          .issue {
            display: flex;
            position: relative;
            padding: 10px;
          }

          .issue:hover {
            background: #fafafa;
          }

          .issue + .issue {
            border-top: 1px solid #eee;
          }

          .main-info > h6 {
            max-width: 600px;
            font-size: 16px;
            padding-right: 40px;
          }

          .avatar {
            margin-right: 20px;
          }

          .sub-info {
            margin-bottom: 0;
          }

          .sub-info > span + span {
            display: inline-block;
            margin-left: 20px;
            font-size: 12px;
          }
        `}</style>
      </div>
      {showDetail ? <IssueDetail issue={issue} /> : null}
    </div>
  )
}

function makeQuery(creator, state, labels) {
  let creatorStr = creator ? `creator=${creator}` : ''
  let stateStr = state ? `state=${state}` : ''
  let labelStr = ''
  if (labels && labels.length) {
    labelStr = `labels=${labels.join(',')}`
  }

  const arr = []

  creatorStr && arr.push(creatorStr)
  stateStr && arr.push(stateStr)
  labelStr && arr.push(labelStr)

  return arr.length ? `?${arr.join('&')}` : ''
}

function Issues({ initialIssues, labels, owner, name }) {
  const [creator, setCreator] = useState()
  const [state, setState] = useState()
  const [label, setLabel] = useState([])
  const [issues, setIssues] = useState(initialIssues)
  const [fetching, setFetching] = useState(false)

  const handleCreatorChange = useCallback((value) => {
    setCreator(value)
  })

  const handleStateChange = useCallback((value) => {
    setState(value)
  })

  const handleLabelChange = useCallback((value) => {
    setLabel(value)
  })

  const handleSearch = useCallback(() => {
    setFetching(true)

    api
      .request({
        url: `/repos/${owner}/${name}/issues${makeQuery(
          creator,
          state,
          label
        )}`,
      })
      .then((resp) => {
        setIssues(resp.data)
        setFetching(false)
      })
      .catch((err) => {
        console.log(err)
        setFetching(false)
      })
  }, [owner, name, creator, state, label])

  return (
    <div className="root">
      <div className="search">
        <SearchUser onChange={handleCreatorChange} value={creator} />
        <Select
          placeholder="状态"
          onChange={handleStateChange}
          value={state}
          style={{ width: 200, marginLeft: 20 }}
        >
          <Select.Option value="all">All</Select.Option>
          <Select.Option value="open">Open</Select.Option>
          <Select.Option value="closed">Closed</Select.Option>
        </Select>
        <Select
          mode="multiple"
          placeholder="Label"
          onChange={handleLabelChange}
          value={label}
          style={{ flexGrow: 1, marginLeft: 20, marginRight: 20 }}
        >
          {labels.map((la) => (
            <Select.Option value={la.name} key={la.id}>
              {la.name}
            </Select.Option>
          ))}
        </Select>
        <Button type="primary" onClick={handleSearch} disabled={fetching}>
          搜索
        </Button>
      </div>
      {fetching ? (
        <div className="loading">
          <Spin />
        </div>
      ) : (
        <div className="issues">
          {issues.map((issue) => (
            <IssueItem key={issue.id} issue={issue} />
          ))}
        </div>
      )}

      <style jsx>{`
        .issues {
          border: 1px solid #eee;
          border-radius: 5px;
          margin-top: 20px;
          margin-bottom: 20px;
        }

        .search {
          display: flex;
        }

        .loading {
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}

Issues.getInitialProps = async ({
  ctx: {
    req,
    res,
    query: { owner, name },
  },
}) => {
  const fetches = await Promise.all([
    await api.request(
      {
        url: `/repos/${owner}/${name}/issues`,
      },
      req,
      res
    ),
    await api.request(
      {
        url: `/repos/${owner}/${name}/labels`,
      },
      req,
      res
    ),
  ])

  return {
    owner,
    name,
    initialIssues: fetches[0].data,
    labels: fetches[1].data,
  }
}

export default withRepoBasic(Issues, 'issues')
