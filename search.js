// https://gitlab.com/gitlab-org/gitlab/-/blob/master/doc/api/search.md
const { Gitlab } = require('@gitbeaker/node')

function getGitLabConfig() {
  let gitlabHost = utools.dbStorage.getItem('gitlab_host') || 'https://gitlab.com'
  let gitlabApiToken = utools.dbStorage.getItem('gitlab_api_token') || ''
  return {
    host: gitlabHost,
    token: gitlabApiToken,
  }
}

module.exports = async function search(scope, keyword) {
  const gitlab = new Gitlab(getGitLabConfig())
  if (!keyword) return
  try {
    const results = await gitlab.Search.all(scope, keyword)
    let items = []
    switch (scope) {
      case 'projects':
        results.forEach((result) => {
          let item = {
            title: result.name,
            description: `[${result.path_with_namespace}] ${result.description}`,
            icon: result.avatar_url,
            data: result.web_url,
          }
          items.push(item)
        })
        break

      case 'issues':
        results.forEach((result) => {
          let item = {
            title: result.title,
            description: `${result.description}`,
            data: result.web_url,
          }
          items.push(item)
        })
        break
      case 'merge_requests':
        results.forEach((result) => {
          let item = {
            title: result.title,
            description: `[${result.state}] ${result.description}`,
            icon: result.avatar_url,
            data: result.web_url,
          }
          items.push(item)
        })
        break
    }

    return items
  } catch (e) {
    console.log(e)
  }
}
