import path from 'path'
import fs from 'fs'
import { castArray, partition } from 'lodash'
import { COMPONENTS, AVATARS, WALLET_TABS, ROUTES, PUBLIC, MENU_ITEMS } from './plugin-permission'
import { createComponentsSetup } from './setup/components-setup'
import { createAvatarsSetup } from './setup/avatars-setup'
import { createRoutesSetup } from './setup/routes-setup'
import { createWalletTabSetup } from './setup/wallet-tabs-setup'
import { registerSetup } from './setup/register-setup'
import { createMenuItemsSetup } from './setup/menu-items-setup'

export class PluginSetup {
  constructor ({
    plugin,
    sandbox,
    vue,
    profileId
  }) {
    this.plugin = plugin
    this.sandbox = sandbox
    this.vue = vue
    this.profileId = profileId

    this.pluginObject = this.sandbox.getVM().run(
      fs.readFileSync(path.join(plugin.fullPath, 'src/index.js')),
      path.join(plugin.fullPath, 'src/index.js')
    )

    this.setups = this.__mapPermissionsToSetup()
  }

  async install () {
    await this.__run(this.setups[PUBLIC.name])

    const [priorities, rest] = partition(this.plugin.config.permissions, permission => {
      // These permissions could be necessary first to load others
      // The rest does not have dependencies: 'MENU_ITEMS', 'AVATARS', 'WALLET_TABS'
      return [COMPONENTS.name, ROUTES.name].includes(permission)
    })

    for (const permissionName of priorities) {
      await this.__run(this.setups[permissionName])
    }

    for (const permissionName of rest) {
      await this.__run(this.setups[permissionName])
    }
  }

  async __run (setups = []) {
    for (const setup of castArray(setups)) {
      await setup()
    }
  }

  __mapPermissionsToSetup () {
    return {
      [AVATARS.name]: createAvatarsSetup(this.plugin, this.pluginObject, this.sandbox, this.profileId),
      [WALLET_TABS.name]: createWalletTabSetup(this.plugin, this.pluginObject, this.sandbox, this.profileId),
      [ROUTES.name]: createRoutesSetup(this.plugin, this.pluginObject, this.sandbox),
      [COMPONENTS.name]: createComponentsSetup(this.plugin, this.pluginObject, this.sandbox, this.vue),
      [MENU_ITEMS.name]: createMenuItemsSetup(this.plugin, this.pluginObject, this.sandbox, this.profileId),
      [PUBLIC.name]: [
        registerSetup(this.pluginObject)
      ]
    }
  }
}
