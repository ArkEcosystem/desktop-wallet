import Bip38 from '@/services/bip38'

const bip38key = '6PYRXLq9jrSmgsa9zxoTWWiCQsQt3urzCM4HPBwj1eR2WyH96qiRVggod7'
const passphrase = 'sample passphrase'
const password = 'testing'
const wif = 170

let bip38

beforeEach(() => {
  bip38 = new Bip38()
})

describe('BIP38 service', () => {
  describe('decrypt', () => {
    describe('when there is a successful message', () => {
      it('should resolve the Promise', async () => {
        await expect(bip38.decrypt({ bip38key, password, wif })).resolves
          .toEqual({ encodedWif: 'SHPmaLNivfNRW9yf5indKKKuUCabUvNQdvpkcLJEvnNB8Q45Ki4U' })
      }, 20000)
    })

    describe('when there is an error message', () => {
      it('should reject the Promise', async () => {
        await expect(bip38.decrypt({ bip38key: 'lol', password, wif })).rejects
          .toHaveProperty('message', 'Failed to decrypt passphrase: Non-base58 character')
      })
    })
  })

  describe('encrypt', () => {
    describe('when there is a successful message', () => {
      it('should resolve the Promise', async () => {
        await expect(bip38.encrypt({ passphrase, password, wif })).resolves
          .toEqual({ bip38key: '6PYRXLq9jrSmgsa9zxoTWWiCQsQt3urzCM4HPBwj1eR2WyH96qiRVggod7' })
      }, 20000)
    })

    describe('when there is an error message', () => {
      it('should reject the Promise', async () => {
        await expect(bip38.encrypt({ passphrase, password, wif: null })).rejects
          .toHaveProperty('message', "Failed to encrypt passphrase: Cannot read property 'version' of null")
      })
    })
  })
})
