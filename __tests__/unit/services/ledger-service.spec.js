import ledgerService from '@/services/ledger-service'

beforeEach(async () => {
  jest.clearAllMocks()
})
describe('LedgerService', () => {
  it('should return LedgerService instance', async () => {
    expect(ledgerService.constructor.name).toBe('LedgerService')
  })

  it('should connect', async () => {
    expect(await ledgerService.connect()).toBe(true)
  })

  it('should return true for isConnected', async () => {
    await ledgerService.connect()

    expect(await ledgerService.isConnected()).toBe(true)
  })

  it('should return false for isConnected', async () => {
    ledgerService.ledger.getAddress = jest.fn(() => {
      throw new Error('Could not connect')
    })

    expect(await ledgerService.isConnected()).toBe(false)
  })

  it('should disconnect', async () => {
    await ledgerService.connect()
    await ledgerService.disconnect()

    expect(ledgerService.transport.close).toHaveBeenCalledTimes(1)
  })

  it('should run getWallet', async () => {
    const response = await ledgerService.getWallet(`44'/1'/0'/0/0`)

    expect(response).toBeTruthy()
    expect(ledgerService.ledger.getAddress).toHaveBeenCalledTimes(1)
  })

  it('should run getPublicKey', async () => {
    const response = await ledgerService.getPublicKey(`44'/1'/0'/0/0`)

    expect(response).toBeTruthy()
    expect(ledgerService.ledger.getAddress).toHaveBeenCalledTimes(1)
  })

  it('should run signTransaction', async () => {
    const response = await ledgerService.signTransaction(
      `44'/1'/0'/0/0`,
      '1234'
    )

    expect(response).toBeTruthy()
    expect(ledgerService.ledger.signTransaction).toHaveBeenCalledTimes(1)
  })

  it('should queue an action', async () => {
    const response = await ledgerService.__performAction(async () => {
      return true
    })

    expect(response).toBe(true)
  })
})
