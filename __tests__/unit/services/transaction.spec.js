import { Crypto, Identities, Managers, Transactions } from '@arkecosystem/crypto'
import TransactionService from '@/services/transaction'
import transactionFixture from '../__fixtures__/models/transaction'

const recipientAddress = Identities.Address.fromPassphrase('recipient passphrase')
const senderPassphrase = 'sender passphrase'
const senderPublicKey = Identities.PublicKey.fromPassphrase(senderPassphrase)

describe('Services > Transaction', () => {
  describe('getId', () => {
    it('should return the transaction id', () => {
      expect(TransactionService.getId(transactionFixture)).toBe(transactionFixture.id)
    })
  })

  describe('getBytes', () => {
    it('should return the transaction bytes', () => {
      expect(TransactionService.getBytes(transactionFixture)).toEqual('00f0eb920302275d8577a0ec2b75fc8683282d53c5db76ebc54514a80c2854e419b793ea259a17ee9f689978490631699e01ca0fc2edbecb5ee0390000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000008096980000000000')
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

  describe('ledgerSign', () => {
    const vmMock = {
      $store: {
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

    it('should sign the transaction', async () => {
      transactionObject.sign(senderPassphrase)
      const transactionJson = transactionObject.getStruct()

      const bytes = TransactionService.getBytes(transactionJson)
      const id = TransactionService.getId(transactionJson)
      const signature = transactionObject.data.signature

      spyDispatch.mockImplementation((key) => {
        if (key === 'ledger/signTransaction') {
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
        if (key === 'ledger/signTransaction') {
          return signature
        }
      })

      const transaction = await TransactionService.ledgerSign(wallet, transactionObject, vmMock)

      expect(transaction.recipientId).toEqual(wallet.address)
    })

    it('should throw error if no signature', async () => {
      await expect(TransactionService.ledgerSign(wallet, transactionObject, vmMock)).rejects.toThrow('TRANSACTION.LEDGER_USER_DECLINED')

      expect(spyTranslate).toHaveBeenCalledWith('TRANSACTION.LEDGER_USER_DECLINED')
    })
  })
})
