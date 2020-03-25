import store from '@/store'

describe('SessionModule', () => {
  beforeEach(() => {
    store.dispatch('session/reset')
  })

  describe('getters > marketChartOptions', () => {
    it('should get the market chart options', () => {
      expect(store.getters['session/marketChartOptions']).toEqual({ isEnabled: true, isExpanded: true, period: 'day' })
    })
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

  describe('getters > contactSortParams', () => {
    it('should get value of hideWalletButtonText', () => {
      expect(store.getters['session/hideWalletButtonText']).toEqual(false)
    })
  })

  it('actions > should reset session', () => {
    expect(store.getters['session/theme']).toEqual('light')
    store.dispatch('session/setTheme', 'dark')
    expect(store.getters['session/theme']).toEqual('dark')
    store.dispatch('session/reset')
    expect(store.getters['session/theme']).toEqual('light')
  })

  describe('actions > setMarketChartOptions', () => {
    it('should set the market chart options', () => {
      const params = { foo: 'bar' }
      store.dispatch('session/setMarketChartOptions', params)
      expect(store.getters['session/marketChartOptions']).toEqual({ foo: 'bar' })
    })
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

  describe('actions > setHideWalletButtonText', () => {
    it('should set the value for hideWalletButtonText', () => {
      store.dispatch('session/setHideWalletButtonText', true)
      expect(store.getters['session/hideWalletButtonText']).toEqual(true)
    })
  })

  describe('actions > setIsAdvancedModeEnabled', () => {
    it('should set the value for isAdvancedModeEnabled', () => {
      store.dispatch('session/setIsAdvancedModeEnabled', true)
      expect(store.getters['session/isAdvancedModeEnabled']).toEqual(true)
    })
  })

  describe('actions > setPriceApi', () => {
    it('should set the value for priceApi', () => {
      store.dispatch('session/setPriceApi', 'coingecko')
      expect(store.getters['session/priceApi']).toEqual('coingecko')
    })
  })

  describe('actions > setLastFeeByType', () => {
    it('should set the value for the last fee by type', () => {
      store.dispatch('session/setLastFeeByType', {
        fee: '1000',
        type: 0,
        typeGroup: 1
      })
      expect(store.getters['session/lastFees']).toEqual({
        1: {
          0: '1000'
        }
      })
    })
  })

  describe('actions > setDefaultChosenFee', () => {
    it('should set the value for defaultChosenFee', () => {
      store.dispatch('session/setDefaultChosenFee', 'LAST')
      expect(store.getters['session/defaultChosenFee']).toEqual('LAST')
    })
  })
})
