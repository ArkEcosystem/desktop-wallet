import { cloneDeep } from 'lodash'

export class CryptoUtils {
  static transactionFromData (transaction) {
    transaction = cloneDeep(transaction)
    transaction.multiSignature = undefined
    transaction.timestamp = undefined

    return transaction
  }

  /*
   * Normalizes the passphrase by decomposing any characters (if applicable)
   * This is mainly used for the korean language where characters are combined while the passphrase was based on the decomposed consonants
   */
  static normalizePassphrase (passphrase) {
    if (passphrase) {
      return passphrase.normalize('NFD')
    }
  }
}
