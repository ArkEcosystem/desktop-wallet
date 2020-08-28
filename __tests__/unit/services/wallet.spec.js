import * as bip39 from 'bip39'
import nock from 'nock'
import { Identities } from '@arkecosystem/crypto'
import WalletService from '../../../src/renderer/services/wallet'
import { CryptoUtils } from '@/services/crypto/utils'

jest.mock('@/store', () => ({
  getters: {
    'session/network': {
      crypto: require('@arkecosystem/crypto').Managers.configManager.config
    },
    'delegate/byUsername': (username) => {
      if (username === 'exists') {
        return {
          username: 'exists'
        }
      }

      return false
    }
  },
  dispatch: jest.fn(),
  watch: jest.fn()
}))

beforeEach(() => {
  nock.cleanAll()
})

describe('Services > Wallet', () => {
  describe('generate', () => {
    it('should generate a wallet in English', () => {
      const wallet = WalletService.generate(30, 'english')

      expect(Identities.Address.fromPassphrase(wallet.passphrase)).toEqual(wallet.address)
      expect(bip39.wordlists.english).toIncludeAllMembers(wallet.passphrase.split(' '))
    })

    it('should generate a wallet in Chinese (Traditional)', () => {
      const wallet = WalletService.generate(30, 'chinese_traditional')

      expect(Identities.Address.fromPassphrase(wallet.passphrase)).toEqual(wallet.address)
      expect(bip39.wordlists.chinese_traditional).toIncludeAllMembers(wallet.passphrase.split(' '))
    })

    it('should generate a wallet in Chinese (Simplified)', () => {
      const wallet = WalletService.generate(30, 'chinese_simplified')

      expect(Identities.Address.fromPassphrase(wallet.passphrase)).toEqual(wallet.address)
      expect(bip39.wordlists.chinese_simplified).toIncludeAllMembers(wallet.passphrase.split(' '))
    })

    it('should generate a wallet in Korean', () => {
      const wallet = WalletService.generate(30, 'korean')

      expect(Identities.Address.fromPassphrase(wallet.passphrase)).toEqual(wallet.address)
      expect(bip39.wordlists.korean).toIncludeAllMembers(wallet.passphrase.split(' '))
    })

    it('should generate a wallet in French', () => {
      const wallet = WalletService.generate(30, 'french')

      expect(Identities.Address.fromPassphrase(wallet.passphrase)).toEqual(wallet.address)
      expect(bip39.wordlists.french).toIncludeAllMembers(wallet.passphrase.split(' '))
    })

    it('should generate a wallet in Italian', () => {
      const wallet = WalletService.generate(30, 'italian')

      expect(Identities.Address.fromPassphrase(wallet.passphrase)).toEqual(wallet.address)
      expect(bip39.wordlists.italian).toIncludeAllMembers(wallet.passphrase.split(' '))
    })

    it('should generate a wallet in Spanish', () => {
      const wallet = WalletService.generate(30, 'spanish')

      expect(Identities.Address.fromPassphrase(wallet.passphrase)).toEqual(wallet.address)
      expect(bip39.wordlists.spanish).toIncludeAllMembers(wallet.passphrase.split(' '))
    })

    it('should generate a wallet in Japanese', () => {
      const wallet = WalletService.generate(30, 'japanese')

      expect(Identities.Address.fromPassphrase(wallet.passphrase)).toEqual(wallet.address)
      expect(bip39.wordlists.japanese).toIncludeAllMembers(wallet.passphrase.split('　'))
    })
  })

  describe('generateSecondPassphrase', () => {
    it('should generate second passphrase for wallet in English', () => {
      const passphrase = WalletService.generateSecondPassphrase('english')

      expect(bip39.wordlists.english).toIncludeAllMembers(passphrase.split(' '))
    })

    it('should generate second passphrase for wallet in Chinese (Traditional)', () => {
      const passphrase = WalletService.generateSecondPassphrase('chinese_traditional')

      expect(bip39.wordlists.chinese_traditional).toIncludeAllMembers(passphrase.split(' '))
    })

    it('should generate second passphrase for wallet in Chinese (Simplified)', () => {
      const passphrase = WalletService.generateSecondPassphrase('chinese_simplified')

      expect(bip39.wordlists.chinese_simplified).toIncludeAllMembers(passphrase.split(' '))
    })

    it('should generate second passphrase for wallet in Korean', () => {
      const passphrase = WalletService.generateSecondPassphrase('korean')

      expect(bip39.wordlists.korean).toIncludeAllMembers(passphrase.split(' '))
    })

    it('should generate second passphrase for wallet in French', () => {
      const passphrase = WalletService.generateSecondPassphrase('french')

      expect(bip39.wordlists.french).toIncludeAllMembers(passphrase.split(' '))
    })

    it('should generate second passphrase for wallet in Italian', () => {
      const passphrase = WalletService.generateSecondPassphrase('italian')

      expect(bip39.wordlists.italian).toIncludeAllMembers(passphrase.split(' '))
    })

    it('should generate second passphrase for wallet in Spanish', () => {
      const passphrase = WalletService.generateSecondPassphrase('spanish')

      expect(bip39.wordlists.spanish).toIncludeAllMembers(passphrase.split(' '))
    })

    it('should generate second passphrase for wallet in Japanese', () => {
      const passphrase = WalletService.generateSecondPassphrase('japanese')

      expect(bip39.wordlists.japanese).toIncludeAllMembers(passphrase.split('　'))
    })
  })

  describe('getAddress', () => {
    let normalizeSpy

    beforeEach(() => {
      normalizeSpy = jest.spyOn(CryptoUtils, 'normalizePassphrase')
    })

    afterEach(() => {
      normalizeSpy.mockRestore()
    })

    it('should work in English', () => {
      const passphrase = 'one video jaguar gap soldier ill hobby motor bundle couple trophy smoke'
      const address = 'DAy2xDNZLRQsgiJCnF3x4WDxGsBrmsKCsV'
      expect(WalletService.getAddress(passphrase, 30)).toEqual(address)
      expect(normalizeSpy).toHaveBeenCalledWith(passphrase)
    })

    it('should work in Chinese (Traditional)', () => {
      const passphrase = '苗 雛 陸 桿 用 腐 爐 詞 鬼 雨 爾 然'
      const address = 'DS6hPMzbgRkKCZa6fJSmQrG2M7toJAtd5B'
      expect(WalletService.getAddress(passphrase, 30)).toEqual(address)
      expect(normalizeSpy).toHaveBeenCalledWith(passphrase)
    })

    it('should work in French', () => {
      const passphrase = 'galerie notoire prudence mortier soupape cerise argent neurone pommade géranium potager émouvoir'
      const address = 'DUFdRiUNXt1PiLVakbq4ADo1Ttsx3kH1AT'
      expect(WalletService.getAddress(passphrase, 30)).toEqual(address)
      expect(normalizeSpy).toHaveBeenCalledWith(passphrase)
    })

    it('should work in Italian', () => {
      const passphrase = 'mucca comodo imbevuto talismano sconforto cavillo obelisco quota recupero malinteso gergo bipede'
      const address = 'D8nAGdSCCRMsLPsM4GgzRtgbiTn16rHW6J'
      expect(WalletService.getAddress(passphrase, 30)).toEqual(address)
      expect(normalizeSpy).toHaveBeenCalledWith(passphrase)
    })

    it('should work in Japanese', () => {
      const passphrase = 'うかべる　くすりゆび　ひさしぶり　たそがれ　そっこう　ちけいず　ひさしぶり　ていか　しゃちょう　けおりもの　ちぬり　りきせつ'
      const address = 'DQquFjRfgA26cut7A8wFC4Bbo4TawWArWr'
      expect(WalletService.getAddress(passphrase, 30)).toEqual(address)
      expect(normalizeSpy).toHaveBeenCalledWith(passphrase)
    })

    it('should work in Korean with initially decomposed characters', () => {
      const passphrase = '변명 박수 사건 실컷 목적 비용 가능 시골 수동적 청춘 식량 도망'
      const address = 'D5FvjRH136fbw8j4thcmKiFiJjfbYHT3zY'
      expect(WalletService.getAddress(passphrase, 30)).toEqual(address)
      expect(normalizeSpy).toHaveBeenCalledWith(passphrase)
    })

    it('should work in Korean without decomposing', () => {
      const passphrase = '변명 박수 사건 실컷 목적 비용 가능 시골 수동적 청춘 식량 도망'
      const address = 'D5FvjRH136fbw8j4thcmKiFiJjfbYHT3zY'
      expect(WalletService.getAddress(passphrase, 30)).toEqual(address)
      expect(normalizeSpy).toHaveBeenCalledWith(passphrase)
    })

    it('should work in Spanish', () => {
      const passphrase = 'cadena cadáver malla etapa vista alambre burbuja vejez aéreo taco rebaño tauro'
      const address = 'DNZSrNt7SQ1VBrzx7C17gbPv9FDAxnaor3'
      expect(WalletService.getAddress(passphrase, 30)).toEqual(address)
      expect(normalizeSpy).toHaveBeenCalledWith(passphrase)
    })
  })

  describe('getAddressFromPublicKey', () => {
    it('should generate the correct address', () => {
      const passphrase = 'one video jaguar gap soldier ill hobby motor bundle couple trophy smoke'
      const address = 'DAy2xDNZLRQsgiJCnF3x4WDxGsBrmsKCsV'
      expect(WalletService.getAddressFromPublicKey(Identities.PublicKey.fromPassphrase(passphrase), 30)).toEqual(address)
    })
  })

  describe('getAddressFromMultiSignatureAsset', () => {
    it('should get address for a multisignature asset', () => {
      const multisignatureAsset = {
        min: 2,
        publicKeys: [
          '037eaa8cb236c40a08fcb9d6220743ee6ae1b5c40e8a77a38f286516c3ff663901',
          '0301fd417566397113ba8c55de2f093a572744ed1829b37b56a129058000ef7bce',
          '0209d3c0f68994253cee24b23df3266ba1f0ca2f0666cd69a46544d63001cdf150'
        ]
      }

      expect(WalletService.getAddressFromMultiSignatureAsset(multisignatureAsset)).toEqual('DHBKa1HFsKd9BYMPruYNAoadt5SW8oGggj')
    })
  })

  describe('getPublicKeyFromWallet', () => {
    it('should get public key for a standard wallet', () => {
      const wallet = {
        publicKey: '037eaa8cb236c40a08fcb9d6220743ee6ae1b5c40e8a77a38f286516c3ff663901'
      }

      expect(WalletService.getPublicKeyFromWallet(wallet)).toEqual('037eaa8cb236c40a08fcb9d6220743ee6ae1b5c40e8a77a38f286516c3ff663901')
    })

    it('should return null if no public key', () => {
      const wallet = {}

      expect(WalletService.getPublicKeyFromWallet(wallet)).toEqual(null)
    })

    it('should get public key from multisignature info if exists', () => {
      const multiSignatureSpy = jest.spyOn(WalletService, 'getPublicKeyFromMultiSignatureAsset').mockImplementation(() => true)
      const wallet = {
        multiSignature: true
      }

      WalletService.getPublicKeyFromWallet(wallet)

      expect(multiSignatureSpy).toHaveBeenCalledWith(wallet.multiSignature)

      multiSignatureSpy.mockRestore()
    })
  })

  describe('getPublicKeyFromPassphrase', () => {
    it('should get public key for a standard wallet', () => {
      const passphrase = 'passphrase 1'
      const publicKey = Identities.PublicKey.fromPassphrase(passphrase)

      expect(WalletService.getPublicKeyFromPassphrase(passphrase)).toEqual('03e8021105a6c202097e97e6c6d650942d913099bf6c9f14a6815df1023dde3b87')
      expect(WalletService.getPublicKeyFromPassphrase(passphrase)).toEqual(publicKey)
    })
  })

  describe('getPublicKeyFromMultiSignatureAsset', () => {
    it('should get public key from multisignature info if exists', () => {
      const multiSignatureSpy = jest.spyOn(WalletService, 'getPublicKeyFromMultiSignatureAsset')
      const wallet = {
        multiSignature: {
          min: 2,
          publicKeys: [
            '037eaa8cb236c40a08fcb9d6220743ee6ae1b5c40e8a77a38f286516c3ff663901',
            '0301fd417566397113ba8c55de2f093a572744ed1829b37b56a129058000ef7bce',
            '0209d3c0f68994253cee24b23df3266ba1f0ca2f0666cd69a46544d63001cdf150'
          ]
        }
      }

      expect(WalletService.getPublicKeyFromWallet(wallet)).toEqual('03e8d4175126a39ed7ba803f31705b6f5fb78cbf46455ba778c5f39a32c6adfbd9')
      expect(multiSignatureSpy).toHaveBeenCalledWith(wallet.multiSignature)

      multiSignatureSpy.mockRestore()
    })
  })

  describe('isNeoAddress', () => {
    const address = Identities.Address.fromPassphrase('test address', 23)

    it('should check if valid version', () => {
      const validateAddressSpy = jest.spyOn(WalletService, 'validateAddress').mockImplementation(() => (false))

      WalletService.isNeoAddress(address)

      expect(validateAddressSpy).toHaveBeenCalledWith(address, 23)

      validateAddressSpy.mockRestore()
    })

    it('should return false if not on NEO network', async () => {
      nock('https://neoscan.io')
        .persist()
        .get(`/api/main_net/v1/get_last_transactions_by_address/${address}`)
        .reply(200, [])

      expect(await WalletService.isNeoAddress(address)).toBe(false)
    })

    it('should return true if on NEO network', async () => {
      nock('https://neoscan.io')
        .persist()
        .get(`/api/main_net/v1/get_last_transactions_by_address/${address}`)
        .reply(200, [{
          vouts: [],
          vin: []
        }])

      expect(await WalletService.isNeoAddress(address)).toBe(true)
    })
  })

  describe('canResignDelegate', () => {
    it('should return true if delegate that has not resigned', () => {
      const wallet = {
        isDelegate: true,
        isResigned: false
      }

      expect(WalletService.canResignDelegate(wallet)).toBe(true)
    })

    it('should return false if delegate has resigned', () => {
      const wallet = {
        isDelegate: true,
        isResigned: true
      }

      expect(WalletService.canResignDelegate(wallet)).toBe(false)
    })

    it('should return false if not a delegate', () => {
      const wallet = {}

      expect(WalletService.canResignDelegate(wallet)).toBe(false)
    })
  })

  describe('Messages', () => {
    const message = 'test message'
    const passphrase = 'test passphrase'
    const publicKey = Identities.PublicKey.fromPassphrase(passphrase)
    const messageSignature = '30440220115d561431df663a0e8b2807e0036d08ebdbbd0b77317cf6cd73d861c0983baf0220624792bd66453e666b3f08f4ee62b63736246e45da0bb19c9f747a37ce8b3db7'

    describe('signMessage', () => {
      it('should sign a message', () => {
        const response = WalletService.signMessage(message, passphrase)

        expect(response.message).toEqual(message)
        expect(response.publicKey).toEqual(publicKey)
        expect(response.signature).toEqual(messageSignature)
      })
    })

    describe('signMessageWithWif', () => {
      it('should sign a message', () => {
        const wif = Identities.WIF.fromPassphrase(passphrase)
        const response = WalletService.signMessageWithWif(message, wif, {
          wif: 170
        })

        expect(response.message).toEqual(message)
        expect(response.publicKey).toEqual(publicKey)
        expect(response.signature).toEqual(messageSignature)
      })
    })

    describe('verifyMessage', () => {
      it('should return true if verified successfully', () => {
        expect(WalletService.verifyMessage(message, publicKey, messageSignature)).toBe(true)
      })

      it('should throw an error for wrong signature', () => {
        expect(() => {
          WalletService.verifyMessage(message, publicKey, 'wrong')
        }).toThrowError()
      })
    })
  })

  describe('validateAddress', () => {
    it('should return true if the address is valid', () => {
      const address = Identities.Address.fromPassphrase('test passphrase')

      expect(WalletService.validateAddress(address)).toBe(true)
    })

    it('should return true if the address is valid on another network', () => {
      const address = Identities.Address.fromPassphrase('test passphrase', 23)

      expect(WalletService.validateAddress(address, 23)).toBe(true)
    })

    it('should return false if the address is not valid', () => {
      expect(WalletService.validateAddress('not an address')).toBe(false)
    })

    it('should return false if the address is for a different network', () => {
      const address = Identities.Address.fromPassphrase('test passphrase for mainnet', 23)

      expect(WalletService.validateAddress(address)).toBe(false)
    })
  })

  describe('validatePassphrase', () => {
    it('should return true when a string is provided', () => {
      expect(WalletService.validatePassphrase('test')).toBe(true)
    })
  })

  describe('isBip39Passphrase', () => {
    it('should return true for a valid passphrase', () => {
      expect(WalletService.isBip39Passphrase('one video jaguar gap soldier ill hobby motor bundle couple trophy smoke', 'english')).toBeTrue()
    })

    it('should return false for an invalid passphrase', () => {
      expect(WalletService.isBip39Passphrase('one two three four five six seven eight nine ten eleven twelve', 'english')).toBeFalse()
    })
  })

  describe('validateUsername', () => {
    it('should work OK', () => {
      const username = 'example'
      expect(WalletService.validateUsername(username)).toEqual({
        passes: true,
        errors: []
      })
    })

    it('should not be empty', () => {
      const username = ''
      expect(WalletService.validateUsername(username)).toEqual({
        passes: false,
        errors: [{ type: 'empty' }]
      })
    })

    it('should admit 20 characters at most', () => {
      const username = 'asdf1234asdf1234asdf1234'
      expect(WalletService.validateUsername(username)).toEqual({
        passes: false,
        errors: [{ type: 'maxLength' }]
      })
    })

    it('should error if username exists', () => {
      const username = 'exists'
      expect(WalletService.validateUsername(username)).toEqual({
        passes: false,
        errors: [{ type: 'exists' }]
      })
    })

    it('should not admit uppercase characters', () => {
      const username = 'eXamPLe'
      expect(WalletService.validateUsername(username)).toEqual({
        passes: false,
        errors: [{ type: 'invalidFormat' }]
      })
    })

    it('should admit only alphanumeric characters and some symbols', () => {
      expect(WalletService.validateUsername('a!5@$&_.')).toEqual({
        passes: true,
        errors: []
      })

      expect(WalletService.validateUsername('~ll')).toEqual({
        passes: false,
        errors: [{ type: 'invalidFormat' }]
      })

      expect(WalletService.validateUsername('a#')).toEqual({
        passes: false,
        errors: [{ type: 'invalidFormat' }]
      })

      expect(WalletService.validateUsername('a%0')).toEqual({
        passes: false,
        errors: [{ type: 'invalidFormat' }]
      })

      expect(WalletService.validateUsername('(a)')).toEqual({
        passes: false,
        errors: [{ type: 'invalidFormat' }]
      })

      expect(WalletService.validateUsername('a}a{')).toEqual({
        passes: false,
        errors: [{ type: 'invalidFormat' }]
      })

      expect(WalletService.validateUsername('a[a]')).toEqual({
        passes: false,
        errors: [{ type: 'invalidFormat' }]
      })

      expect(WalletService.validateUsername('a+a')).toEqual({
        passes: false,
        errors: [{ type: 'invalidFormat' }]
      })

      expect(WalletService.validateUsername('a-a')).toEqual({
        passes: false,
        errors: [{ type: 'invalidFormat' }]
      })
    })
  })

  describe('verifyPassphrase', () => {
    it('should return true if address matches passphrase', () => {
      const passphrase = 'test passphrase'
      const address = Identities.Address.fromPassphrase(passphrase)

      expect(WalletService.verifyPassphrase(address, passphrase)).toBe(true)
    })

    it('should return false if address matches passphrase but wrong network', () => {
      const passphrase = 'test passphrase'
      const address = Identities.Address.fromPassphrase(passphrase)

      expect(WalletService.verifyPassphrase(address, passphrase, 23)).toBe(false)
    })

    it('should return false if address is not related to passphrase', () => {
      const passphrase = 'test passphrase'

      expect(WalletService.verifyPassphrase('wrong address', passphrase)).toBe(false)
    })
  })
})
