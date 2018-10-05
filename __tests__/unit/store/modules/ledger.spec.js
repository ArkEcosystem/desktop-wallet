import store from '@/store'

beforeEach(async () => {
  await store.dispatch('ledger/disconnect')
})
describe('ledger store module', () => {
  it('should init ledger service', (done) => {
    store.dispatch('ledger/init', 1234)

    expect(store.state.ledger.slip44).toBe(1234)
    setTimeout(() => {
      expect(store.state.ledger.connectionTimer).toBeTruthy()
      done()
    }, 3000)
  })

  it('should set slip44 value', () => {
    store.dispatch('ledger/init', 4567)

    expect(store.state.ledger.slip44).toBe(4567)
  })

  it('should fail getAddress with invalid accountIndex', async () => {
    expect(await store.dispatch('ledger/getAddress')).toBe(false)
  })

  it('should fail getPublicKey with invalid accountIndex', async () => {
    expect(await store.dispatch('ledger/getPublicKey')).toBe(false)
  })

  it('should fail signTransaction with invalid accountIndex', async () => {
    expect(await store.dispatch('ledger/signTransaction')).toBe(false)
  })

  it('should fail when calling getAddress and not connected', async () => {
    store.commit('ledger/SET_CONNECTED', false)
    const response = await store.dispatch('ledger/getAddress', 1)

    expect(store.getters['ledger/isConnected']).toBe(false)
    expect(response).toBe(false)
  })

  it('should fail when calling getAddress and not connected', async () => {
    store.commit('ledger/SET_CONNECTED', false)
    const response = await store.dispatch('ledger/getPublicKey', 1)

    expect(store.getters['ledger/isConnected']).toBe(false)
    expect(response).toBe(false)
  })

  it('should fail when calling getAddress and not connected', async () => {
    store.commit('ledger/SET_CONNECTED', false)
    const response = await store.dispatch('ledger/signTransaction', 1, 'abc')

    expect(store.getters['ledger/isConnected']).toBe(false)
    expect(response).toBe(false)
  })
})
