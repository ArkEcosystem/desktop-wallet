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
import * as HttpSandbox from './sandbox/http-sandbox'
import * as MessagingSandbox from './sandbox/messaging-sandbox'
import * as WebsocketSandbox from './sandbox/websocket-sandbox'
import * as FontAwesomeSandbox from './sandbox/font-awesome-sandbox'
import * as RouteSandbox from './sandbox/route-sandbox'
import * as TimersSandbox from './sandbox/timers-sandbox'
import * as ProfileAllSandbox from './sandbox/profile-all-sandbox'
import * as ProfileCurrentSandbox from './sandbox/profile-current-sandbox'
import * as PeerCurrentSandbox from './sandbox/peer-current-sandbox'
import * as StorageSandbox from './sandbox/storage-sandbox'
import * as AudioSandbox from './sandbox/audio-sandbox'
import * as EventsSandbox from './sandbox/events-sandbox'
import * as AlertsSandbox from './sandbox/alerts-sandbox'

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

  // Robust VM with relative module resolution and properties implemented by permission
  getComponentVM () {
    return new NodeVM({
      sandbox: {
        ...this.sandbox,
        walletApi: this.walletApi
      },
      require: {
        builtin: [],
        context: 'sandbox',
        external: {
          modules: [],
          transitive: true
        },
        root: [
          path.resolve(this.plugin.fullPath)
        ]
      }
    })
  }

  // Basic VM with access to properties required to render elements
  getPluginVM () {
    const { rootPath } = this.plugin

    return new NodeVM({
      sandbox: {
        document
      },
      require: {
        context: 'sandbox',
        resolve: function (source) {
          return path.resolve(rootPath, 'node_modules', source)
        },
        external: ['vue']
      }
    })
  }

  async install () {
    await this.__run(this.sandboxes[PUBLIC.name])

    for (const permissionName of this.plugin.config.permissions) {
      if (!this.sandboxes[permissionName]) {
        continue
      }

      await this.__run(this.sandboxes[permissionName])
    }
  }

  async destroy () {
    const sandboxesDestroy = this.__mapDestroy()
    for (const permissionName of this.plugin.config.permissions) {
      if (!sandboxesDestroy[permissionName]) {
        continue
      }

      await sandboxesDestroy[permissionName]()
    }
  }

  async __run (sandboxes = []) {
    for (const sandbox of castArray(sandboxes)) {
      await sandbox()
    }
  }

  __mapPermissionsToSandbox () {
    return {
      [ALERTS.name]: AlertsSandbox.create(this.walletApi, this.app),
      [AUDIO.name]: AudioSandbox.create(this.sandbox),
      [EVENTS.name]: EventsSandbox.create(this.walletApi, this.app),
      [HTTP.name]: HttpSandbox.create(this.walletApi, this.plugin),
      [MESSAGING.name]: MessagingSandbox.create(this.walletApi, this.app),
      [PEER_CURRENT.name]: PeerCurrentSandbox.create(this.walletApi, this.app),
      [PROFILE_ALL.name]: ProfileAllSandbox.create(this.walletApi, this.app),
      [PROFILE_CURRENT.name]: ProfileCurrentSandbox.create(this.walletApi, this.app),
      [PUBLIC.name]: [
        FontAwesomeSandbox.create(this.walletApi),
        RouteSandbox.create(this.walletApi, this.plugin, this.app)
      ],
      [STORAGE.name]: StorageSandbox.create(this.walletApi, this.app, this.plugin),
      [TIMERS.name]: TimersSandbox.create(this.walletApi, this.app),
      [WEBSOCKET.name]: WebsocketSandbox.create(this.walletApi, this.app, this.plugin)
    }
  }

  __mapDestroy () {
    return {
      [EVENTS.name]: () => EventsSandbox.destroy(this.walletApi)
    }
  }
}
