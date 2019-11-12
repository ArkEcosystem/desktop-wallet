import { TRANSACTION_TYPES } from '@config'
import { Crypto, Transactions } from '@arkecosystem/crypto'

export default class TransactionService {
  /*
   * Get id for transaction.
   * @param {Object} transaction
   * @return {String}
   */
  static getId (transaction) {
    return Transactions.Utils.getId(transaction)
  }

  /*
   * Get bytes for transaction.
   * @param {Object} transaction
   * @return {String}
   */
  static getBytes (transaction) {
    return Transactions.Serializer.getBytes(transaction, {
      excludeSignature: true,
      excludeSecondSignature: true
    }).toString('hex')
  }

  /**
   * Get amount for transaction.
   * @param  {Object} vm
   * @param  {Object} transaction
   * @return {String}
   */
  static getAmount (vm, transaction) {
    const amount = vm.currency_toBuilder(transaction.amount)
    if (transaction.asset && transaction.asset.payments) {
      for (const payment of transaction.asset.payments) {
        amount.add(payment.amount)
      }
    }

    return amount.value
  }

  /**
   * Get hash for transaction.
   * @param  {Object}  transaction
   * @param  {Boolean} excludeMultiSignature
   * @return {Buffer}
   */
  static getHash (transaction, excludeMultiSignature = true) {
    return Transactions.Utils.toHash(transaction, {
      excludeSignature: true,
      excludeSecondSignature: true,
      excludeMultiSignature
    })
  }

  /*
   * Get bytes for transaction.
   * @param {Object} wallet
   * @param {Transaction} transactionObject
   * @param {Object} vm
   * @return {Object}
   */
  static async ledgerSign (wallet, transactionObject, vm) {
    transactionObject.senderPublicKey(wallet.publicKey)
    transactionObject.sign('passphrase') // Sign with a "fake" passphrase to get the transaction structure
    const transaction = transactionObject.getStruct()
    transaction.senderPublicKey = wallet.publicKey // Restore original sender public key

    if (transactionObject.data.type === TRANSACTION_TYPES.GROUP_1.VOTE) {
      transaction.recipientId = wallet.address
    }

    const transactionBytes = this.getBytes(transaction)
    transaction.signature = await vm.$store.dispatch('ledger/signTransaction', {
      transactionHex: transactionBytes.toString('hex'),
      accountIndex: wallet.ledgerIndex
    })

    if (!transaction.signature) {
      throw new Error(vm.$t('TRANSACTION.LEDGER_USER_DECLINED'))
    }

    transaction.id = this.getId(transaction)

    return transaction
  }

  static isMultiSignature (transaction) {
    return !!transaction.multiSignature
  }

  static isMultiSignatureRegistration (transaction) {
    return transaction.type === TRANSACTION_TYPES.GROUP_1.MULTI_SIGNATURE
  }

  static needsSignatures (transaction) {
    if (!this.isMultiSignature(transaction)) {
      return false
    }

    if (this.isMultiSignatureRegistration(transaction)) {
      return this.needsAllSignatures(transaction)
    }

    return this.getValidMultiSignatures(transaction).length < transaction.multiSignature.min
  }

  static needsAllSignatures (transaction) {
    return this.getValidMultiSignatures(transaction).length < transaction.multiSignature.publicKeys.length
  }

  static needsWalletSignature (transaction, publicKey) {
    if (this.isMultiSignatureRegistration(transaction) && this.isMultiSignatureReady(transaction, true)) {
      return transaction.senderPublicKey === publicKey && this.needsFinalSignature(transaction)
    }

    if (!this.isMultiSignature(transaction)) {
      return false
    }

    const index = transaction.multiSignature.publicKeys.indexOf(publicKey)
    if (index === -1) {
      return false
    } else if (!transaction.signatures) {
      return true
    }

    const signature = transaction.signatures.find(signature => parseInt(signature.substring(0, 2), 16) === index)
    if (!signature) {
      return true
    }

    return !Crypto.Hash.verifySchnorr(this.getHash(transaction), signature.slice(2, 130), publicKey)
  }

  static isMultiSignatureReady (transaction, excludeFinal = false) {
    if (this.needsSignatures(transaction)) {
      return false
    } else if (!excludeFinal && this.isMultiSignatureRegistration(transaction) && this.needsFinalSignature(transaction)) {
      return false
    }

    return true
  }

  static needsFinalSignature (transaction) {
    if (this.isMultiSignature(transaction) && !this.isMultiSignatureRegistration(transaction)) {
      return false
    }

    return !transaction.signature || !Crypto.Hash.verifySchnorr(this.getHash(transaction, false), transaction.signature, transaction.senderPublicKey)
  }

  static getValidMultiSignatures (transaction) {
    if (!this.isMultiSignature(transaction) || !transaction.signatures || !transaction.signatures.length) {
      return []
    }

    const validSignatures = []
    for (const signature of transaction.signatures) {
      const publicKeyIndex = parseInt(signature.slice(0, 2), 16)
      const partialSignature = signature.slice(2, 130)
      const publicKey = transaction.multiSignature.publicKeys[publicKeyIndex]

      if (Crypto.Hash.verifySchnorr(this.getHash(transaction), partialSignature, publicKey)) {
        validSignatures.push(signature)
      }
    }

    return validSignatures
  }
}
