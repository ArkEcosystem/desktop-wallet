import { createWebFrameSandbox } from '@/services/plugin-manager/sandbox/webframe-sandbox'

const walletApi = {}
const webFrameSandbox = createWebFrameSandbox(walletApi)
webFrameSandbox()

describe('Web Frame Sandbox', () => {
  it('should expose functions', () => {
    expect(walletApi.components).toBeTruthy()
    expect(walletApi.components.WebFrame).toBeTruthy()
  })
})
