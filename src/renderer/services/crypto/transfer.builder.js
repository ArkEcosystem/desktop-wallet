import { Transactions } from '@arkecosystem/crypto'
import { TRANSACTION_TYPES } from '@config'
import store from '@/store'
import { CryptoUtils } from './utils'
import { TransactionSigner } from './transaction-signer'

export class TransferBuilder {
  static async build (
    {
      address,
      amount,
      fee,
      recipientId,
      vendorField,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      networkId,
      multiSignature,
      nonce
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    const staticFee = store.getters['transaction/staticFee'](
      TRANSACTION_TYPES.GROUP_1.TRANSFER,
      1
    )
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(
               `Transfer fee should be smaller than ${staticFee}`
      )
    }

    const transaction = Transactions.BuilderFactory.transfer()
      .amount(amount || 0)
      .fee(fee)
      .recipientId(recipientId)
      .vendorField(vendorField)

    passphrase = CryptoUtils.normalizePassphrase(passphrase)
    secondPassphrase = CryptoUtils.normalizePassphrase(secondPassphrase)

    return TransactionSigner.sign(
      {
        address,
        transaction,
        passphrase,
        secondPassphrase,
        wif,
        networkWif,
        networkId,
        multiSignature,
        nonce
      },
      returnObject
    )
  }
}
