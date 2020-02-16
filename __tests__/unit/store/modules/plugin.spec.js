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

  it('should set lastFetched when setting available plugins', () => {
    expect(store.getters['plugin/lastFetched']).toEqual(0)
    store.dispatch('plugin/setAvailable', {})
    expect(store.getters['plugin/lastFetched']).toEqual(1)
  })

  it('should be possible to set available plugins', () => {
    store.dispatch('plugin/setAvailable', availablePlugins)
    expect(store.getters['plugin/available']).toEqual(availablePlugins)
  })

  it('should be possible to set installed plugins', () => {
    for (const plugin of installedPlugins) {
      store.dispatch('plugin/setInstalled', plugin)
    }
    expect(store.getters['plugin/installed']).toEqual(installedPlugins)
  })
})
