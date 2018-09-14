import store from '@/store'

describe('app store module', () => {
  beforeEach(() => {
    store.dispatch('app/setPinCode', 123456)
  })

  it('should set pin code', () => {
    expect(store.state.app.pinCode).toBe(123456)
  })

  it('should getter be "enabled"', () => {
    expect(store.getters['app/pinCodeEnabled']).toBeTruthy()
  })
})
