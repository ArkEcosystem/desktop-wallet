import { Transactions } from '@arkecosystem/crypto'
import { TRANSACTION_TYPES } from '@config'
import store from '@/store'
import { CryptoUtils } from './utils'
import { TransactionSigner } from './transaction-signer'

export class DelegateRegistrationBuilder {
  static async build (
    {
      address,
      username,
      fee,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      multiSignature,
      nonce
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    const staticFee = store.getters['transaction/staticFee'](
      TRANSACTION_TYPES.GROUP_1.DELEGATE_REGISTRATION,
      1
    )
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(
               `Delegate registration fee should be smaller than ${staticFee}`
      )
    }

    const transaction = Transactions.BuilderFactory.delegateRegistration()
      .usernameAsset(username)
      .fee(fee)

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
        multiSignature,
        nonce
      },
      returnObject
    )
  }
}
