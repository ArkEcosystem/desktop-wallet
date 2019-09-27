import path from 'path'
import fs from 'fs'

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

    this.components = {}
    this.avatars = []
    this.routes = []
  }

  static validate (pluginPath) {
    const structureExists = [
      'package.json',
      'src',
      'src/index.js'
    ]

    for (const pathCheck of structureExists) {
      if (!fs.existsSync(path.resolve(pluginPath, pathCheck))) {
        throw new Error(`'${pathCheck}' does not exist`)
      }
    }
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
