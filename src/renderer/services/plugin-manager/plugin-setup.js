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
import * as ComponentsSetup from './setup/components-setup'
import * as AvatarsSetup from './setup/avatars-setup'
import * as RoutesSetup from './setup/routes-setup'
import * as WalletTabsSetup from './setup/wallet-tabs-setup'
import * as RegisterSetup from './setup/register-setup'
import * as MenuItemsSetup from './setup/menu-items-setup'
import * as ThemesSetup from './setup/themes-setup'
import * as WebFrameSetup from './setup/webframe-setup'
import * as UiComponentsSetup from './setup/ui-components-setup'
import * as FontAwesomeSetup from './setup/font-awesome-setup'

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
      [AVATARS.name]: AvatarsSetup.create(this.plugin, this.pluginObject, this.sandbox, this.profileId),
      [WALLET_TABS.name]: WalletTabsSetup.create(this.plugin, this.pluginObject, this.sandbox, this.profileId),
      [ROUTES.name]: RoutesSetup.create(this.plugin, this.pluginObject, this.sandbox),
      [COMPONENTS.name]: ComponentsSetup.create(this.plugin, this.pluginObject, this.sandbox, this.vue),
      [MENU_ITEMS.name]: MenuItemsSetup.create(this.plugin, this.pluginObject, this.sandbox, this.profileId),
      [THEMES.name]: ThemesSetup.create(this.plugin, this.pluginObject, this.sandbox, this.profileId),
      [PUBLIC.name]: [
        RegisterSetup.create(this.pluginObject),
        FontAwesomeSetup.create(this.plugin)
      ],
      [WEBFRAME.name]: WebFrameSetup.create(this.plugin),
      [UI_COMPONENTS.name]: UiComponentsSetup.create(this.plugin)
    }
  }
}
