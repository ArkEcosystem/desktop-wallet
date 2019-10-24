/* eslint-disable no-unused-vars */
import path from 'path'
import { castArray } from 'lodash'
import { NodeVM } from 'vm2'
import {
  HTTP,
  MESSAGING,
  WEBSOCKET,
  PUBLIC,
  TIMERS,
  PROFILE_ALL,
  PROFILE_CURRENT,
  PEER_CURRENT,
  STORAGE,
  AUDIO,
  EVENTS,
  ALERTS
} from './plugin-permission'
import { createHttpSandbox } from './sandbox/http-sandbox'
import { createMessagingSandbox } from './sandbox/messaging-sandbox'
import { createWebsocketSandbox } from './sandbox/websocket-sandbox'
import { createFontAwesomeSandbox } from './sandbox/font-awesome-sandbox'
import { createRouteSandbox } from './sandbox/route-sandbox'
import { createTimersSandbox } from './sandbox/timers-sandbox'
import { createProfileAllSandbox } from './sandbox/profile-all-sandbox'
import { createProfileCurrentSandbox } from './sandbox/profile-current-sandbox'
import { createPeerCurrentSandbox } from './sandbox/peer-current-sandbox'
import { createStorageSandbox } from './sandbox/storage-sandbox'
import { createAudioSandbox } from './sandbox/audio-sandbox'
import { createEventsSandbox } from './sandbox/events-sandbox'
import { createAlertsSandbox } from './sandbox/alerts-sandbox'

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

  getSandbox (loadApi = true) {
    if (loadApi) {
      return {
        ...this.sandbox,
        walletApi: this.walletApi
      }
    }

    return {
      document
    }
  }

  getVM ({ loadApi }) {
    const fullPath = this.plugin.fullPath

    return new NodeVM({
      sandbox: this.getSandbox(loadApi),
      require: {
        builtin: [],
        context: 'sandbox',
        resolve: function (source) {
          return path.resolve(fullPath, 'src/', source)
        },
        external: {
          modules: [
            path.resolve(fullPath),
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
      [ALERTS.name]: createAlertsSandbox(this.walletApi, this.app),
      [AUDIO.name]: createAudioSandbox(this.sandbox),
      [EVENTS.name]: createEventsSandbox(this.walletApi, this.app),
      [HTTP.name]: createHttpSandbox(this.walletApi, this.plugin),
      [MESSAGING.name]: createMessagingSandbox(this.walletApi, this.app),
      [PEER_CURRENT.name]: createPeerCurrentSandbox(this.walletApi, this.app),
      [PROFILE_ALL.name]: createProfileAllSandbox(this.walletApi, this.app),
      [PROFILE_CURRENT.name]: createProfileCurrentSandbox(this.walletApi, this.app),
      [PUBLIC.name]: [
        createFontAwesomeSandbox(this.walletApi),
        createRouteSandbox(this.walletApi, this.plugin, this.app)
      ],
      [STORAGE.name]: createStorageSandbox(this.walletApi, this.app, this.plugin),
      [TIMERS.name]: createTimersSandbox(this.walletApi, this.app),
      [WEBSOCKET.name]: createWebsocketSandbox(this.walletApi, this.app, this.plugin)
    }
  }
}
