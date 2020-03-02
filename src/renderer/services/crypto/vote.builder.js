import { Transactions } from '@arkecosystem/crypto'
import { TRANSACTION_TYPES } from '@config'
import store from '@/store'
import { CryptoUtils } from './utils'
import { TransactionSigner } from './transaction-signer'

export class VoteBuilder {
  static async build (
    {
      address,
      votes,
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
      TRANSACTION_TYPES.GROUP_1.VOTE,
      1
    )
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(`Vote fee should be smaller than ${staticFee}`)
    }

    const transaction = Transactions.BuilderFactory.vote()
      .votesAsset(votes)
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
