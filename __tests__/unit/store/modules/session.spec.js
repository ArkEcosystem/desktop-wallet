import store from '@/store'

describe('SessionModule', () => {
  beforeEach(() => {
    store.dispatch('session/reset')
  })

  describe('getters > walletSortParams', () => {
    it('should get the wallet sort params', () => {
      expect(store.getters['session/walletSortParams']).toEqual({ field: 'balance', type: 'desc' })
    })
  })

  describe('getters > contactSortParams', () => {
    it('should get the contact sort params', () => {
      expect(store.getters['session/contactSortParams']).toEqual({ field: 'name', type: 'asc' })
    })
  })

  it('actions > should reset session', () => {
    expect(store.getters['session/theme']).toEqual('light')
    store.dispatch('session/setTheme', 'dark')
    expect(store.getters['session/theme']).toEqual('dark')
    store.dispatch('session/reset')
    expect(store.getters['session/theme']).toEqual('light')
  })

  describe('actions > setWalletSortParams', () => {
    it('should set the wallet sort params', () => {
      const params = { foo: 'bar' }
      store.dispatch('session/setWalletSortParams', params)
      expect(store.getters['session/walletSortParams']).toEqual({ foo: 'bar' })
    })
  })

  describe('actions > setContactSortParams', () => {
    it('should set the contact sort params', () => {
      const params = { foo: 'bar' }
      store.dispatch('session/setContactSortParams', params)
      expect(store.getters['session/contactSortParams']).toEqual({ foo: 'bar' })
    })
  })
})
