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

const createStore = spies => ({
  store: new Vuex.Store({
    modules: {
      plugin: PluginModule,
      session: {
        namespaced: true,
        getters: {
          profile () {
            return profile1
          },
          profileId () {
            return profile1.id
          }
        }
      }
    },
    strict: true
  }),
  spies: merge({}, spies)
})

describe('PluginModule', () => {
  const { store } = createStore()

  describe('available and installed plugins', () => {
    it('should set lastFetched when setting available plugins', () => {
      expect(store.getters['plugin/lastFetched']).toEqual(0)
      store.dispatch('plugin/setAvailable', {})
      expect(store.getters['plugin/lastFetched']).toEqual(1)
    })

    it('should be possible to set available plugins', () => {
      store.dispatch('plugin/setAvailable', availablePlugins)
      expect(store.getters['plugin/available']).toEqual(availablePlugins)
    })

    it('should be possible to get an available plugin by its id', () => {
      expect(store.getters['plugin/availableById'](availablePlugins[0].config.id)).toEqual(availablePlugins[0])
    })

    it('should be possible to check if a plugin is available by its id', () => {
      expect(store.getters['plugin/isAvailable'](availablePlugins[0].config.id)).toBe(true)
      expect(store.getters['plugin/isAvailable']('plugin-not-available')).toBe(false)
    })

    it('should return null if there are no available plugins', () => {
      // empty plugin store
      store.dispatch('plugin/setAvailable', {})

      expect(store.getters['plugin/availableById'](availablePlugins[0].config.id)).toBeNull()

      // restore plugin store
      store.dispatch('plugin/setAvailable', availablePlugins)
    })

    it('should be possible to set installed plugins', () => {
      for (const plugin of installedPlugins) {
        store.dispatch('plugin/setInstalled', plugin)
      }
      expect(store.getters['plugin/installed']).toEqual(installedPlugins)
    })

    it('should be possible to get an installed plugin by its id', () => {
      expect(store.getters['plugin/installedById'](installedPlugins[0].config.id)).toEqual(installedPlugins[0])
    })

    it('should be possible to check if a plugin is installed by its id', () => {
      expect(store.getters['plugin/isInstalled'](installedPlugins[0].config.id)).toBe(true)
      expect(store.getters['plugin/isInstalled']('plugin-not-installed')).toBe(false)
    })

    it('should return null if there are no installed plugins', () => {
      // empty plugin store
      store.dispatch('plugin/reset')

      expect(store.getters['plugin/installedById'](installedPlugins[0].config.id)).toBeNull()

      // restore plugin store
      for (const plugin of installedPlugins) {
        store.dispatch('plugin/setInstalled', plugin)
      }
    })

    it('should be possible to get all available and installed plugins', () => {
      const all = store.getters['plugin/all']

      for (const plugin of availablePlugins.concat(installedPlugins).map(p => p.config.id)) {
        expect(all.find(p => p.config.id === plugin)).toBeTruthy()
      }
    })

    it('should merge available and installed plugins correctly', () => {
      expect(store.getters['plugin/all'].find(p => p.config.id === 'plugin-1')).toEqual(installedPlugins[0])
    })
  })
})
