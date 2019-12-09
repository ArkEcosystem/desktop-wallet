import { create as createWalletTabsSetup } from '@/services/plugin-manager/setup/wallet-tabs-setup'
import { Plugin } from '@/services/plugin-manager/plugin'

const plugin = new Plugin({
  config: {
    id: 1
  }
})

plugin.components = {
  test: {}
}

const pluginObject = {
  getWalletTabs: jest.fn(() => [
    {
      tabTitle: 'Test',
      componentName: 'test'
    }
  ])
}

const sandbox = {
  app: {
    $store: {
      dispatch: jest.fn()
    }
  }
}

const profileId = 'profile1'

const walletTabsSetup = createWalletTabsSetup(plugin, pluginObject, sandbox, profileId)
walletTabsSetup()

describe('Wallet Tabs Setup', () => {
  it('should call the getWalletTabs method', () => {
    expect(pluginObject.getWalletTabs).toHaveBeenCalled()
  })

  it('should dispatch to vuex', () => {
    expect(sandbox.app.$store.dispatch).toHaveBeenCalled()
  })
})
