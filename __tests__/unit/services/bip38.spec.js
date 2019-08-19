import Bip38 from '@/services/bip38'

const bip38key = '6PYRXLq9jrSmgsa9zxoTWWiCQsQt3urzCM4HPBwj1eR2WyH96qiRVggod7'
const passphrase = 'sample passphrase'
const password = 'testing'
const wif = 170

let bip38

beforeEach(() => {
  bip38 = new Bip38()
  jest.spyOn(bip38.worker, 'on')
  jest.spyOn(bip38.worker, 'send')
})

afterEach(() => {
  bip38.worker.on.mockRestore()
  bip38.worker.send.mockRestore()
  bip38.worker.send('quit')
})

describe('BIP38 service', () => {
  describe('decrypt', () => {
    it('should send the data to decrypt to the worker', () => {
      bip38.decrypt({ bip38key, password, wif })
      expect(bip38.worker.send).toHaveBeenCalledWith({ bip38key, password, wif })
    })

    describe('when there is a successful message', () => {
      it('should resolve the Promise', async () => {
        await expect(bip38.decrypt({ bip38key, password, wif })).resolves.toEqual({ encodedWif: 'SHPmaLNivfNRW9yf5indKKKuUCabUvNQdvpkcLJEvnNB8Q45Ki4U' })
      }, 20000)
    })

    describe('when there is an error message', () => {
      it('should reject the Promise', async () => {
        await expect(bip38.decrypt({ bip38key: 'lol', password, wif })).rejects.toBe('Failed to decrypt passphrase: Non-base58 character')
      })
    })
  })

  describe('encrypt', () => {
    it('should send the data to encrypt to the worker', () => {
      bip38.encrypt({ passphrase, password, wif })
      expect(bip38.worker.send).toHaveBeenCalledWith({ passphrase, password, wif })
    })

    describe('when there is a successful message', () => {
      it('should resolve the Promise', async () => {
        await expect(bip38.encrypt({ passphrase, password, wif })).resolves.toEqual({ bip38key: '6PYRXLq9jrSmgsa9zxoTWWiCQsQt3urzCM4HPBwj1eR2WyH96qiRVggod7' })
      }, 20000)
    })

    describe('when there is an error message', () => {
      it('should reject the Promise', async () => {
        await expect(bip38.encrypt({ passphrase, password, wif: null })).rejects.toBe("Failed to encrypt passphrase: Cannot read property 'version' of null")
      })
    })
  })

  describe('quit', () => {
    it('should send the `quit` message to the worker', () => {
      bip38.quit()
      expect(bip38.worker.send).toHaveBeenCalledWith('quit')
    })
  })
})
