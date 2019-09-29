import { withRouter } from 'next/router'
import Link from 'next/link'

const A = ({ router }) => (
  <Link href="#aaa">
    <a>A{router.query.id}</a>
  </Link>
)

export default withRouter(A)
