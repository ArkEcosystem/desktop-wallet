/* eslint-disable no-unused-vars */
import path from 'path'
import { castArray } from 'lodash'
import { NodeVM } from 'vm2'
import { UI_COMPONENTS, HTTP, MESSAGING, THEMES, WEBFRAME, WEBSOCKET, PUBLIC, TIMERS } from './plugin-permission'
import { createUiComponentsPermission } from './sandbox/ui-components-sandbox'
import { createHttpSandbox } from './sandbox/http-sandbox'
import { createMessagingSandbox } from './sandbox/messaging-sandbox'
import { createThemeSandbox } from './sandbox/themes-sandbox'
import { createWebFrameSandbox } from './sandbox/webframe-sandbox'
import { createWebsocketSandbox } from './sandbox/websocket-sandbox'
import { createFontAwesomeSandbox } from './sandbox/font-awesome-sandbox'
import { createRouteSandbox } from './sandbox/route-sandbox'
import { createTimersSandbox } from './sandbox/timers-sandbox'

export class PluginSandbox {
  constructor ({
    app,
    plugin
  }) {
    this.app = app
    this.plugin = plugin

    this.sandbox = {}
    this.walletApi = {}

    this.sandboxes = this.__mapPermissionsToSandbox()
  }

  getSandbox () {
    return {
      ...this.sandbox,
      walletApi: this.walletApi,
      document
    }
  }

  getVM () {
    const fullPath = this.plugin.fullPath

    return new NodeVM({
      sandbox: this.getSandbox(),
      require: {
        builtin: [],
        context: 'sandbox',
        resolve: function (source) {
          return path.resolve(fullPath, 'src/', source)
        },
        external: {
          modules: [
            path.resolve(fullPath, 'src/'),
            'vue/dist/vue.common.js'
          ],
          transitive: true
        },
        root: [
          this.plugin.rootPath,
          path.resolve(fullPath, 'src/')
        ]
      }
    })
  }

  async install () {
    await this.__run(this.sandboxes[PUBLIC.name])

    for (const permissionName of this.plugin.config.permissions) {
      await this.__run(this.sandboxes[permissionName])
    }
  }

  async __run (sandboxes = []) {
    for (const sandbox of castArray(sandboxes)) {
      await sandbox()
    }
  }

  __mapPermissionsToSandbox () {
    return {
      [UI_COMPONENTS.name]: createUiComponentsPermission(this.walletApi),
      [HTTP.name]: createHttpSandbox(this.walletApi, this.plugin),
      [MESSAGING.name]: createMessagingSandbox(this.walletApi, this.app),
      [THEMES.name]: createThemeSandbox(),
      [WEBFRAME.name]: createWebFrameSandbox(this.walletApi),
      [WEBSOCKET.name]: createWebsocketSandbox(this.walletApi, this.app, this.plugin),
      [TIMERS.name]: createTimersSandbox(this.walletApi, this.app),
      [PUBLIC.name]: [
        createFontAwesomeSandbox(this.walletApi),
        createRouteSandbox(this.walletApi, this.plugin, this.app)
      ]
    }
  }
}
