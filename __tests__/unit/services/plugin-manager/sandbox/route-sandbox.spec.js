import { create as createRouteSandbox } from '@/services/plugin-manager/sandbox/route-sandbox'

const walletApi = {}
const routeSandbox = createRouteSandbox(walletApi, {}, {})
routeSandbox()

describe('Route Sandbox', () => {
  it('should expose functions', () => {
    expect(walletApi.route).toBeTruthy()
    expect(walletApi.route.get).toBeTruthy()
    expect(walletApi.route.goTo).toBeTruthy()
  })
})
