const search = require('./search')
window.exports = {
  'set-host': {
    mode: 'list',

    args: {
      enter: (action, callbackSetList) => {
        callbackSetList([
          {
            title: '请在输入框输入 GitLab Host',
            description: `当前 GitLab Host: ${utools.dbStorage.getItem('gitlab_host') || 'https://gitlab.com'}`,
          },
        ])
      },
      search: (action, searchWord, callbackSetList) => {
        if (searchWord) {
          callbackSetList([
            {
              title: `点击设置 GitLab Host 为 ${searchWord}`,
              data: searchWord,
            },
          ])
        }
      },
      select: (action, itemData) => {
        utools.dbStorage.setItem('gitlab_host', itemData.data)
        utools.outPlugin()
      },
    },
  },
  'set-token': {
    mode: 'list',
    args: {
      enter: (action, callbackSetList) => {
        callbackSetList([
          {
            title: '请在输入框输入 GitLab Token',
            description: `当前 GitLab Token: ${utools.dbStorage.getItem('gitlab_api_token') || ''}`,
          },
        ])
      },
      search: (action, searchWord, callbackSetList) => {
        if (searchWord) {
          callbackSetList([
            {
              title: `点击设置 GitLab Token 为 ${searchWord}`,
              data: searchWord,
            },
          ])
        }
      },
      select: (action, itemData) => {
        utools.dbStorage.setItem('gitlab_api_token', itemData.data)
        utools.outPlugin()
      },
    },
  },
  'search-gitlab-projects': {
    mode: 'list',
    args: {
      enter: (action, callbackSetList) => {
        setTimeout(() => {
          utools.setSubInputValue(action.payload)
        }, 50)
      },
      search: async (action, searchWord, callbackSetList) => {
        callbackSetList(await search('projects', searchWord))
      },
      select: (action, itemData) => {
        utools.hideMainWindow()
        utools.shellOpenExternal(itemData.data)
        utools.outPlugin()
      },
    },
  },
  'search-gitlab-issues': {
    mode: 'list',
    args: {
      enter: (action, callbackSetList) => {
        setTimeout(() => {
          utools.setSubInputValue(action.payload)
        }, 50)
      },
      search: async (action, searchWord, callbackSetList) => {
        if (!searchWord) return
        callbackSetList(await search('issues', searchWord))
      },
      select: (action, itemData) => {
        utools.hideMainWindow()
        utools.shellOpenExternal(itemData.data)
        utools.outPlugin()
      },
    },
  },
  'search-gitlab-merge-requests': {
    mode: 'list',
    args: {
      enter: (action, callbackSetList) => {
        setTimeout(() => {
          utools.setSubInputValue(action.payload)
        }, 50)
      },
      search: async (action, searchWord, callbackSetList) => {
        if (!searchWord) return
        callbackSetList(await search('merge_requests', searchWord))
      },
      select: (action, itemData) => {
        utools.hideMainWindow()
        utools.shellOpenExternal(itemData.data)
        utools.outPlugin()
      },
    },
  },
}
