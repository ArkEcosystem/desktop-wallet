import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import PluginModule from '@/store/modules/plugin'
import { profile1 } from '../../__fixtures__/store/profile'
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

  describe('loaded', () => {
    beforeAll(() => {
      store.replaceState(JSON.parse(JSON.stringify(initialState)))
    })

    it('should return an empty object if there is no session profile', () => {
      sessionProfileId.mockReturnValue(null)
      expect(store.getters['plugin/loaded']).toEqual({})
    })

    it('should return an empty object if there are no plugins for the session profile', () => {
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
})
