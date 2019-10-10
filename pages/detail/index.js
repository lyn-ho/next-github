import withRepoBasic from '../../components/with-repo-basic'
import MDRenderer from '../../components/MarkdownRenderer'
import api from '../../lib/api'

function Detail({ readme }) {
  return <MDRenderer content={readme.content} isBase64={true} />
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
