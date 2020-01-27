import store from '@/store'
import { profile1 } from '../../__fixtures__/store/profile'

describe('PluginModule', () => {
  const availablePlugins = [
    { config: { id: 'plugin-1', version: '0.0.1' } },
    { config: { id: 'plugin-2', version: '0.0.1' } },
    { config: { id: 'plugin-3', version: '0.0.1' } }
  ]

  const installedPlugins = [
    { config: { id: 'plugin-1', version: '1.0.1' } },
    { config: { id: 'plugin-installed', version: '0.0.1' } }
  ]

  beforeAll(() => {
    const dateSpy = jest.spyOn(Date, 'now')
    dateSpy.mockReturnValue(1)

    store.commit('profile/CREATE', profile1)
    store.dispatch('plugin/setAvailable', availablePlugins)
    for (const plugin of installedPlugins) {
      store.dispatch('plugin/setInstalled', plugin)
    }
  })

  describe('getters', () => {
    describe('lastFetched', () => {
      it('should return the value', () => {
        expect(store.getters['plugin/lastFetched']).toBe(1)
      })
    })

    describe('all', () => {
      it('should return all available and installed plugins', () => {
        const all = store.getters['plugin/all']

        for (const plugin of availablePlugins.concat(installedPlugins).map(p => p.config.id)) {
          expect(all.find(p => p.config.id === plugin)).toBeTruthy()
        }
      })

      it('should merge available and installed plugins correctly', () => {
        expect(store.getters['plugin/all'].find(p => p.config.id === 'plugin-1')).toEqual(installedPlugins[0])
      })
    })

    // TODO
    describe('filtered', () => {})

    describe('available', () => {
      it('should return all available plugins', () => {
        expect(store.getters['plugin/available']).toEqual(availablePlugins)
      })
    })

    describe('availableById', () => {
      it('should return an available plugin by its id', () => {
        expect(store.getters['plugin/availableById'](availablePlugins[0].config.id)).toEqual(availablePlugins[0])
      })

      it('should return null if there are no available plugins', () => {
        // empty plugin store
        store.dispatch('plugin/setAvailable', {})

        expect(store.getters['plugin/availableById'](availablePlugins[0].config.id)).toBeNull()

        // restore plugin store
        store.dispatch('plugin/setAvailable', availablePlugins)
      })
    })

    describe('installed', () => {
      it('should return all installed plugins', () => {
        expect(store.getters['plugin/installed']).toEqual(installedPlugins)
      })
    })

    describe('installedById', () => {
      it('should return an installed plugin by its id', () => {
        expect(store.getters['plugin/installedById'](installedPlugins[0].config.id)).toEqual(installedPlugins[0])
      })

      it('should return null if there are no available plugins', () => {
        // empty plugin store
        store.dispatch('plugin/reset')

        expect(store.getters['plugin/installedById'](installedPlugins[0].config.id)).toBeNull()

        // restore plugin store
        for (const plugin of installedPlugins) {
          store.dispatch('plugin/setInstalled', plugin)
        }
      })
    })

    // TODO
    describe('loaded', () => {})

    // TODO
    describe('blacklisted', () => {})

    // TODO
    describe('blacklisted', () => {})

    // TODO
    describe('enabled', () => {})

    // TODO
    describe('isAvailable', () => {})

    // TODO
    describe('isInstalled', () => {})

    // TODO
    describe('isUpdateAvailable', () => {})

    // TODO
    describe('latestVersion', () => {})

    // TODO
    describe('isEnabled', () => {})

    // TODO
    describe('isLoaded', () => {})

    // TODO
    describe('isBlacklisted', () => {})

    // TODO
    describe('isWhitelisted', () => {})

    // TODO
    describe('isInstalledSupported', () => {})

    // TODO
    describe('avatar', () => {})

    // TODO
    describe('avatars', () => {})

    // TODO
    describe('menuItems', () => {})

    // TODO
    describe('themes', () => {})

    // TODO
    describe('walletTabs', () => {})

    // TODO
    describe('profileHasPluginOptions', () => {})

    // TODO
    describe('pluginOptions', () => {})
  })

  describe('actions', () => {
    // TODO
    describe('reset', () => {})

    // TODO
    describe('loadPluginsForProfiles', () => {})

    // TODO
    describe('loadPluginsForProfile', () => {})

    // TODO
    describe('setEnabled', () => {})

    // TODO
    describe('setAvailable', () => {})

    // TODO
    describe('setInstalled', () => {})

    // TODO
    describe('setBlacklisted', () => {})

    // TODO
    describe('setWhitelisted', () => {})

    // TODO
    describe('setLoaded', () => {})

    // TODO
    describe('deletePlugin', () => {})

    // TODO
    describe('deleteLoaded', () => {})

    // TODO
    describe('deleteInstalled', () => {})

    // TODO
    describe('deleteInstalled', () => {})

    // TODO
    describe('setAvatars', () => {})

    // TODO
    describe('setMenuItems', () => {})

    // TODO
    describe('setThemes', () => {})

    // TODO
    describe('setWalletTabs', () => {})

    // TODO
    describe('setPluginOption', () => {})

    // TODO
    describe('deletePluginOptionsForProfile', () => {})
  })
})
