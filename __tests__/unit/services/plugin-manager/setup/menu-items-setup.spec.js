import { create as createMenuItemsSetup } from '@/services/plugin-manager/setup/menu-items-setup'
import { Plugin } from '@/services/plugin-manager/plugin'

const plugin = new Plugin({
  config: {
    id: 1
  }
})

plugin.routes = [
  {
    name: '1:test'
  }
]

const pluginObject = {
  getMenuItems: jest.fn(() => [
    {
      routeName: 'test'
    }
  ])
}

const sandbox = {
  app: {
    $store: {
      dispatch: jest.fn()
    },
    $router: {
      options: {
        routes: []
      }
    }
  }
}

const profileId = 'profile1'

const menuItemsSetup = createMenuItemsSetup(plugin, pluginObject, sandbox, profileId)
menuItemsSetup()

describe('Menu Items Setup', () => {
  it('should call the getMenuItems method', () => {
    expect(pluginObject.getMenuItems).toHaveBeenCalled()
  })

  it('should dispatch to vuex', () => {
    expect(sandbox.app.$store.dispatch).toHaveBeenCalled()
  })
})
