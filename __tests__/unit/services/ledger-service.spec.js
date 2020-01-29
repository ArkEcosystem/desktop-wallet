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
    const getPublicKey = ledgerService.ledger.getPublicKey
    ledgerService.ledger.getPublicKey = jest.fn(() => {
      throw new Error('Could not connect')
    })

    expect(await ledgerService.isConnected()).toBe(false)

    ledgerService.ledger.getPublicKey = getPublicKey
  })

  it('should disconnect', async () => {
    await ledgerService.connect()
    await ledgerService.disconnect()

    expect(ledgerService.transport.close).toHaveBeenCalledTimes(1)
  })

  describe('getPublicKey', () => {
    it('should run', async () => {
      const response = await ledgerService.getPublicKey('44\'/1\'/0\'/0/0')

      expect(response).toBeTruthy()
      expect(ledgerService.ledger.getPublicKey).toHaveBeenCalledTimes(1)
    })
  })

  describe('signTransaction', () => {
    it('should run', async () => {
      const response = await ledgerService.signTransaction('44\'/1\'/0\'/0/0', '1234')

      expect(response).toBeTruthy()
      expect(ledgerService.ledger.signTransaction).toHaveBeenCalledTimes(1)
    })
  })

  describe('signMessage', () => {
    it('should run', async () => {
      ledgerService.ledger.signMessage.mockClear()

      const response = await ledgerService.signMessage('44\'/1\'/0\'/0/0', Buffer.from('1234'))

      expect(response).toBeTruthy()
      expect(ledgerService.ledger.signMessage).toHaveBeenCalledTimes(1)
    })
  })

  it('should queue an action', async () => {
    const response = await ledgerService.__performAction(async () => {
      return true
    })

    expect(response).toBe(true)
  })
})
