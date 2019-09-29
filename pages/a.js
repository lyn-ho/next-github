import { withRouter } from 'next/router'
import Link from 'next/link'

const A = ({ router, name }) => (
  <>
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
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'tom',
      })
    }, 1000)
  })

  return await promise
}

export default withRouter(A)
