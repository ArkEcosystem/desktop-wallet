import store from '@/store'
import { profile1 } from '../../__fixtures__/store/profile'

describe('PluginModule', () => {
  const plugins = [
    { config: { id: 'plugin-1', version: '0.0.1' } },
    { config: { id: 'plugin-2', version: '0.0.1' } },
    { config: { id: 'plugin-3', version: '0.0.1' } }
  ]

  const installedPlugin = { config: { ...plugins[0].config, version: '1.0.1' } }

  beforeAll(() => {
    store.commit('profile/CREATE', profile1)
    store.dispatch('plugin/setAvailable', plugins)
    store.dispatch('plugin/setInstalled', installedPlugin)
  })

  describe('getters', () => {
    describe('lastFetched', () => {
      it('should return the value', () => {
        expect(store.getters['plugin/lastFetched']).toBe(0)
      })
    })

    describe('all', () => {
      it('should return all available plugins', () => {
        const all = store.getters['plugin/all']

        for (const plugin of plugins.map(p => p.config.id)) {
          expect(all.find(p => p.config.id === plugin)).toBeTruthy()
        }
      })

      it('should merge available and installed plugins correctly', () => {
        const all = store.getters['plugin/all']

        expect(all.find(p => p.config.id === 'plugin-1')).toEqual(installedPlugin)
      })
    })
  })
})
