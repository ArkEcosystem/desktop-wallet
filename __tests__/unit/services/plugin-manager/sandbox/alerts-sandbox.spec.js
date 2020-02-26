import { create as createAlertsSandbox } from '@/services/plugin-manager/sandbox/alerts-sandbox'

const walletApi = {}
const app = {
  $error: jest.fn(),
  $info: jest.fn(),
  $success: jest.fn(),
  $warn: jest.fn()
}
const alertsSandbox = createAlertsSandbox(walletApi, app)
alertsSandbox()

describe('Alerts Sandbox', () => {
  it('should expose functions', () => {
    expect(walletApi.alert).toBeTruthy()
    expect(walletApi.alert.error).toBeTruthy()
    expect(walletApi.alert.info).toBeTruthy()
    expect(walletApi.alert.success).toBeTruthy()
    expect(walletApi.alert.warn).toBeTruthy()
  })
})
