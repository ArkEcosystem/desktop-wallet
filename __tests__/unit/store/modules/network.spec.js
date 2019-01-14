import store from '@/store'
import config from '@config'

const storeSnapshot = JSON.parse(JSON.stringify(store.state))
beforeEach(() => {
  store.replaceState(JSON.parse(JSON.stringify(storeSnapshot)))
})

describe('NetworkModule', () => {
  const networks = [
    { id: 'yes', name: 'yes', token: 'YES', symbol: 'y' },
    { id: 'maybe', name: 'maybe', token: 'MAY', symbol: 'm' }
  ]
  const customNetworks = [
    { id: 'custom', name: 'custom', token: 'CUST', symbol: 'c' },
    { id: 'custom 2', name: 'custom 2', token: 'CUST', symbol: 'c' }
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
    it('should set the network defaults if empty', () => {
      expect(store.getters['network/all']).toBeEmpty()
      store.dispatch('network/load')

      expect(store.getters['network/all']).toEqual(config.NETWORKS)
    })

    it('should not set the network if not empty', () => {
      store.commit('network/STORE', networks[0])
      expect(store.getters['network/all']).toEqual([networks[0]])
      store.dispatch('network/load')

      expect(store.getters['network/all']).toEqual([networks[0]])
    })

    it('should load missing custom networks', () => {
      store.commit('network/STORE', networks[0])
      customNetworks.forEach(network => store.commit('network/ADD_CUSTOM_NETWORK', network))
      expect(store.getters['network/all']).toEqual([networks[0]])
      store.dispatch('network/load')

      expect(store.getters['network/all']).toEqual([networks[0], ...customNetworks])
    })
  })
})
