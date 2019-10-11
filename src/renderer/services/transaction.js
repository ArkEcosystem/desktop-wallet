import { TRANSACTION_TYPES } from '@config'
import { Transactions } from '@arkecosystem/crypto'

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

  static needsSignatures (transaction) {
    return !transaction.signatures || transaction.signatures.length < transaction.multiSignature.min
  }

  static needsWalletSignature (transaction, publicKey) {
    if (transaction.type === TRANSACTION_TYPES.GROUP_1.MULTI_SIGNATURE && this.isMultiSignatureReady(transaction, true)) {
      return transaction.senderPublicKey === publicKey
    }

    const index = transaction.multiSignature.publicKeys.indexOf(publicKey)
    if (index === -1) {
      return false
    }

    return !transaction.signatures || !transaction.signatures.some(signature => parseInt(signature.substring(0, 2), 16) === index)
  }

  static needsAllSignatures (transaction) {
    return !transaction.signatures || transaction.signatures.length < transaction.multiSignature.publicKeys.length
  }

  static isMultiSignatureReady (transaction, excludeFinal = false) {
    const isMultiSigRegistration = transaction.type === TRANSACTION_TYPES.GROUP_1.MULTI_SIGNATURE
    if (isMultiSigRegistration && this.needsAllSignatures(transaction)) {
      return false
    } else if (this.needsSignatures(transaction)) {
      return false
    } else if (!excludeFinal && isMultiSigRegistration && !transaction.signature) {
      return false
    }

    return true
  }
}
