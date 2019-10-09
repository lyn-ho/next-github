import { withRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
// import moment from 'moment'

const Comp = dynamic(import('../components/comp'))

const Title = styled.h1`
  color: yellow;
  font-size: 23px;
`

const A = ({ router, name, time }) => (
  <>
    <Title>This is title {time}</Title>
    <Comp />
    <Link href="#aaa">
      <a className="link">
        A{router.query.id} {name}
      </a>
    </Link>
    <style jsx>{`
      a {
        color: red;
      }
      .link {
        color: grey;
      }
    `}</style>
  </>
)

A.getInitialProps = async (ctx) => {
  const moment = await import('moment')

  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'tom',
        time: moment.default(Date.now() - 60 * 1000).fromNow(),
      })
    }, 1000)
  })

  return await promise
}

export default withRouter(A)
