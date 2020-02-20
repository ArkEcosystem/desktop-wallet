import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import PluginModule from '@/store/modules/plugin'
import profiles, { profile1 } from '../../__fixtures__/store/profile'
import merge from 'lodash/merge'

const localVue = createLocalVue()
localVue.use(Vuex)

jest.mock('@/services/plugin-manager')

const dateSpy = jest.spyOn(Date, 'now')
dateSpy.mockReturnValue(1)

const availablePlugins = [
  { config: { id: 'plugin-1', version: '0.0.1' } },
  { config: { id: 'plugin-2', version: '0.0.1' } },
  { config: { id: 'plugin-3', version: '0.0.1' } }
]

const installedPlugins = [
  { config: { id: 'plugin-1', version: '1.0.1' } },
  { config: { id: 'plugin-installed', version: '0.0.1' } }
]

const sessionProfileId = jest.fn()
sessionProfileId.mockReturnValue(profile1.id)

const store = new Vuex.Store({
  modules: {
    plugin: PluginModule,
    session: {
      namespaced: true,
      getters: {
        profile () {
          return profile1
        },
        profileId () {
          return sessionProfileId()
        }
      }
    },
    profile: {
      namespaced: true,
      getters: {
        all () {
          return profiles
        }
      }
    }
  },
  strict: true
})

store._vm.$plugins = {
  enablePlugin: jest.fn()
}

const initialState = JSON.parse(JSON.stringify(store.state))

describe('PluginModule', () => {
  describe('lastFetched', () => {
    beforeAll(() => {
      store.replaceState(JSON.parse(JSON.stringify(initialState)))
    })

    it('should update lastFetched when setting available plugins', () => {
      expect(store.getters['plugin/lastFetched']).toEqual(0)
      store.dispatch('plugin/setAvailable', {})
      expect(store.getters['plugin/lastFetched']).toEqual(1)
    })
  })

  describe('available', () => {
    beforeAll(() => {
      store.replaceState(JSON.parse(JSON.stringify(initialState)))
    })

    it('should return all available plugins', () => {
      store.dispatch('plugin/setAvailable', availablePlugins)
      expect(store.getters['plugin/available']).toEqual(availablePlugins)
    })
  })

  describe('availableById', () => {
    beforeAll(() => {
      store.replaceState(JSON.parse(JSON.stringify(initialState)))
    })

    it('should return null if there are no available plugins', () => {
      expect(store.getters['plugin/availableById'](availablePlugins[0].config.id)).toBeNull()
    })

    it('should return null if the plugin cannot be found', () => {
      expect(store.getters['plugin/availableById']('plugin-not-available')).toBeNull()
    })

    it('should return the plugin if it is available', () => {
      store.dispatch('plugin/setAvailable', [availablePlugins[0]])
      expect(store.getters['plugin/availableById'](availablePlugins[0].config.id)).toEqual(availablePlugins[0])
    })
  })

  describe('isAvailable', () => {
    beforeAll(() => {
      store.replaceState(JSON.parse(JSON.stringify(initialState)))
    })

    it('should be possible to check if a plugin is available', () => {
      store.dispatch('plugin/setAvailable', [availablePlugins[0]])
      expect(store.getters['plugin/isAvailable'](availablePlugins[0].config.id)).toBe(true)
      expect(store.getters['plugin/isAvailable']('plugin-not-available')).toBe(false)
    })
  })

  describe('installed', () => {
    beforeAll(() => {
      store.replaceState(JSON.parse(JSON.stringify(initialState)))
    })

    it('should return all installed plugins', () => {
      for (const plugin of installedPlugins) {
        store.dispatch('plugin/setInstalled', plugin)
      }
      expect(store.getters['plugin/installed']).toEqual(installedPlugins)
    })
  })

  describe('installedById', () => {
    beforeAll(() => {
      store.replaceState(JSON.parse(JSON.stringify(initialState)))
    })

    it('should return null if there are no installed plugins', () => {
      expect(store.getters['plugin/installedById'](installedPlugins[0].config.id)).toBeNull()
    })

    it('should return null if the plugin cannot be found', () => {
      expect(store.getters['plugin/installedById']('plugin-not-installed')).toBeNull()
    })

    it('should return the plugin if it is installed', () => {
      store.dispatch('plugin/setInstalled', installedPlugins[0])
      expect(store.getters['plugin/installedById'](installedPlugins[0].config.id)).toEqual(installedPlugins[0])
    })
  })

  describe('isInstalled', () => {
    beforeAll(() => {
      store.replaceState(JSON.parse(JSON.stringify(initialState)))
    })

    it('should be possible to check if a plugin is installed', () => {
      store.dispatch('plugin/setInstalled', installedPlugins[0])
      expect(store.getters['plugin/isInstalled'](installedPlugins[0].config.id)).toBe(true)
      expect(store.getters['plugin/isInstalled']('plugin-not-installed')).toBe(false)
    })
  })

  describe('isUpdateAvailable', () => {
    beforeAll(() => {
      store.replaceState(JSON.parse(JSON.stringify(initialState)))
    })

    it('should return false if the plugin is not available', () => {
      const plugin = availablePlugins[0]

      store.dispatch('plugin/setInstalled', plugin)
      expect(store.getters['plugin/isUpdateAvailable'](plugin.config.id)).toBe(false)
    })

    it('should return false if the plugin is not installed', () => {
      const plugin = availablePlugins[0]

      store.dispatch('plugin/setAvailable', [plugin])
      expect(store.getters['plugin/isUpdateAvailable'](plugin.config.id)).toBe(false)
    })

    it('should return false if the installed version is equal or higher than the available version', () => {
      store.dispatch('plugin/setAvailable', [availablePlugins[0]])
      store.dispatch('plugin/setInstalled', installedPlugins[0])
      expect(store.getters['plugin/isUpdateAvailable'](availablePlugins[0].config.id)).toBe(false)
    })

    it('should return true if the installed version is lower than the available version', () => {
      store.dispatch('plugin/setAvailable', [installedPlugins[0]])
      store.dispatch('plugin/setInstalled', availablePlugins[0])
      expect(store.getters['plugin/isUpdateAvailable'](availablePlugins[0].config.id)).toBe(true)
    })
  })

  describe('latestVersion', () => {
    beforeAll(() => {
      store.replaceState(JSON.parse(JSON.stringify(initialState)))
    })

    it('should return null if the plugin is not available', () => {
      expect(store.getters['plugin/latestVersion']('plugin-not-available')).toBeNull()
    })

    it('should return the version of the available plugin', () => {
      store.dispatch('plugin/setAvailable', [availablePlugins[0]])
      expect(store.getters['plugin/latestVersion'](availablePlugins[0].config.id)).toBe(availablePlugins[0].config.version)
    })
  })

  describe('all', () => {
    beforeAll(() => {
      store.replaceState(JSON.parse(JSON.stringify(initialState)))
    })

    it('should return all available and installed plugins', () => {
      store.dispatch('plugin/setAvailable', availablePlugins)
      for (const plugin of installedPlugins) {
        store.dispatch('plugin/setInstalled', plugin)
      }

      const all = store.getters['plugin/all']

      for (const plugin of availablePlugins.concat(installedPlugins).map(p => p.config.id)) {
        expect(all.find(p => p.config.id === plugin)).toBeTruthy()
      }
    })

    it('should merge all available and installed plugins correctly', () => {
      store.dispatch('plugin/setAvailable', availablePlugins)
      for (const plugin of installedPlugins) {
        store.dispatch('plugin/setInstalled', plugin)
      }

      expect(store.getters['plugin/all'].find(p => p.config.id === 'plugin-1')).toEqual(installedPlugins[0])
    })
  })

  describe('isEnabled', () => {
    beforeAll(() => {
      store.replaceState(merge(
        JSON.parse(JSON.stringify(initialState)),
        {
          plugin: {
            enabled: {
              [profile1.id]: {
                [availablePlugins[0].config.id]: true
              }
            }
          }
        }
      ))
    })

    describe('when no profile id given', () => {
      it('should return false if the plugin is not enabled', () => {
        expect(store.getters['plugin/isEnabled']('plugin-not-enabled')).toBe(false)
      })

      it('should return true if the plugin is enabled', () => {
        expect(store.getters['plugin/isEnabled'](availablePlugins[0].config.id)).toBe(true)
      })
    })

    describe('when profile id given', () => {
      it('should return false if the plugin is not enabled', () => {
        expect(store.getters['plugin/isEnabled']('plugin-not-enabled', profile1.id)).toBe(false)
      })

      it('should return false if there are no enabled plugins', () => {
        expect(store.getters['plugin/isEnabled']('plugin-not-enabled', 'wrong-profile')).toBe(false)
      })

      it('should return true if the plugin is enabled', () => {
        expect(store.getters['plugin/isEnabled'](availablePlugins[0].config.id, profile1.id)).toBe(true)
      })
    })
  })

  describe('loaded', () => {
    beforeAll(() => {
      store.replaceState(JSON.parse(JSON.stringify(initialState)))
    })

    it('should return an empty object if there is no session profile', () => {
      sessionProfileId.mockReturnValue(null)
      expect(store.getters['plugin/loaded']).toEqual({})
    })

    it('should return an empty object if there are no loaded plugins for the session profile', () => {
      sessionProfileId.mockReturnValue(profile1.id)
      expect(store.getters['plugin/loaded']).toEqual({})
    })

    it('should return the loaded plugins for the session profile', () => {
      store.replaceState(merge(
        JSON.parse(JSON.stringify(initialState)),
        {
          plugin: {
            available: availablePlugins[0],
            enabled: {
              [profile1.id]: {
                [availablePlugins[0].config.id]: true
              }
            },
            loaded: {
              [profile1.id]: {
                [availablePlugins[0].config.id]: {
                  ...availablePlugins[0],
                  profileId: profile1.id,
                  avatars: [],
                  menuItems: []
                }
              }
            }
          }
        }
      ))

      expect(store.getters['plugin/loaded']).toEqual({
        [availablePlugins[0].config.id]: {
          avatars: [],
          menuItems: [],
          config: availablePlugins[0].config,
          profileId: profile1.id
        }
      })
    })
  })

  describe('isLoaded', () => {
    beforeAll(() => {
      store.replaceState(merge(
        JSON.parse(JSON.stringify(initialState)),
        {
          plugin: {
            loaded: {
              [profile1.id]: {
                [availablePlugins[0].config.id]: {
                  ...availablePlugins[0],
                  profileId: profile1.id,
                  avatars: [],
                  menuItems: []
                }
              }
            }
          }
        }
      ))
    })

    describe('when no profile id is given', () => {
      it('should return true if the plugin is loaded', () => {
        expect(store.getters['plugin/isLoaded'](availablePlugins[0].config.id)).toBe(true)
      })

      it('should return false if the plugin is not loaded', () => {
        expect(store.getters['plugin/isLoaded']('plugin-not-loaded')).toBe(false)
      })
    })

    describe('when profile id is given', () => {
      it('should return true if the plugin is loaded', () => {
        expect(store.getters['plugin/isLoaded'](availablePlugins[0].config.id, profile1.id)).toBe(true)
      })

      it('should return false if the plugin is not loaded', () => {
        expect(store.getters['plugin/isLoaded']('plugin-not-loaded', profile1.id)).toBe(false)
      })

      it('should return null if the profile id does not exist', () => {
        expect(store.getters['plugin/isLoaded']('plugin-not-loaded', 'profile-invalid')).toBe(null)
      })
    })
  })

  describe('isBlacklisted', () => {
    beforeAll(() => {
      store.replaceState(merge(
        JSON.parse(JSON.stringify(initialState)),
        {
          plugin: {
            blacklisted: {
              global: [availablePlugins[0].config.id],
              local: [availablePlugins[1].config.id]
            }
          }
        }
      ))
    })

    it('should return true if the plugin is blacklisted globally', () => {
      expect(store.getters['plugin/isBlacklisted'](availablePlugins[0].config.id)).toBe(true)
    })

    it('should return true if the plugin is blacklisted locally', () => {
      expect(store.getters['plugin/isBlacklisted'](availablePlugins[1].config.id)).toBe(true)
    })

    it('should return false if the plugin is not blacklisted', () => {
      expect(store.getters['plugin/isBlacklisted']('plugin-not-blacklisted')).toBe(false)
    })
  })

  describe('isWhitelisted', () => {
    beforeAll(() => {
      store.replaceState(JSON.parse(JSON.stringify(initialState)))

      store.dispatch('plugin/setWhitelisted', {
        scope: 'global',
        plugins:{
          [availablePlugins[0].config.id]: availablePlugins[0].config.version
        }
      })
    })

    it('should return true if the plugin is whitelisted and the version is lower or equal', () => {
      const equal = {
        config: {
          id: availablePlugins[0].config.id,
          version: '0.0.1'
        }
      }
      expect(store.getters['plugin/isWhitelisted'](equal)).toBe(true)
    })

    it('should return false if the plugin is whitelisted and the version is higher', () => {
      const higher = {
        config: {
          id: availablePlugins[0].config.id,
          version: '1.0.0'
        }
      }
      expect(store.getters['plugin/isWhitelisted'](higher)).toBe(false)
    })

    it('should return false if the plugin is not whitelisted', () => {
      expect(store.getters['plugin/isWhitelisted']({ config: { id: 'plugin-not-whitelisted' } })).toBe(false)
    })
  })

  // TODO: mock releaseService
  describe('isInstalledSupported', () => {
    beforeAll(() => {
      store.replaceState(JSON.parse(JSON.stringify(initialState)))
    })

    it('should return true if the plugin does not define a min version', () => {
      store.dispatch('plugin/setInstalled', installedPlugins[0])
      expect(store.getters['plugin/isInstalledSupported'](installedPlugins[0].config.id)).toBe(true)
    })

    it('should return true if the wallet version is equal or higher than the defined min version', () => {
      store.dispatch('plugin/setInstalled', {
        config: {
          ...installedPlugins[0].config,
          minVersion: '1.0.0'
        }
      })
      expect(store.getters['plugin/isInstalledSupported'](installedPlugins[0].config.id)).toBe(true)
    })

    it('should return false if the wallet version is lower than the defined min version', () => {
      store.dispatch('plugin/setInstalled', {
        config: {
          ...installedPlugins[0].config,
          minVersion: '3.0.0'
        }
      })
      expect(store.getters['plugin/isInstalledSupported'](installedPlugins[0].config.id)).toBe(false)
    })
  })

  describe('enabled', () => {
    beforeAll(() => {
      store.replaceState(JSON.parse(JSON.stringify(initialState)))
    })

    it('should return an empty object if there is no session profile', () => {
      sessionProfileId.mockReturnValue(null)
      expect(store.getters['plugin/enabled']).toEqual({})
    })

    it('should return an empty object if there are no enabled plugins for the session profile', () => {
      sessionProfileId.mockReturnValue(profile1.id)
      expect(store.getters['plugin/enabled']).toEqual({})
    })

    it('should return the enabled plugins for the session profile', () => {
      store.replaceState(merge(
        JSON.parse(JSON.stringify(initialState)),
        {
          plugin: {
            available: availablePlugins[0],
            enabled: {
              [profile1.id]: {
                [availablePlugins[0].config.id]: true
              }
            }
          }
        }
      ))

      expect(store.getters['plugin/enabled']).toEqual({ [availablePlugins[0].config.id]: true })
    })
  })

  describe('profileHasPluginOptions', () => {
    beforeAll(() => {
      store.replaceState(merge(
        JSON.parse(JSON.stringify(initialState)),
        {
          plugin: {
            pluginOptions: {
              [profile1.id]: {
                [availablePlugins[0].config.id]: {}
              }
            }
          }
        }
      ))
    })

    describe('when no profile id given', () => {
      it('should return true if there are options', () => {
        expect(store.getters['plugin/profileHasPluginOptions'](availablePlugins[0].config.id)).toBe(true)
      })

      it('should return false if there are options', () => {
        expect(store.getters['plugin/profileHasPluginOptions']('plugin-no-options')).toBe(false)
      })
    })

    describe('when profile id given', () => {
      it('should return true if there are options', () => {
        expect(store.getters['plugin/profileHasPluginOptions'](availablePlugins[0].config.id, profile1.id)).toBe(true)
      })

      it('should return false if there are options', () => {
        expect(store.getters['plugin/profileHasPluginOptions']('plugin-no-options', profile1.id)).toBe(false)
      })
    })
  })

  describe('pluginOptions', () => {
    const options = { foo: 'bar' }

    beforeAll(() => {
      store.replaceState(merge(
        JSON.parse(JSON.stringify(initialState)),
        {
          plugin: {
            pluginOptions: {
              [profile1.id]: {
                [availablePlugins[0].config.id]: options
              }
            }
          }
        }
      ))
    })

    it('should return an empty object if there are options for the given profile', () => {
      expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, 'profile-no-options')).toEqual({})
    })

    it('should return an empty object if there are options for the given plugin and profile', () => {
      expect(store.getters['plugin/pluginOptions']('plugin-not-available', profile1.id)).toEqual({})
    })

    it('should return a copy of the object', () => {
      expect(store.getters['plugin/pluginOptions'](availablePlugins[0].config.id, profile1.id)).toEqual(options)
    })
  })

  describe('reset', () => {
    const dummy = { foo: 'bar' }

    beforeEach(() => {
      store.replaceState(merge(
        JSON.parse(JSON.stringify(initialState)),
        {
          plugin: {
            loaded: dummy,
            installed: dummy
          }
        }
      ))
    })

    it('should reset loaded plugins to empty object', async () => {
      expect(store.state.plugin.loaded).toEqual(dummy)
      await store.dispatch('plugin/reset')
      expect(store.state.plugin.loaded).toEqual({})
    })

    it('should reset installed plugins to empty object', async () => {
      expect(store.state.plugin.installed).toEqual(dummy)
      await store.dispatch('plugin/reset')
      expect(store.state.plugin.installed).toEqual({})
    })
  })

  describe('loadPluginsForProfiles', () => {
    beforeAll(() => {
      store.replaceState(JSON.parse(JSON.stringify(initialState)))
    })

    it('should dispatch loadPluginsForProfile for every profile', async () => {
      const spy = jest.spyOn(store, 'dispatch')

      await store.dispatch('plugin/loadPluginsForProfiles')

      for (const profile of profiles) {
        expect(spy).toHaveBeenCalledWith('plugin/loadPluginsForProfile', profile)
      }

      spy.mockRestore()
    })
  })
})
