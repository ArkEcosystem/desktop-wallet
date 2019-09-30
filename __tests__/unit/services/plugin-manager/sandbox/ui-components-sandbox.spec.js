import { createUiComponentsSandbox } from '@/services/plugin-manager/sandbox/ui-components-sandbox'

const walletApi = {}
const uiComponentsSandbox = createUiComponentsSandbox(walletApi)
uiComponentsSandbox()

describe('UI Components Sandbox', () => {
  it('should expose functions', () => {
    expect(walletApi.components).toBeTruthy()
    expect(Object.keys(walletApi.components).length).toBeGreaterThan(0)
  })
})
