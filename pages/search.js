import { withRouter } from 'next/router'
import Link from 'next/link'
import { Row, Col, List } from 'antd'

const api = require('../lib/api')

const LANGUAGES = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Rust']
const SORT_TYPES = [
  {
    name: 'Best Match',
  },
  {
    name: 'Most Stars',
    value: 'stars',
    order: 'desc',
  },
  {
    name: 'Fewest Stars',
    value: 'stars',
    order: 'asc',
  },
  {
    name: 'Most Forks',
    value: 'forks',
    order: 'desc',
  },
  {
    name: 'Fewest Forks',
    value: 'forks',
    order: 'asc',
  },
]

/**
 * sort: 排序方式
 * order: 排序顺序
 * lang: 仓库项目主语言
 * page: 分页
 */

function Search({ router, repos }) {
  console.log(repos)
  return (
    <div className="root">
      <Row gutter={20}>
        <Col span={6}>
          <List
            bordered
            header={<span className="list-header">语言</span>}
            style={{ marginBottom: 20 }}
            dataSource={LANGUAGES}
            renderItem={(item) => (
              <List.Item>
                <Link href="/search">
                  <a>{item}</a>
                </Link>
              </List.Item>
            )}
          />
          <List
            bordered
            header={<span className="list-header">排序</span>}
            style={{ marginBottom: 20 }}
            dataSource={SORT_TYPES}
            renderItem={(item) => (
              <List.Item>
                <Link href="/search">
                  <a>{item.name}</a>
                </Link>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </div>
  )
}

Search.getInitialProps = async ({ ctx }) => {
  const { query, sort, lang, order, page } = ctx.query

  console.log(ctx.q)

  if (!query) {
    return {
      repos: {
        total_count: 0,
      },
    }
  }

  let queryString = `?q=${query}`
  if (lang) queryString += `+language:${lang}`
  if (sort) queryString += `&sort=${sort}&order=${order || 'desc'}`
  if (page) queryString += `&page=${page}`

  const result = await api.request(
    {
      url: `/search/repositories${queryString}`,
    },
    ctx.req,
    ctx.res
  )

  return {
    repos: result,
  }
}

export default withRouter(Search)
