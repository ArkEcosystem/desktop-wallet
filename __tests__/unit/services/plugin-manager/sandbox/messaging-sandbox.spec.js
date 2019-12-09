import { create as createMessagingSandbox } from '@/services/plugin-manager/sandbox/messaging-sandbox'

let walletApi
let app

beforeEach(() => {
  walletApi = {}
  app = {
    $router: {
      beforeEach: jest.fn()
    }
  }

  const messagingSandbox = createMessagingSandbox(walletApi, app)
  messagingSandbox()
})

describe('Messaging Sandbox', () => {
  it('should expose functions', () => {
    expect(walletApi.messages).toBeTruthy()
    expect(walletApi.messages.on).toBeTruthy()
    expect(walletApi.messages.clear).toBeTruthy()
  })

  it('should define the router hook', () => {
    expect(app.$router.beforeEach).toHaveBeenCalled()
  })

  it('should register listeners', () => {
    walletApi.messages.on('transaction', () => 'test')
    expect(Object.keys(walletApi.messages.events)).toHaveLength(1)
  })

  it('should clear listeners', () => {
    walletApi.messages.on('transaction', () => 'test')
    expect(Object.keys(walletApi.messages.events)).toHaveLength(1)
    walletApi.messages.clear()
    expect(Object.keys(walletApi.messages.events)).toHaveLength(0)
  })
})
