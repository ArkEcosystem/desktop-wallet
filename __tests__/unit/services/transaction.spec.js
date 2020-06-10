import { Crypto, Identities, Managers, Transactions } from '@arkecosystem/crypto'
import * as MagistrateCrypto from '@arkecosystem/core-magistrate-crypto'
import TransactionService from '@/services/transaction'
import transactionFixture from '../__fixtures__/models/transaction'
import currencyMixin from '@/mixins/currency'

Transactions.TransactionRegistry.registerTransactionType(MagistrateCrypto.Transactions.BusinessRegistrationTransaction)
Transactions.TransactionRegistry.registerTransactionType(MagistrateCrypto.Transactions.BridgechainRegistrationTransaction)

const recipientAddress = Identities.Address.fromPassphrase('recipient passphrase')
const senderPassphrase = 'sender passphrase'
const senderPublicKey = Identities.PublicKey.fromPassphrase(senderPassphrase)

const mockVm = {
  currency_toBuilder: (value) => {
    return currencyMixin.methods.currency_toBuilder(value, {
      fractionDigits: 8
    })
  }
}

describe('Services > Transaction', () => {
  describe('getId', () => {
    it('should return the transaction id', () => {
      expect(TransactionService.getId(transactionFixture)).toBe(transactionFixture.id)
    })
  })

  describe('getBytes', () => {
    it('should return the transaction bytes', () => {
      const transactionBytes = TransactionService.getBytes(transactionFixture)
      expect(transactionBytes).toBeInstanceOf(Buffer)
      expect(transactionBytes).toEqual(Buffer.from('00f0eb920302275d8577a0ec2b75fc8683282d53c5db76ebc54514a80c2854e419b793ea259a17ee9f689978490631699e01ca0fc2edbecb5ee0390000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000008096980000000000', 'hex'))
    })
  })

  describe('getHash', () => {
    const passphrase = 'test passphrase'
    let transaction
    beforeEach(() => {
      Managers.configManager.getMilestone().aip11 = true
      transaction = Transactions.BuilderFactory
        .multiSignature()
        .multiSignatureAsset({
          min: 1,
          publicKeys: [
            Identities.PublicKey.fromPassphrase(passphrase)
          ]
        })
        .sign('passphrase')
        .fee(1)
    })

    it('should return hash excluding multisig signatures', () => {
      const hash = TransactionService.getHash(transaction.getStruct()).toString('hex')
      transaction.multiSign(passphrase, 0)

      expect(TransactionService.getHash(transaction.getStruct()).toString('hex')).toBe(hash)
    })

    it('should return hash including multisig signatures', () => {
      const hash = TransactionService.getHash(transaction.getStruct()).toString('hex')
      transaction.multiSign(passphrase, 0)

      expect(TransactionService.getHash(transaction.getStruct(), false).toString('hex')).not.toBe(hash)
    })
  })

  describe('getAmount', () => {
    describe('standard transaction', () => {
      let transaction
      beforeEach(() => {
        transaction = Transactions.BuilderFactory
          .transfer()
          .amount('100000000')
          .fee('10000000')
          .recipientId(recipientAddress)
          .sign('passphrase')
          .build()
          .toJson()
      })

      it('should get correct amount with fee', () => {
        expect(TransactionService.getAmount(mockVm, transaction, null, true).toFixed()).toEqual('110000000')
      })

      it('should get correct amount without fee', () => {
        expect(TransactionService.getAmount(mockVm, transaction).toFixed()).toEqual('100000000')
      })
    })

    describe('multi-payment transaction', () => {
      let transaction
      beforeEach(() => {
        transaction = Transactions.BuilderFactory
          .multiPayment()
          .addPayment(Identities.Address.fromPassphrase('recipient 1'), '100000000')
          .addPayment(Identities.Address.fromPassphrase('recipient 2'), '100000000')
          .addPayment(Identities.Address.fromPassphrase('recipient 3'), '100000000')
          .fee('10000000')
          .recipientId(recipientAddress)
          .sign('passphrase')
          .build()
          .toJson()

        transaction.sender = Identities.Address.fromPassphrase('passphrase')
      })

      it('should get correct amount with fee', () => {
        expect(TransactionService.getAmount(mockVm, transaction, null, true).toFixed()).toEqual('310000000')
      })

      it('should get correct amount without fee', () => {
        expect(TransactionService.getAmount(mockVm, transaction).toFixed()).toEqual('300000000')
      })

      it('should get correct amount if sender including fee', () => {
        const wallet = {
          address: Identities.Address.fromPassphrase('passphrase')
        }

        expect(TransactionService.getAmount(mockVm, transaction, wallet, true).toFixed()).toEqual('310000000')
      })

      it('should get correct amount if recipient including fee', () => {
        const wallet = {
          address: Identities.Address.fromPassphrase('recipient 3')
        }

        expect(TransactionService.getAmount(mockVm, transaction, wallet, true).toFixed()).toEqual('100000000')
      })
    })
  })

  describe('isMultiSignature', () => {
    it('should return true if has multiSignature property', () => {
      const transaction = { ...transactionFixture, multiSignature: { min: 1, publicKeys: [] } }

      expect(TransactionService.isMultiSignature(transaction)).toBe(true)
    })

    it('should return false if no multiSignature property', () => {
      const transaction = { ...transactionFixture }

      expect(TransactionService.isMultiSignature(transaction)).toBe(false)
    })
  })

  describe('isMultiSignatureRegistration', () => {
    it('should return true if multiSignature transaction', () => {
      Managers.configManager.getMilestone().aip11 = true

      const transaction = Transactions.BuilderFactory
        .multiSignature()
        .multiSignatureAsset({
          min: 1,
          publicKeys: []
        })
        .sign('passphrase')
        .fee(1)
        .getStruct()

      expect(TransactionService.isMultiSignatureRegistration(transaction)).toBe(true)
    })

    it('should return false if no multiSignature property', () => {
      const transaction = { ...transactionFixture }

      expect(TransactionService.isMultiSignature(transaction)).toBe(false)
    })
  })

  describe('getValidMultiSignatures', () => {
    let multiSignatureAsset, passphrases, transaction

    beforeEach(() => {
      Managers.configManager.getMilestone().aip11 = true
      passphrases = [
        'passphrase 1',
        'passphrase 2',
        'passphrase 3'
      ]

      multiSignatureAsset = {
        min: 1,
        publicKeys: passphrases.map(passphrase => Identities.PublicKey.fromPassphrase(passphrase))
      }

      transaction = Transactions.BuilderFactory
        .multiSignature()
        .multiSignatureAsset(multiSignatureAsset)
        .fee(1)

      transaction.data.senderPublicKey = senderPublicKey
    })

    it('should return only valid signatures', () => {
      transaction.multiSign(passphrases[2], 2)
        .multiSign(passphrases[0], 0)
        .multiSign('wrong passphrase', 1)

      const transactionJson = transaction.getStruct()
      transactionJson.multiSignature = multiSignatureAsset

      const validSignatures = TransactionService.getValidMultiSignatures(transactionJson)

      expect(validSignatures.map(signature => parseInt(signature.substring(0, 2)))).toIncludeSameMembers([0, 2])
    })

    it('should return empty array if not multiSignature object', () => {
      expect(TransactionService.getValidMultiSignatures(transaction)).toEqual([])
    })
  })

  describe('needsSignatures', () => {
    it('should check if all signatures are needed for multisig registration', () => {
      const multiSignatureAsset = {
        min: 1,
        publicKeys: []
      }

      const transaction = Transactions.BuilderFactory
        .multiSignature()
        .multiSignatureAsset(multiSignatureAsset)
        .sign('passphrase')
        .fee(1)
        .getStruct()

      const spy = jest.spyOn(TransactionService, 'needsAllSignatures')
        .mockImplementation()

      transaction.multiSignature = multiSignatureAsset

      TransactionService.needsSignatures(transaction)

      expect(spy).toHaveBeenCalledWith(transaction)

      spy.mockRestore()
    })

    it('should return false if no multiSignature property', () => {
      const transaction = Transactions.BuilderFactory
        .transfer()
        .amount(1)
        .fee(1)
        .recipientId(recipientAddress)
        .sign(senderPassphrase)
        .getStruct()

      expect(TransactionService.needsSignatures(transaction)).toBe(false)
    })

    it('should return true when below min required signatures', () => {
      const multiSignatureAsset = {
        min: 5,
        publicKeys: []
      }

      for (let i = 1; i <= 10; i++) {
        multiSignatureAsset.publicKeys.push(Identities.PublicKey.fromPassphrase(`passphrase ${i}`))
      }

      const transactionObject = Transactions.BuilderFactory
        .transfer()
        .amount(1)
        .fee(1)
        .recipientId(recipientAddress)

      transactionObject.data.senderPublicKey = senderPublicKey
      transactionObject.data.signatures = []

      const transaction = transactionObject.getStruct()
      transaction.multiSignature = multiSignatureAsset

      expect(TransactionService.needsSignatures(transaction)).toBe(true)
    })

    it('should return false when above min required signatures', () => {
      const multiSignatureAsset = {
        min: 5,
        publicKeys: []
      }

      for (let i = 1; i <= 10; i++) {
        multiSignatureAsset.publicKeys.push(Identities.PublicKey.fromPassphrase(`passphrase ${i}`))
      }

      const transactionObject = Transactions.BuilderFactory
        .transfer()
        .amount(1)
        .fee(1)
        .recipientId(recipientAddress)

      transactionObject.data.senderPublicKey = senderPublicKey
      transactionObject.data.signatures = []

      for (let i = 1; i <= multiSignatureAsset.min + 1; i++) {
        transactionObject.multiSign(`passphrase ${i}`)
      }

      const transaction = transactionObject.getStruct()
      transaction.multiSignature = multiSignatureAsset

      expect(TransactionService.needsSignatures(transaction)).toBe(false)
    })
  })

  describe('needsAllSignatures', () => {
    let multiSignatureAsset, transactionObject
    beforeEach(() => {
      multiSignatureAsset = {
        min: 5,
        publicKeys: []
      }

      for (let i = 1; i <= 10; i++) {
        multiSignatureAsset.publicKeys.push(Identities.PublicKey.fromPassphrase(`passphrase ${i}`))
      }

      transactionObject = Transactions.BuilderFactory
        .multiSignature()
        .multiSignatureAsset(multiSignatureAsset)
        .fee(1)

      transactionObject.data.senderPublicKey = senderPublicKey
      transactionObject.data.signatures = []
    })

    it('should call getValidMultiSignatures', () => {
      for (let i = 1; i <= multiSignatureAsset.min - 1; i++) {
        transactionObject.multiSign(`passphrase ${i}`)
      }

      const transaction = transactionObject.getStruct()
      transaction.multiSignature = multiSignatureAsset

      const spy = jest.spyOn(TransactionService, 'getValidMultiSignatures')

      TransactionService.needsAllSignatures(transaction)

      expect(spy).toHaveBeenCalledWith(transaction)

      spy.mockRestore()
    })

    it('should return true when signatures are missing', () => {
      for (let i = 1; i <= multiSignatureAsset.min - 1; i++) {
        transactionObject.multiSign(`passphrase ${i}`)
      }

      const transaction = transactionObject.getStruct()
      transaction.multiSignature = multiSignatureAsset

      expect(TransactionService.needsAllSignatures(transaction)).toBe(true)
    })

    it('should return true when incorrect signatures are provided', () => {
      for (let i = 1; i <= multiSignatureAsset.min - 1; i++) {
        transactionObject.multiSign(`passphrase ${i}`)
      }

      transactionObject.multiSign('wrong passphrase')

      const transaction = transactionObject.getStruct()
      transaction.multiSignature = multiSignatureAsset

      expect(TransactionService.needsAllSignatures(transaction)).toBe(true)
    })

    it('should return false when no signatures are missing', () => {
      for (let i = 1; i <= multiSignatureAsset.min; i++) {
        transactionObject.multiSign(`passphrase ${i}`)
      }

      const transaction = transactionObject.getStruct()
      transaction.multiSignature = multiSignatureAsset

      expect(TransactionService.needsAllSignatures(transaction)).toBe(true)
    })
  })

  describe('needsWalletSignature', () => {
    describe('multi-signature registration', () => {
      let multiSignatureAsset, transaction, transactionObject
      beforeEach(() => {
        multiSignatureAsset = {
          min: 5,
          publicKeys: []
        }

        for (let i = 1; i <= 10; i++) {
          multiSignatureAsset.publicKeys.push(Identities.PublicKey.fromPassphrase(`passphrase ${i}`))
        }

        transactionObject = Transactions.BuilderFactory
          .multiSignature()
          .multiSignatureAsset(multiSignatureAsset)
          .fee(1)

        transactionObject.data.senderPublicKey = senderPublicKey
        transactionObject.data.signatures = []

        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset
      })

      it('should check if transaction is ready', () => {
        const spy = jest.spyOn(TransactionService, 'isMultiSignatureReady')
          .mockImplementation(() => false)

        TransactionService.needsWalletSignature(transaction, transactionObject.data.senderPublicKey)

        expect(spy).toHaveBeenCalledWith(transaction, true)

        spy.mockRestore()
      })

      it('should check for final signature', () => {
        const spyReady = jest.spyOn(TransactionService, 'isMultiSignatureReady')
          .mockImplementation(() => true)

        const spyFinalSignature = jest.spyOn(TransactionService, 'needsFinalSignature')
          .mockImplementation(() => false)

        TransactionService.needsWalletSignature(transaction, transactionObject.data.senderPublicKey)

        expect(spyFinalSignature).toHaveBeenCalledWith(transaction)

        spyReady.mockRestore()
        spyFinalSignature.mockRestore()
      })

      it('should match public key', () => {
        const spyReady = jest.spyOn(TransactionService, 'isMultiSignatureReady')
          .mockImplementation(() => true)

        const spyFinalSignature = jest.spyOn(TransactionService, 'needsFinalSignature')
          .mockImplementation(() => false)

        expect(TransactionService.needsWalletSignature(transaction, 'fake public key')).toBe(false)
        expect(spyFinalSignature).not.toHaveBeenCalledWith(transaction)

        spyReady.mockRestore()
        spyFinalSignature.mockRestore()
      })

      it('should return true if no final signature', () => {
        for (let i = 1; i <= 10; i++) {
          transactionObject.multiSign(`passphrase ${i}`)
        }
        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset

        expect(TransactionService.needsWalletSignature(transaction, senderPublicKey)).toBe(true)
      })

      it('should return false if all signatures (including final)', () => {
        for (let i = 1; i <= 10; i++) {
          transactionObject.multiSign(`passphrase ${i}`)
        }
        transactionObject.sign(senderPassphrase)
        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset

        expect(TransactionService.needsWalletSignature(transaction, senderPublicKey)).toBe(false)
      })
    })

    describe('non-registration', () => {
      let multiSignatureAsset, transaction, transactionObject
      beforeEach(() => {
        multiSignatureAsset = {
          min: 5,
          publicKeys: []
        }

        for (let i = 1; i <= 10; i++) {
          multiSignatureAsset.publicKeys.push(Identities.PublicKey.fromPassphrase(`passphrase ${i}`))
        }

        transactionObject = Transactions.BuilderFactory
          .transfer()
          .amount(1)
          .fee(1)
          .recipientId(recipientAddress)

        transactionObject.data.senderPublicKey = senderPublicKey
        transactionObject.data.signatures = []

        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset
      })

      it('should return false if no multiSignature property', () => {
        transaction.multiSignature = undefined

        expect(TransactionService.needsWalletSignature(transaction, 'public key')).toBe(false)
      })

      it('should return false if public key is not required for multi-signature', () => {
        expect(TransactionService.needsWalletSignature(transaction, 'public key')).toBe(false)
      })

      it('should return true if no signatures property', () => {
        transaction.signatures = undefined

        expect(TransactionService.needsWalletSignature(transaction, multiSignatureAsset.publicKeys[0])).toBe(true)
      })

      it('should return true if signature is missing', () => {
        expect(TransactionService.needsWalletSignature(transaction, multiSignatureAsset.publicKeys[0])).toBe(true)
      })

      it('should return false if signature exists', () => {
        transactionObject.multiSign('passphrase 1')
        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset

        expect(TransactionService.needsWalletSignature(transaction, multiSignatureAsset.publicKeys[0])).toBe(false)
      })

      it('should return false if min keys is met', () => {
        for (let i = 1; i <= multiSignatureAsset.min; i++) {
          transactionObject.multiSign(`passphrase ${i}`)
        }
        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset

        expect(TransactionService.needsWalletSignature(transaction, multiSignatureAsset.publicKeys[9])).toBe(false)
      })
    })
  })

  describe('needsFinalSignature', () => {
    let multiSignatureAsset, transactionObject, transaction

    beforeEach(() => {
      multiSignatureAsset = {
        min: 5,
        publicKeys: []
      }

      for (let i = 1; i <= 10; i++) {
        multiSignatureAsset.publicKeys.push(Identities.PublicKey.fromPassphrase(`passphrase ${i}`))
      }

      transactionObject = Transactions.BuilderFactory
        .multiSignature()
        .multiSignatureAsset(multiSignatureAsset)
        .fee(1)

      transactionObject.data.senderPublicKey = senderPublicKey
      transactionObject.data.signatures = []

      transaction = transactionObject.getStruct()
    })

    it('should return true if no signature property', () => {
      transaction.signature = undefined

      expect(TransactionService.needsFinalSignature(transaction)).toBe(true)
    })

    it('should return true if signed before multi-sign signatures', () => {
      transactionObject.sign(senderPassphrase)
      for (let i = 1; i <= 10; i++) {
        transactionObject.multiSign(`passphrase ${i}`)
      }
      transaction = transactionObject.getStruct()

      expect(TransactionService.needsFinalSignature(transaction)).toBe(true)
    })

    it('should return false if signed after multi-sign signatures', () => {
      for (let i = 1; i <= 10; i++) {
        transactionObject.multiSign(`passphrase ${i}`)
      }
      transactionObject.sign(senderPassphrase)
      transaction = transactionObject.getStruct()

      expect(TransactionService.needsFinalSignature(transaction)).toBe(false)
    })

    it('should return false if signed', () => {
      transactionObject.sign(senderPassphrase)
      transaction = transactionObject.getStruct()

      expect(TransactionService.needsFinalSignature(transaction)).toBe(false)
    })

    it('should return false if multi-signature but not registration', () => {
      transactionObject = Transactions.BuilderFactory
        .transfer()
        .amount(1)
        .fee(1)
        .recipientId(recipientAddress)

      transactionObject.data.senderPublicKey = senderPublicKey
      transactionObject.data.signatures = []

      transaction = transactionObject.getStruct()
      transaction.multiSignature = multiSignatureAsset

      const spy = jest.spyOn(Crypto.Hash, 'verifySchnorr')

      expect(TransactionService.needsFinalSignature(transaction)).toBe(false)
      expect(spy).not.toHaveBeenCalled()

      spy.mockRestore()
    })
  })

  describe('isMultiSignatureReady', () => {
    describe('multi-signature registration', () => {
      const publicKeyCount = 10
      let multiSignatureAsset, spyRegistration, spyNeedsSignatures, transaction, transactionObject
      beforeEach(() => {
        multiSignatureAsset = {
          min: 5,
          publicKeys: []
        }

        for (let i = 1; i <= publicKeyCount; i++) {
          multiSignatureAsset.publicKeys.push(Identities.PublicKey.fromPassphrase(`passphrase ${i}`))
        }

        transactionObject = Transactions.BuilderFactory
          .multiSignature()
          .multiSignatureAsset(multiSignatureAsset)
          .fee(1)

        transactionObject.data.senderPublicKey = senderPublicKey
        transactionObject.data.signatures = []

        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset

        spyRegistration = jest.spyOn(TransactionService, 'isMultiSignatureRegistration')
        spyNeedsSignatures = jest.spyOn(TransactionService, 'needsSignatures')
      })

      afterEach(() => {
        spyRegistration.mockRestore()
        spyNeedsSignatures.mockRestore()
      })

      it('should return true if multi-signed and with primary passphrase', () => {
        for (let i = 1; i <= publicKeyCount; i++) {
          transactionObject.multiSign(`passphrase ${i}`)
        }
        transactionObject.sign(senderPassphrase)

        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset

        const spyNeedsFinal = jest.spyOn(TransactionService, 'needsFinalSignature')

        const response = TransactionService.isMultiSignatureReady(transaction)

        expect(spyRegistration).toHaveReturnedWith(true)
        expect(spyNeedsSignatures).toHaveReturnedWith(false)
        expect(spyNeedsFinal).toHaveReturnedWith(false)
        expect(response).toBe(true)

        spyNeedsFinal.mockRestore()
      })

      it('should return true if multi-signed but excluding final', () => {
        for (let i = 1; i <= publicKeyCount; i++) {
          transactionObject.multiSign(`passphrase ${i}`)
        }

        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset

        const response = TransactionService.isMultiSignatureReady(transaction, true)

        expect(spyRegistration).toHaveReturnedWith(true)
        expect(spyNeedsSignatures).toHaveReturnedWith(false)
        expect(response).toBe(true)
      })

      it('should return false because all multi-sign signatures are required', () => {
        for (let i = 1; i <= publicKeyCount - 1; i++) {
          transactionObject.multiSign(`passphrase ${i}`)
        }
        transactionObject.sign(senderPassphrase)

        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset

        const response = TransactionService.isMultiSignatureReady(transaction)

        expect(spyRegistration).toHaveReturnedWith(true)
        expect(spyNeedsSignatures).toHaveReturnedWith(true)
        expect(response).toBe(false)
      })

      it('should return false because primary signature is required', () => {
        for (let i = 1; i <= publicKeyCount; i++) {
          transactionObject.multiSign(`passphrase ${i}`)
        }

        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset

        const response = TransactionService.isMultiSignatureReady(transaction)

        expect(spyRegistration).toHaveReturnedWith(true)
        expect(spyNeedsSignatures).toHaveReturnedWith(false)
        expect(response).toBe(false)
      })

      it('should return false if a wrong multi-sign passphrase is provided', () => {
        for (let i = 1; i <= publicKeyCount - 1; i++) {
          transactionObject.multiSign(`passphrase ${i}`)
        }
        transactionObject.multiSign('wrong passphrase')
        transactionObject.sign(senderPassphrase)

        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset

        const response = TransactionService.isMultiSignatureReady(transaction)

        expect(spyRegistration).toHaveReturnedWith(true)
        expect(spyNeedsSignatures).toHaveReturnedWith(true)
        expect(response).toBe(false)
      })

      it('should return false if final passphrase is wrong', () => {
        for (let i = 1; i <= publicKeyCount; i++) {
          transactionObject.multiSign(`passphrase ${i}`)
        }
        transactionObject.sign('wrong passphrase')

        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset

        const response = TransactionService.isMultiSignatureReady(transaction)

        expect(spyRegistration).toHaveReturnedWith(true)
        expect(spyNeedsSignatures).toHaveReturnedWith(true)
        expect(response).toBe(false)
      })
    })

    describe('non-registration', () => {
      const publicKeyCount = 10
      let multiSignatureAsset, spyRegistration, spyNeedsSignatures, transaction, transactionObject
      beforeEach(() => {
        multiSignatureAsset = {
          min: 5,
          publicKeys: []
        }

        for (let i = 1; i <= publicKeyCount; i++) {
          multiSignatureAsset.publicKeys.push(Identities.PublicKey.fromPassphrase(`passphrase ${i}`))
        }

        transactionObject = Transactions.BuilderFactory
          .transfer()
          .amount(1)
          .fee(1)
          .recipientId(recipientAddress)

        transactionObject.data.senderPublicKey = senderPublicKey
        transactionObject.data.signatures = []

        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset

        spyRegistration = jest.spyOn(TransactionService, 'isMultiSignatureRegistration')
        spyNeedsSignatures = jest.spyOn(TransactionService, 'needsSignatures')
      })

      afterEach(() => {
        spyRegistration.mockRestore()
        spyNeedsSignatures.mockRestore()
      })

      it('should return true if all multi-signed', () => {
        for (let i = 1; i <= publicKeyCount; i++) {
          transactionObject.multiSign(`passphrase ${i}`)
        }

        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset

        const response = TransactionService.isMultiSignatureReady(transaction)

        expect(spyRegistration).toHaveReturnedWith(false)
        expect(spyNeedsSignatures).toHaveReturnedWith(false)
        expect(response).toBe(true)
      })

      it('should return true if multi-signed upto min', () => {
        for (let i = 1; i <= multiSignatureAsset.min; i++) {
          transactionObject.multiSign(`passphrase ${i}`)
        }

        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset

        const response = TransactionService.isMultiSignatureReady(transaction)

        expect(spyRegistration).toHaveReturnedWith(false)
        expect(spyNeedsSignatures).toHaveReturnedWith(false)
        expect(response).toBe(true)
      })

      it('should return false because below min required signatures', () => {
        for (let i = 1; i <= multiSignatureAsset.min - 1; i++) {
          transactionObject.multiSign(`passphrase ${i}`)
        }

        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset

        const response = TransactionService.isMultiSignatureReady(transaction)

        expect(spyRegistration).toHaveReturnedWith(false)
        expect(spyNeedsSignatures).toHaveReturnedWith(true)
        expect(response).toBe(false)
      })

      it('should return false if a wrong multi-sign passphrase is provided', () => {
        for (let i = 1; i <= multiSignatureAsset.min - 1; i++) {
          transactionObject.multiSign(`passphrase ${i}`)
        }
        transactionObject.multiSign('wrong passphrase')

        transaction = transactionObject.getStruct()
        transaction.multiSignature = multiSignatureAsset

        const response = TransactionService.isMultiSignatureReady(transaction)

        expect(spyRegistration).toHaveReturnedWith(false)
        expect(spyNeedsSignatures).toHaveReturnedWith(true)
        expect(response).toBe(false)
      })
    })
  })

  describe('ledgerSignWithSchnorr', () => {
    const vmMock = {
      $store: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        dispatch () {}
      },
      $t (translationKey) {
        return translationKey
      }
    }

    let spyDispatch, spyTranslate, transactionObject, wallet
    beforeEach(() => {
      transactionObject = Transactions.BuilderFactory
        .transfer()
        .amount(1)
        .fee(1)
        .recipientId(recipientAddress)

      spyDispatch = jest.spyOn(vmMock.$store, 'dispatch')
      spyTranslate = jest.spyOn(vmMock, '$t')
      wallet = {
        address: Identities.Address.fromPassphrase(senderPassphrase),
        publicKey: senderPublicKey,
        ledgerIndex: 0
      }
    })

    afterEach(() => {
      spyDispatch.mockRestore()
      spyTranslate.mockRestore()
    })

    it('should schnorr sign the transaction', async () => {
      transactionObject.sign(senderPassphrase)
      const transactionJson = transactionObject.getStruct()

      const bytes = TransactionService.getBytes(transactionJson)
      const id = TransactionService.getId(transactionJson)
      const signature = transactionObject.data.signature

      spyDispatch.mockImplementation((key) => {
        if (key === 'ledger/signTransactionWithSchnorr') {
          return signature
        }
      })

      const spyGetBytes = jest.spyOn(TransactionService, 'getBytes')

      const transaction = await TransactionService.ledgerSign(wallet, transactionObject, vmMock)

      expect(transaction.id).toEqual(id)
      expect(spyGetBytes).toHaveBeenCalledWith(transactionJson)
      expect(spyGetBytes).toHaveReturnedWith(bytes)

      spyGetBytes.mockRestore()
    })

    it('should set the recipientId for vote transactions', async () => {
      transactionObject = Transactions.BuilderFactory
        .vote()
        .votesAsset([`+${senderPublicKey}`])
        .fee(1)
        .sign(senderPassphrase)

      const signature = transactionObject.data.signature

      spyDispatch.mockImplementation((key) => {
        if (key === 'ledger/signTransactionWithSchnorr') {
          return signature
        }
      })

      const transaction = await TransactionService.ledgerSign(wallet, transactionObject, vmMock)

      expect(transaction.recipientId).toEqual(wallet.address)
    })

    it('should not set the recipientId for bridgechain registration (type 3 group 2)', async () => {
      transactionObject = new MagistrateCrypto.Builders
        .BridgechainRegistrationBuilder()
        .bridgechainRegistrationAsset({
          name: 'test_bridgechain',
          seedNodes: [
            '1.1.1.1',
            '2.2.2.2',
            '3.3.3.3',
            '4.4.4.4'
          ],
          ports: {
            '@arkecosystem/core-api': 4003
          },
          genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
          bridgechainRepository: 'https://github.com/arkecosystem/core.git'
        })
        .fee(1)
        .sign(senderPassphrase)

      const signature = transactionObject.data.signature

      spyDispatch.mockImplementation((key) => {
        if (key === 'ledger/signTransactionWithSchnorr') {
          return signature
        }
      })

      const transaction = await TransactionService.ledgerSign(wallet, transactionObject, vmMock)

      expect(transaction.recipientId).toBeFalsy()
    })

    it('should throw error if no signature', async () => {
      await expect(TransactionService.ledgerSign(wallet, transactionObject, vmMock)).rejects.toThrow('TRANSACTION.LEDGER_USER_DECLINED')

      expect(spyTranslate).toHaveBeenCalledWith('TRANSACTION.LEDGER_USER_DECLINED')
    })
  })

  describe('isStandard', () => {
    it('should return true if transaction is transfer', () => {
      const transaction = Transactions.BuilderFactory
        .transfer()
        .amount(1)
        .fee(1)
        .recipientId(recipientAddress)
        .sign(senderPassphrase)
        .getStruct()

      expect(TransactionService.isStandard(transaction)).toBe(true)
    })

    it('should return true if transaction is vote', () => {
      const transaction = Transactions.BuilderFactory
        .vote()
        .votesAsset([`+${senderPublicKey}`])
        .fee(1)
        .sign(senderPassphrase)
        .getStruct()

      expect(TransactionService.isStandard(transaction)).toBe(true)
    })

    it('should return false if transaction is business registration', () => {
      const transaction = new MagistrateCrypto.Builders
        .BusinessRegistrationBuilder()
        .businessRegistrationAsset({
          name: 'Name',
          website: 'http://github.com/ark/core.git'
        })
        .fee(1)
        .sign(senderPassphrase)
        .getStruct()

      expect(TransactionService.isStandard(transaction)).toBe(false)
    })

    it('should return false if transaction is bridgechain registration', () => {
      const transaction = new MagistrateCrypto.Builders
        .BridgechainRegistrationBuilder()
        .bridgechainRegistrationAsset({
          name: 'test_bridgechain',
          seedNodes: [
            '1.1.1.1',
            '2.2.2.2',
            '3.3.3.3',
            '4.4.4.4'
          ],
          ports: {
            '@arkecosystem/core-api': 4003
          },
          genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
          bridgechainRepository: 'https://github.com/arkecosystem/core.git'
        })
        .fee(1)
        .sign(senderPassphrase)
        .getStruct()

      expect(TransactionService.isStandard(transaction)).toBe(false)
    })
  })

  describe('isTransfer', () => {
    it('should return true if transaction is transfer', () => {
      const transaction = Transactions.BuilderFactory
        .transfer()
        .amount(1)
        .fee(1)
        .recipientId(recipientAddress)
        .sign(senderPassphrase)
        .getStruct()

      expect(TransactionService.isTransfer(transaction)).toBe(true)
    })

    it('should return false if transaction is vote', () => {
      const transaction = Transactions.BuilderFactory
        .vote()
        .votesAsset([`+${senderPublicKey}`])
        .fee(1)
        .sign(senderPassphrase)
        .getStruct()

      expect(TransactionService.isTransfer(transaction)).toBe(false)
    })

    it('should return false if transaction is business registration (type 0)', () => {
      const transaction = new MagistrateCrypto.Builders
        .BusinessRegistrationBuilder()
        .businessRegistrationAsset({
          name: 'Name',
          website: 'http://github.com/ark/core.git'
        })
        .fee(1)
        .sign(senderPassphrase)
        .getStruct()

      expect(TransactionService.isTransfer(transaction)).toBe(false)
    })
  })

  describe('isVote', () => {
    it('should return true if transaction is vote', () => {
      const transaction = Transactions.BuilderFactory
        .vote()
        .votesAsset([`+${senderPublicKey}`])
        .fee(1)
        .sign(senderPassphrase)
        .getStruct()

      expect(TransactionService.isVote(transaction)).toBe(true)
    })

    it('should return false if transaction is transfer', () => {
      const transaction = Transactions.BuilderFactory
        .transfer()
        .amount(1)
        .fee(1)
        .recipientId(recipientAddress)
        .sign(senderPassphrase)
        .getStruct()

      expect(TransactionService.isVote(transaction)).toBe(false)
    })

    it('should return false if transaction is bridgechain registration (type 3)', () => {
      const transaction = new MagistrateCrypto.Builders
        .BridgechainRegistrationBuilder()
        .bridgechainRegistrationAsset({
          name: 'test_bridgechain',
          seedNodes: [
            '1.1.1.1',
            '2.2.2.2',
            '3.3.3.3',
            '4.4.4.4'
          ],
          ports: {
            '@arkecosystem/core-api': 4003
          },
          genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
          bridgechainRepository: 'https://github.com/arkecosystem/core.git'
        })
        .fee(1)
        .sign(senderPassphrase)
        .getStruct()

      expect(TransactionService.isVote(transaction)).toBe(false)
    })
  })
})
