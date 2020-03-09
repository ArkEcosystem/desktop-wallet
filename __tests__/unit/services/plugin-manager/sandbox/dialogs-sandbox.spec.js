import { create as createDialogsSandbox } from '@/services/plugin-manager/sandbox/dialogs-sandbox'

const walletApi = {}
const dialogsSandbox = createDialogsSandbox(walletApi)
dialogsSandbox()

describe('Dialogs Sandbox', () => {
  it('should expose functions', () => {
    expect(walletApi.dialogs).toBeTruthy()
    expect(walletApi.dialogs.save).toBeTruthy()
    expect(walletApi.dialogs.open).toBeTruthy()
  })
})
