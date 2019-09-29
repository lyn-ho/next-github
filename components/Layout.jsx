import Link from 'next/link'
import { Button } from 'antd'

export default ({ children }) => (
  <>
    <header>
      <Link href="/a?id=1" as="/a/1">
        <Button>to a</Button>
      </Link>
      <Link href="/test/b">
        <Button>to b</Button>
      </Link>
    </header>
    {children}
  </>
)
