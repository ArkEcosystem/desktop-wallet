export class Plugin {
  constructor ({
    config,
    path,
    fullPath,
    rootPath
  }) {
    this.config = config
    this.path = path
    this.fullPath = fullPath
    this.rootPath = rootPath

    this.globalComponents = {}
    this.components = {}
    this.avatars = []
    this.routes = []
  }

  getAvatarComponents () {
    if (!this.avatars) {
      return {}
    }

    const components = {}
    for (const avatarName of this.avatars) {
      if (!this.components[avatarName]) {
        continue
      }

      components[avatarName] = this.components[avatarName]
    }

    return components
  }

  getWalletTabComponent (walletTab) {
    const component = this.components[walletTab.componentName]
    if (!component) {
      throw new Error(`The wallet tab component \`${walletTab.componentName}\` has not be found`)
    }

    return component
  }
}
