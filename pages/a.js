import { withRouter } from 'next/router'
import Link from 'next/link'

const A = ({ router, name }) => (
  <Link href="#aaa">
    <a>
      A{router.query.id} {name}
    </a>
  </Link>
)

A.getInitialProps = async () => {
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
