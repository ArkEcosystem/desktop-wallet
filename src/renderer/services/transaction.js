import { TRANSACTION_TYPES } from '@config'
import { crypto } from '@arkecosystem/crypto'

export default class TransactionService {
  /*
   * Get id for transaction.
   * @param {Object} transaction
   * @return {String}
   */
  static getId (transaction) {
    return crypto.getId(transaction)
  }

  /*
   * Get bytes for transaction.
   * @param {Object} transaction
   * @return {String}
   */
  static getBytes (transaction) {
    return crypto.getBytes(transaction, true, true).toString('hex')
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

    if (transactionObject.data.type === TRANSACTION_TYPES.VOTE) {
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
}
