import store from '@/store'
import config from '@config'

describe('NetworkModule', () => {
  const networks = [
    { id: 'yes', token: 'YES', symbol: 'y' },
    { id: 'maybe', token: 'MAY', symbol: 'm' }
  ]

  describe('getters bySymbol', () => {
    beforeEach(() => {
      networks.forEach(model => store.commit('network/STORE', model))
    })
    afterEach(() => {
      networks.forEach(model => store.commit('network/DELETE', model.id))
    })

    describe('when the symbol param does not exist', () => {
      it('should return `undefined`', () => {
        expect(store.getters['network/bySymbol']('n')).toBeUndefined()
      })
    })

    describe('when the symbol param exists', () => {
      it('should find and return the wallet', () => {
        expect(store.getters['network/bySymbol']('y')).toEqual(networks[0])
      })
    })
  })

  describe('getters byToken', () => {
    beforeEach(() => {
      networks.forEach(model => store.commit('network/STORE', model))
    })
    afterEach(() => {
      networks.forEach(model => store.commit('network/DELETE', model.id))
    })

    describe('when the token param does not exist', () => {
      it('should return `undefined`', () => {
        expect(store.getters['network/byToken']('NOT')).toBeUndefined()
      })
    })

    describe('when the token param exists', () => {
      it('should find and return the wallet', () => {
        expect(store.getters['network/byToken']('YES')).toEqual(networks[0])
      })
    })
  })

  describe('actions load', () => {
    it('should set the network defaults', () => {
      expect(store.getters['network/all']).toBeEmpty()
      store.dispatch('network/load', config.NETWORKS)

      expect(store.getters['network/all']).toEqual(config.NETWORKS)
    })
  })
})
