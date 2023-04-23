import { search, checkConfigTips } from './search'

window.exports = {
  'set-host': {
    mode: 'list',

    args: {
      enter: (_action, callbackSetList) => {
        const gitlabHost = utools.dbStorage.getItem('gitlab_host') || ''
        callbackSetList([
          {
            title: '请在输入框输入 GitLab Host',
            description: `当前 GitLab Host: ${gitlabHost}${gitlabHost ? '' : '，例如：https://g.lbb00.com'}`,
          },
        ])
      },
      search: (_action, searchWord, callbackSetList) => {
        if (searchWord) {
          callbackSetList([
            {
              title: `点击/回车 设置 GitLab Host 为 ${searchWord}`,
              data: searchWord,
            },
          ])
        }
      },
      select: (_action, itemData) => {
        if (!itemData.data) {
          return
        }
        utools.dbStorage.setItem('gitlab_host', itemData.data)
        utools.outPlugin()
      },
    },
  },
  'set-token': {
    mode: 'list',
    args: {
      enter: (_action, callbackSetList) => {
        callbackSetList([
          {
            title: '请在输入框输入 GitLab Token',
            description: `当前 GitLab Token: ${utools.dbStorage.getItem('gitlab_api_token') || ''}`,
          },
        ])
      },
      search: (_action, searchWord, callbackSetList) => {
        if (searchWord) {
          callbackSetList([
            {
              title: `点击/回车 设置 GitLab Token 为 ${searchWord}`,
              data: searchWord,
            },
          ])
        }
      },
      select: (_action, itemData) => {
        if (!itemData.data) {
          return
        }
        utools.dbStorage.setItem('gitlab_api_token', itemData.data)
        utools.outPlugin()
      },
    },
  },
  'search-gitlab-projects': searchCommon('projects'),
  'search-gitlab-issues': searchCommon('issues'),
  'search-gitlab-merge-requests': searchCommon('merge_requests'),
}

function searchCommon(type) {
  return {
    mode: 'list',
    args: {
      enter: (action, _callbackSetList) => {
        setTimeout(() => {
          utools.setSubInputValue(action.payload)
        }, 50)
      },
      search: async (_action, searchWord, callbackSetList) => {
        const checkResult = checkConfigTips()
        if (checkResult) {
          callbackSetList([
            {
              title: checkResult,
            },
          ])
          return
        }
        if (!searchWord) {
          return
        }
        callbackSetList([
          {
            title: '搜索中...',
          },
        ])
        callbackSetList(await search(type, searchWord))
      },
      select: (_action, itemData) => {
        utools.shellOpenExternal(itemData.data)
      },
    },
  }
}
