import withRepoBasic from '../../components/with-repo-basic'

import api from '../../lib/api'

function Detail({ readme }) {
  console.log(atob(readme.content))
  return <span>Detail Index </span>
}

Detail.getInitialProps = async ({
  ctx: {
    query: { owner, name },
    req,
    res,
  },
}) => {
  const readmeResp = await api.request(
    {
      url: `/repos/${owner}/${name}/readme`,
    },
    req,
    res
  )

  return {
    readme: readmeResp.data,
  }
}

export default withRepoBasic(Detail, 'index')
