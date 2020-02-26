import { create as createFontAwesomeSandbox } from '@/services/plugin-manager/sandbox/font-awesome-sandbox'

const walletApi = {}
const fontAwesomeSandbox = createFontAwesomeSandbox(walletApi)
fontAwesomeSandbox()

describe('Font Awesome Sandbox', () => {
  it('should expose functions', () => {
    expect(walletApi.fontAwesomeIcons).toBeTruthy()
  })
})
