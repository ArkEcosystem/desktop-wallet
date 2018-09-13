import LedgerService from '@/services/ledger-service'

let ledgerService
beforeEach(async () => {
  ledgerService = await LedgerService.init(111)
})
describe('LedgerService', () => {
  it('should return LedgerService instance', async () => {
    expect(ledgerService).toBeInstanceOf(LedgerService)
  })

  it('should set slip44 on init', async () => {
    ledgerService = await LedgerService.init(2)
    expect(ledgerService.__getPath()).toBe(`44'/2'/0'/0/0`)
  })

  it('should throw if no slip44 is provided', async () => {
    expect(LedgerService.init()).rejects.toThrow('slip44 must be a Number')
  })

  it('should start connecting to ledger on init', async () => {
    expect(ledgerService.ledger).toBeTruthy()
  })

  it('should not start connecting if already connected', async () => {
    ledgerService.ledger = true

    expect(await ledgerService.startConnect()).toBeFalsy()
  })

  it('should start connecting if not already connecting', async () => {
    ledgerService.connected = false
    ledgerService.connectionTimer = null
    ledgerService.connect = jest.fn(() => false)

    await ledgerService.startConnect()
    expect(ledgerService.connect).toHaveBeenCalledTimes(1)
    expect(ledgerService.connectionTimer).toBeTruthy()
  })

  it('should not start connecting if already connecting', async () => {
    ledgerService.connected = false
    ledgerService.connectionTimer = true
    ledgerService.connect = jest.fn(() => false)

    await ledgerService.startConnect()
    expect(ledgerService.connect).toHaveBeenCalledTimes(0)
    expect(ledgerService.connectionTimer).toBe(true)
  })

  it('should not start connecting if able to connect initially', async () => {
    ledgerService.connected = false
    ledgerService.connectionTimer = null
    ledgerService.connect = jest.fn(() => true)

    await ledgerService.startConnect()
    expect(ledgerService.connect).toHaveBeenCalledTimes(1)
    expect(ledgerService.connectionTimer).toBeFalsy()
  })

  it('should call getAddress on ark-ledger library', async () => {
    const address = await ledgerService.getAddress()
    expect(ledgerService.ledger.getAddress).toHaveBeenCalledTimes(1)
    expect(address).toBe('ADDRESS')
  })

  it('should fail getAddress if not connected', async () => {
    ledgerService.connected = false
    ledgerService.connect = jest.fn(() => false)

    await expect(ledgerService.getAddress()).rejects.toThrow('Ledger not connected')
    expect(ledgerService.connect).toHaveBeenCalledTimes(1)
  })

  it('should disconnect on getAddress if lost connection', async () => {
    ledgerService.ledger = null
    ledgerService.disconnect = jest.fn()

    await expect(ledgerService.getAddress()).rejects.toThrow('Ledger disconnected')
    expect(ledgerService.disconnect).toHaveBeenCalledTimes(1)
  })

  it('should call getPublicKey on ark-ledger library', async () => {
    const address = await ledgerService.getPublicKey()
    expect(ledgerService.ledger.getAddress).toHaveBeenCalledTimes(1)
    expect(address).toBe('PUBLIC_KEY')
  })

  it('should fail getPublicKey if not connected', async () => {
    ledgerService.connected = false
    ledgerService.connect = jest.fn(() => false)

    await expect(ledgerService.getPublicKey()).rejects.toThrow('Ledger not connected')
    expect(ledgerService.connect).toHaveBeenCalledTimes(1)
  })

  it('should disconnect on getPublicKey if lost connection', async () => {
    ledgerService.ledger = null
    ledgerService.disconnect = jest.fn()

    await expect(ledgerService.getPublicKey()).rejects.toThrow('Ledger disconnected')
    expect(ledgerService.disconnect).toHaveBeenCalledTimes(1)
  })

  it('should call signTransaction on ark-ledger library', async () => {
    const signature = await ledgerService.signTransaction()
    expect(ledgerService.ledger.signTransaction).toHaveBeenCalledTimes(1)
    expect(signature).toBe('SIGNATURE')
  })

  it('should fail signTransaction if not connected', async () => {
    ledgerService.connected = false
    ledgerService.connect = jest.fn(() => (false))

    await expect(ledgerService.signTransaction()).rejects.toThrow('Ledger not connected')
    expect(ledgerService.connect).toHaveBeenCalledTimes(1)
  })

  it('should disconnect on signTransaction if lost connection', async () => {
    ledgerService.ledger = null
    ledgerService.disconnect = jest.fn()

    await expect(ledgerService.signTransaction()).rejects.toThrow('Ledger disconnected')
    expect(ledgerService.disconnect).toHaveBeenCalledTimes(1)
  })

  it('should get first ARK MainNet path', async () => {
    expect(ledgerService.__getPath()).toBe(`44'/111'/0'/0/0`)
  })

  it('should get second ARK MainNet path', async () => {
    expect(ledgerService.__getPath(1)).toBe(`44'/111'/1'/0/0`)
  })

  it('should get first ARK DevNet path', async () => {
    ledgerService.setSlip44(1)
    expect(ledgerService.__getPath()).toBe(`44'/1'/0'/0/0`)
  })

  it('should get second ARK DevNet path', async () => {
    ledgerService.setSlip44(1)
    expect(ledgerService.__getPath(1)).toBe(`44'/1'/1'/0/0`)
  })
})
