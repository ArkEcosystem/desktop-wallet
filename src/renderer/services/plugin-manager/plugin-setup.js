import path from 'path'
import fs from 'fs'
import { castArray } from 'lodash'
import {
  COMPONENTS,
  AVATARS,
  WALLET_TABS,
  ROUTES,
  PUBLIC,
  MENU_ITEMS,
  THEMES,
  WEBFRAME,
  UI_COMPONENTS
} from './plugin-permission'
import { createComponentsSetup } from './setup/components-setup'
import { createAvatarsSetup } from './setup/avatars-setup'
import { createRoutesSetup } from './setup/routes-setup'
import { createWalletTabsSetup } from './setup/wallet-tabs-setup'
import { createRegisterSetup } from './setup/register-setup'
import { createMenuItemsSetup } from './setup/menu-items-setup'
import { createThemesSetup } from './setup/themes-setup'
import { createWebFrameSetup } from './setup/webframe-setup'
import { createUiComponentsSetup } from './setup/ui-components-setup'
import { createFontAwesomeSetup } from './setup/font-awesome-setup'

export class PluginSetup {
  constructor ({
    plugin,
    sandbox,
    vue,
    profileId
  }) {
    this.plugin = plugin
    this.sandbox = sandbox
    this.profileId = profileId

    const localVue = vue.extend()
    localVue.options._base = localVue
    this.vue = localVue

    this.pluginObject = this.sandbox.getComponentVM().run(
      fs.readFileSync(path.join(plugin.fullPath, 'src/index.js')),
      path.join(plugin.fullPath, 'src/index.js')
    )

    this.setups = this.__mapPermissionsToSetup()
  }

  async install () {
    await this.__run(this.setups[PUBLIC.name])

    const permissions = this.plugin.config.permissions
    const priorities = [WEBFRAME.name, UI_COMPONENTS.name, COMPONENTS.name, ROUTES.name]

    const first = priorities.filter(p => permissions.includes(p))
    const rest = permissions.filter(p => !priorities.includes(p))

    for (const permissionName of first) {
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
      [WALLET_TABS.name]: createWalletTabsSetup(this.plugin, this.pluginObject, this.sandbox, this.profileId),
      [ROUTES.name]: createRoutesSetup(this.plugin, this.pluginObject, this.sandbox),
      [COMPONENTS.name]: createComponentsSetup(this.plugin, this.pluginObject, this.sandbox, this.vue),
      [MENU_ITEMS.name]: createMenuItemsSetup(this.plugin, this.pluginObject, this.sandbox, this.profileId),
      [THEMES.name]: createThemesSetup(this.plugin, this.pluginObject, this.sandbox, this.profileId),
      [PUBLIC.name]: [
        createRegisterSetup(this.pluginObject),
        createFontAwesomeSetup(this.plugin)
      ],
      [WEBFRAME.name]: createWebFrameSetup(this.plugin),
      [UI_COMPONENTS.name]: createUiComponentsSetup(this.plugin)
    }
  }
}
