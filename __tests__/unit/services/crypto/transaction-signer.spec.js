import { cloneDeep } from 'lodash'
import nock from 'nock'
import { Identities, Managers, Transactions } from '@arkecosystem/crypto'
import { TransactionSigner } from '@/services/crypto/transaction-signer'
import BigNumber from '@/plugins/bignumber'
import store from '@/store'
import TransactionService from '@/services/transaction'
import WalletService from '@/services/wallet'
import { CryptoUtils } from '@/services/crypto/utils'

const sessionNetwork = Object.freeze({
  nethash: 'test-nethash',
  constants: {
    epoch: '2017-03-21T13:00:00.000Z',
    aip11: false
  },
  vendorField: {
    maxLength: 64
  }
})

jest.mock('@/store', () => ({
  // __mock__: {

  // },
  getters: {
    'session/profile': {
      id: 'test-profile'
    },
    'session/network': {},
    'network/byId': (id) => {
      let version = 23
      if (id === 'ark.devnet') {
        version = 30
      }

      return {
        constants: {
          epoch: '2017-03-21T13:00:00.000Z'
        },
        version
      }
    },
    'delegate/byAddress': (address) => {
      if (address === 'DTRdbaUW3RQQSL5By4G43JVaeHiqfVp9oh') {
        return {
          username: 'test',
          address,
          publicKey: '034da006f958beba78ec54443df4a3f52237253f7ae8cbdb17dccf3feaa57f3126'
        }
      }
    },
    'transaction/staticFee': (type, group = 1) => {
      const fees = {
        1: [
          0.1 * 1e8, // Transfer
          5 * 1e8, // Second signautre
          25 * 1e8, // Delegate registration
          1 * 1e8, // Vote
          5 * 1e8, // Multisignature
          5 * 1e8, // IPFS
          1 * 1e8, // Multi-payment
          25 * 1e8 // Delegate resignation
        ],
        2: [
          50 * 1e8, // Business Registration
          50 * 1e8, // Business Resignation
          50 * 1e8, // Business Update
          50 * 1e8, // Bridgechain Registration
          50 * 1e8, // Bridgechain Resignation
          50 * 1e8 // Bridgechain Update
        ]
      }

      return fees[group][type]
    },
    'peer/current': () => ({
      ip: '1.1.1.1',
      port: '8080',
      isHttps: false
    }),
    'peer/broadcastPeers': () => [
      {
        ip: '1.1.1.1',
        port: '8080',
        isHttps: false
      },
      {
        ip: '2.2.2.2',
        port: '8080',
        isHttps: false
      }
    ]
  },
  dispatch: jest.fn(),
  watch: jest.fn(() => {
    // getter()
    // require('@/store').__mock__.watch = {
    //   getter: getter(),
    //   getter: callback(),
    //   options
    // }
  })
}))

const setAip11AndSpy = (enabled = true, spy = true) => {
  const network = {
    ...sessionNetwork,
    constants: {
      ...sessionNetwork.constants,
      aip11: enabled
    }
  }

  Managers.configManager.getMilestone().aip11 = enabled
  store.getters['session/network'] = network

  if (!spy) {
    return
  }

  return jest.spyOn(store.getters, 'network/byId').mockReturnValue(network)
}

beforeEach(() => {
  Managers.configManager.setFromPreset('testnet')
  store.getters['session/network'] = cloneDeep(sessionNetwork)

  nock.cleanAll()
})

afterEach(() => jest.clearAllMocks())

describe('Services > Client', () => {
  describe('sign', () => {
    const address = Identities.Address.fromPassphrase('passphrase', 23)
    const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
    const passphrase = 'passphrase'
    const secondPassphrase = 'second passphrase'
    let transaction
    let signData

    beforeEach(() => {
      transaction = Transactions.BuilderFactory
        .transfer()
        .amount(new BigNumber(1 * 1e8))
        .fee(new BigNumber(0.1 * 1e8))
        .recipientId(address)
        .vendorField('test vendorfield')

      signData = {
        address,
        transaction,
        passphrase,
        secondPassphrase,
        networkWif: 170,
        networkId: 'ark.mainnet',
        nonce: '1'
      }
    })

    it('should sign transaction', async () => {
      setAip11AndSpy(false, false)

      const response = await TransactionSigner.sign(signData)

      expect(response.vendorField).toEqual(transaction.data.vendorField)
      expect(response.amount).toBe(new BigNumber(1 * 1e8).toString())
      expect(response.fee).toBe(new BigNumber(0.1 * 1e8).toString())
      expect(response.senderPublicKey).toEqual(publicKey)
      expect(response.type).toEqual(0)
      expect(response.version).toEqual(1)
    })

    it('should get network from session if no id', async () => {
      const networkByIdSpy = jest.spyOn(store.getters, 'network/byId')

      await TransactionSigner.sign({
        ...signData,
        networkId: null
      })

      expect(networkByIdSpy).not.toHaveBeenCalled()

      networkByIdSpy.mockRestore()
    })

    it('should get network by id if provided', async () => {
      const networkByIdSpy = jest.spyOn(store.getters, 'network/byId')

      await TransactionSigner.sign(signData)

      expect(networkByIdSpy).toHaveBeenCalledWith('ark.mainnet')

      networkByIdSpy.mockRestore()
    })

    it('should normalize passphrase if provided', async () => {
      const spy = jest.spyOn(CryptoUtils, 'normalizePassphrase')

      await TransactionSigner.sign(signData)

      expect(spy).toHaveBeenCalledWith(signData.passphrase)
      expect(spy).toHaveBeenCalledWith(signData.secondPassphrase)
    })

    it('should not normalize if no passphrase is provided', async () => {
      const spy = jest.spyOn(CryptoUtils, 'normalizePassphrase')
      const wif = Identities.WIF.fromPassphrase(passphrase, { wif: 170 })

      await TransactionSigner.sign({
        ...signData,
        passphrase: null,
        secondPassphrase: null,
        wif
      })

      expect(spy).not.toHaveBeenCalled()
    })

    it('should create v1 transaction if aip11 disabled', async () => {
      const response = await TransactionSigner.sign(signData)

      expect(response.version).toBe(1)
      expect(response.nonce).toBeFalsy()
      expect(response.timestamp).toBeTruthy()
    })

    it('should create v2 transaction if aip11 enabled', async () => {
      const spy = setAip11AndSpy(true)

      const response = await TransactionSigner.sign(signData)

      spy.mockRestore()

      expect(response.version).toBe(2)
      expect(response.nonce).toBe('1')
    })

    it.skip('should increment nonce of wallet', async () => {
      const spy = setAip11AndSpy(true)
      nock('http://127.0.0.1:4003')
        .get(`/api/v2/wallets/${address}`)
        .reply(200, {
          data: {
            nonce: 3
          }
        })

      const response = await TransactionSigner.sign(signData)

      spy.mockRestore()

      expect(response.version).toBe(2)
      expect(response.nonce).toBe('4')
    })

    it('should default nonce to 0 if no wallet', async () => {
      const spy = setAip11AndSpy(true)
      nock('http://127.0.0.1:4003')
        .get(`/api/v2/wallets/${address}`)
        .reply(200, {
          data: {}
        })

      const response = await TransactionSigner.sign(signData)

      spy.mockRestore()

      expect(response.version).toBe(2)
      expect(response.nonce).toBe('1')
    })

    it('should sign with passphrase', async () => {
      const spy = setAip11AndSpy(true)
      const spySignPassphrase = jest.spyOn(transaction, 'sign')

      const response = await TransactionSigner.sign(signData)

      spy.mockRestore()

      expect(response.version).toBe(2)
      expect(response.nonce).toBe('1')
      expect(spySignPassphrase).toHaveBeenCalledWith(passphrase)
    })

    it('should sign with second passphrase', async () => {
      const spy = setAip11AndSpy(true)
      const spySecondSignPassphrase = jest.spyOn(transaction, 'secondSign')

      const response = await TransactionSigner.sign(signData)

      spy.mockRestore()

      expect(response.version).toBe(2)
      expect(response.nonce).toBe('1')
      expect(spySecondSignPassphrase).toHaveBeenCalledWith(secondPassphrase)
    })

    it('should sign with wif', async () => {
      const spy = setAip11AndSpy(true)
      const spySignWif = jest.spyOn(transaction, 'signWithWif')
      const wif = Identities.WIF.fromPassphrase(passphrase, { wif: 170 })

      const response = await TransactionSigner.sign({
        ...signData,
        passphrase: null,
        secondPassphrase: null,
        wif,
        nonce: '1'
      })

      spy.mockRestore()

      expect(response.version).toBe(2)
      expect(response.nonce).toBe('1')
      expect(spySignWif).toHaveBeenCalledWith(wif, 170)
    })

    it('should return object', async () => {
      const spy = setAip11AndSpy(true)

      const response = await TransactionSigner.sign(signData, true)

      spy.mockRestore()

      expect(response.data).toBeTruthy()
      expect(response.constructor.name).toBe('TransferBuilder')
    })

    describe('multiSignature', () => {
      const minKeys = 3
      let multiSignature
      let publicKeys
      let aip11Spy

      beforeEach(() => {
        publicKeys = []
        for (let i = 0; i < 5; i++) {
          publicKeys.push(Identities.PublicKey.fromPassphrase(`passphrase ${i}`))
        }

        multiSignature = {
          publicKeys,
          min: minKeys
        }
        aip11Spy = setAip11AndSpy(true)
      })

      afterEach(() => {
        aip11Spy.mockRestore()
      })

      it('should create transaction for multi-signature wallet when using passphrase', async () => {
        const getPublicKeyFromPassphrase = WalletService.getPublicKeyFromPassphrase
        WalletService.getPublicKeyFromPassphrase = jest.fn((passphrase) => Identities.PublicKey.fromPassphrase(passphrase))

        const response = await TransactionSigner.sign({
          ...signData,
          multiSignature
        })

        WalletService.getPublicKeyFromPassphrase = getPublicKeyFromPassphrase

        expect(response.signatures.length).toBe(0)
      })

      it('should return transaction with multiSignature property', async () => {
        const getPublicKeyFromPassphrase = WalletService.getPublicKeyFromPassphrase
        WalletService.getPublicKeyFromPassphrase = jest.fn((passphrase) => Identities.PublicKey.fromPassphrase(passphrase))

        const response = await TransactionSigner.sign({
          ...signData,
          multiSignature
        })

        WalletService.getPublicKeyFromPassphrase = getPublicKeyFromPassphrase

        expect(response.multiSignature).toBe(multiSignature)
      })

      describe('own passphrase used', () => {
        beforeEach(() => publicKeys.push(Identities.PublicKey.fromPassphrase(`${passphrase}`)))

        it('should add signature to list of signatures', async () => {
          const spyMultiSign = jest.spyOn(transaction, 'multiSign')
          const getPublicKeyFromPassphraseMock = jest.fn((passphrase) => Identities.PublicKey.fromPassphrase(passphrase))
          const getPublicKeyFromPassphrase = WalletService.getPublicKeyFromPassphrase
          WalletService.getPublicKeyFromPassphrase = getPublicKeyFromPassphraseMock

          const response = await TransactionSigner.sign({
            ...signData,
            multiSignature
          })

          WalletService.getPublicKeyFromPassphrase = getPublicKeyFromPassphrase

          const publicKeyIndex = publicKeys.indexOf(publicKey)
          const signature = response.signatures.find(s => parseInt(s.substring(0, 2), 16) === publicKeyIndex)

          expect(getPublicKeyFromPassphraseMock).toHaveBeenCalledWith(passphrase)
          expect(spyMultiSign).toHaveBeenCalledWith(passphrase, publicKeyIndex)
          expect(signature).toBeTruthy()
        })
      })

      describe('own wif used', () => {
        beforeEach(() => {
          publicKeys.push(Identities.PublicKey.fromPassphrase(`${passphrase}`))
        })

        it('should add signature to list of signatures', async () => {
          const spyMultiSignWithWif = jest.spyOn(transaction, 'multiSignWithWif')
          const getPublicKeyFromWIFMock = jest.fn((wif) => Identities.PublicKey.fromWIF(wif, { wif: 170 }))
          const getPublicKeyFromWIF = WalletService.getPublicKeyFromWIF
          WalletService.getPublicKeyFromWIF = getPublicKeyFromWIFMock

          const wif = Identities.WIF.fromPassphrase(passphrase, { wif: 170 })
          const response = await TransactionSigner.sign({
            ...signData,
            multiSignature,
            passphrase: null,
            secondPassphrase: null,
            wif
          })

          WalletService.getPublicKeyFromWIF = getPublicKeyFromWIF

          const publicKeyIndex = publicKeys.indexOf(publicKey)
          const signature = response.signatures.find(s => parseInt(s.substring(0, 2), 16) === publicKeyIndex)

          expect(getPublicKeyFromWIFMock).toHaveBeenCalledWith(wif)
          expect(spyMultiSignWithWif).toHaveBeenCalledWith(publicKeyIndex, wif, 170)
          expect(signature).toBeTruthy()
        })
      })
    })
  })

  describe('multiSign', () => {
    const masterPassphrase = 'passphrase'
    const address = Identities.Address.fromPassphrase(masterPassphrase, 23)
    const publicKey = Identities.PublicKey.fromPassphrase(masterPassphrase)
    const minKeys = 3
    let publicKeys
    let transaction
    let signData
    let multiSignature
    let aip11Spy

    beforeEach(() => {
      publicKeys = []
      for (let i = 0; i < 5; i++) {
        publicKeys.push(Identities.PublicKey.fromPassphrase(`passphrase ${i}`))
      }

      multiSignature = {
        publicKeys,
        min: minKeys
      }
      aip11Spy = setAip11AndSpy(true)

      transaction = {
        amount: new BigNumber(1 * 1e8),
        fee: new BigNumber(0.1 * 1e8),
        type: 0,
        typeGroup: 1,
        recipientId: address,
        vendorField: 'test vendorfield',
        version: 2,
        network: 23,
        senderPublicKey: publicKey,
        nonce: '1',
        signatures: []
      }

      signData = {
        multiSignature,
        networkWif: 170,
        passphrase: 'passphrase 1'
      }
    })

    afterEach(() => {
      aip11Spy.mockRestore()
    })

    it('should throw error if no passphrase or wif', async () => {
      expect(TransactionSigner.multiSign(transaction, { multiSignature })).rejects.toThrow('No passphrase or wif provided')
    })

    it('should throw error aip11 not enabled', async () => {
      setAip11AndSpy(false, false)

      expect(TransactionSigner.multiSign(transaction, signData)).rejects.toThrow('Multi-Signature Transactions are not supported yet')
    })

    it.skip('should parse transaction from data', async () => {
      const spy = jest.spyOn(CryptoUtils, 'transactionFromData')

      await TransactionSigner.multiSign(transaction, signData)
      expect(spy).toHaveBeenCalledWith(transaction)
    })

    it('should get keys from passphrase if provided', async () => {
      const spy = jest.spyOn(Identities.Keys, 'fromPassphrase')

      await TransactionSigner.multiSign(transaction, signData)
      expect(spy).toHaveBeenCalledWith('passphrase 1')

      spy.mockRestore()
    })

    it('should get keys from wif if provided', async () => {
      const wif = Identities.WIF.fromPassphrase('passphrase 1', { wif: 170 })
      const spy = jest.spyOn(Identities.Keys, 'fromWIF')

      await TransactionSigner.multiSign(transaction, {
        ...signData,
        passphrase: null,
        wif
      })
      expect(spy).toHaveBeenCalledWith(wif, { wif: 170 })

      spy.mockRestore()
    })

    it('should check if signatures are needed', async () => {
      const spy = jest.spyOn(TransactionService, 'isMultiSignatureReady')

      await TransactionSigner.multiSign(transaction, signData)

      expect(spy).toHaveBeenCalledWith({ ...transaction, multiSignature }, true)
      expect(spy).toHaveBeenCalledTimes(1)

      spy.mockRestore()
    })

    it('should throw error if passphrase is not required for multi-signature wallet', async () => {
      expect(TransactionSigner.multiSign(transaction, { ...signData, passphrase: 'not used' })).rejects.toThrow('passphrase/wif is not used to sign this transaction')
    })

    it('should add signature for passphrase', async () => {
      const response = await TransactionSigner.multiSign(transaction, signData)

      expect(response.signatures.length).toBe(1)
      expect(response.signatures[0]).toBeTruthy()
    })

    it('should add additional signatures upto minimum required', async () => {
      for (let i = 0; i < minKeys; i++) {
        transaction = await TransactionSigner.multiSign(transaction, { ...signData, passphrase: `passphrase ${i}` })
      }

      expect(transaction.signatures.length).toBe(3)
      for (let i = 0; i < minKeys; i++) {
        const publicKeyIndex = publicKeys.indexOf(Identities.PublicKey.fromPassphrase(`passphrase ${i}`))
        const signature = transaction.signatures.find(s => parseInt(s.substring(0, 2), 16) === publicKeyIndex)

        expect(signature).toBeTruthy()
      }
    })

    it('should not sign transaction if not primary sender', async () => {
      for (let i = 0; i < 4; i++) {
        transaction = await TransactionSigner.multiSign(transaction, { ...signData, passphrase: `passphrase ${i}` })
      }

      expect(transaction.signature).toBeFalsy()
    })

    it('should ignore duplicate signatures for passphrase', async () => {
      transaction = await TransactionSigner.multiSign(transaction, { ...signData, passphrase: 'passphrase 1' })
      transaction = await TransactionSigner.multiSign(transaction, { ...signData, passphrase: 'passphrase 2' })
      transaction = await TransactionSigner.multiSign(transaction, { ...signData, passphrase: 'passphrase 1' })

      const publicKeyIndex = publicKeys.indexOf(Identities.PublicKey.fromPassphrase('passphrase 1'))
      const signatures = transaction.signatures.filter(s => parseInt(s.substring(0, 2), 16) === publicKeyIndex)
      expect(signatures.length).toBe(1)
    })

    it('should only sign transaction with sender passphrase for registration', async () => {
      transaction = {
        fee: new BigNumber(0.1 * 1e8),
        type: 4,
        typeGroup: 1,
        version: 2,
        network: 23,
        senderPublicKey: publicKey,
        nonce: '1',
        signatures: [],
        asset: {
          multiSignature
        }
      }

      for (let i = 0; i < 5; i++) {
        transaction = await TransactionSigner.multiSign(transaction, { ...signData, passphrase: `passphrase ${i}` })
      }
      transaction = await TransactionSigner.multiSign(transaction, { ...signData, passphrase: masterPassphrase })

      expect(transaction.signature).toBeTruthy()
      expect(transaction.signatures.length).toBe(5)
    })

    it('should sign transaction with sender second passphrase for registration', async () => {
      transaction = {
        fee: new BigNumber(0.1 * 1e8),
        type: 4,
        typeGroup: 1,
        version: 2,
        network: 23,
        senderPublicKey: publicKey,
        nonce: '1',
        signatures: [],
        asset: {
          multiSignature
        }
      }

      for (let i = 0; i < 5; i++) {
        transaction = await TransactionSigner.multiSign(transaction, { ...signData, passphrase: `passphrase ${i}` })
      }
      transaction = await TransactionSigner.multiSign(transaction, {
        ...signData,
        passphrase: masterPassphrase,
        secondPassphrase: 'second-passphrase'
      })

      expect(transaction.signature).toBeTruthy()
      expect(transaction.secondSignature).toBeTruthy()
      expect(transaction.signatures.length).toBe(5)
    })
  })
})
