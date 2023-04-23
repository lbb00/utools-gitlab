import { Gitlab } from '@gitbeaker/node'

function getGitLabConfig() {
  const gitlabHost = utools.dbStorage.getItem('gitlab_host') || ''
  const gitlabApiToken = utools.dbStorage.getItem('gitlab_api_token') || ''
  return {
    host: gitlabHost && !/^http/.test(gitlabHost) ? `https://${gitlabHost}` : gitlabHost,
    token: gitlabApiToken,
  }
}

// 检查配置是否完整
export function checkConfigTips() {
  const { host, token } = getGitLabConfig()
  if (!(host || token)) {
    return '请先搜索【设置 GitLab Host】和【设置 GitLab Token】完成配置'
  }

  if (!host) {
    return '请搜索【设置 GitLab Host】完成配置'
  }

  if (!token) {
    return '请搜索【设置 GitLab Token】完成配置'
  }

  return null
}

// https://gitlab.com/gitlab-org/gitlab/-/blob/master/doc/api/search.md
let currentSearchKeyword = ''
export async function search(scope, keyword) {
  const gitlab = new Gitlab(getGitLabConfig())
  if (!keyword) {
    return
  }
  try {
    currentSearchKeyword = keyword
    const results = await gitlab.Search.all(scope, keyword)
    if (currentSearchKeyword !== keyword) {
      return
    }
    const items = []
    switch (scope) {
      case 'projects': {
        results.forEach((result) => {
          const item = {
            title: result.name,
            description: `[${result.path_with_namespace}] ${result.description}`,
            icon: result.avatar_url,
            data: result.web_url,
          }
          items.push(item)
        })
        break
      }

      case 'issues': {
        results.forEach((result) => {
          const item = {
            title: result.title,
            description: `${result.description}`,
            data: result.web_url,
          }
          items.push(item)
        })
        break
      }

      case 'merge_requests': {
        results.forEach((result) => {
          const item = {
            title: result.title,
            description: `[${result.state}] ${result.description}`,
            icon: result.avatar_url,
            data: result.web_url,
          }
          items.push(item)
        })
        break
      }
    }

    return items
  } catch (e) {
    console.log(e)
  }
}
