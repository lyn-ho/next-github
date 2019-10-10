import { useEffect } from 'react'
import Link from 'next/link'
import { withRouter } from 'next/router'

import Repo from './Repo'

import api from '../lib/api'
import { get, cache } from '../lib/repo-basic-cache'

function makeQuery(queryObject) {
  const query = Object.entries(queryObject)
    .reduce((res, entry) => {
      res.push(entry.join('='))
      return res
    }, [])
    .join('&')

  return `?${query}`
}

const isServer = typeof window === 'undefined'

export default function(Comp, type = 'index') {
  function WithDetail({ repoBasic, router, ...rest }) {
    useEffect(() => {
      if (!isServer) {
        cache(repoBasic)
      }
    }, [])

    const query = makeQuery(router.query)
    return (
      <div className="root">
        <div className="repo-basic">
          <Repo repo={repoBasic} />
          <div className="tabs">
            {type === 'index' ? (
              <span className="tab">Readme</span>
            ) : (
              <Link href={`/detail${query}`}>
                <a className="tab index">Readme</a>
              </Link>
            )}
            {type === 'issues' ? (
              <span className="tab">Issues</span>
            ) : (
              <Link href={`/detail/issues${query}`}>
                <a className="tab issues">Issues</a>
              </Link>
            )}
          </div>
        </div>
        <div>
          <Comp {...rest} />
        </div>
        <style jsx>{`
          .root {
            padding-top: 20px;
          }

          .repo-basic {
            padding: 20px;
            border: 1px solid #eee;
            margin-bottom: 20px;
            border-radius: 5px;
          }

          .tab + .tab {
            margin-left: 20px;
          }
        `}</style>
      </div>
    )
  }

  WithDetail.getInitialProps = async (context) => {
    const { ctx } = context
    const { owner, name } = ctx.query

    const full_name = `${owner}/${name}`

    let pageData = {}
    if (Comp.getInitialProps) {
      pageData = await Comp.getInitialProps(context)
    }

    console.log('get cache ---- ', full_name, ' ----- ', get(full_name))
    if (get(full_name)) {
      return {
        repoBasic: get(full_name),
        ...pageData,
      }
    }

    const result = await api.request(
      {
        url: `/repos/${owner}/${name}`,
      },
      ctx.req,
      ctx.res
    )

    return {
      repoBasic: result.data,
      ...pageData,
    }
  }

  return withRouter(WithDetail)
}
