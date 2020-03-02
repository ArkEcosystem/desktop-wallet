import { Transactions } from '@arkecosystem/crypto'
import { TRANSACTION_TYPES } from '@config'
import store from '@/store'
import { CryptoUtils } from './utils'
import { TransactionSigner } from './transaction-signer'

export class MultiSignatureBuilder {
  static async build (
    {
      address,
      publicKeys,
      minKeys,
      fee,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      nonce
    },
    isAdvancedFee = false,
    returnObject = false
  ) {
    if (!store.getters['session/network'].constants.aip11) {
      throw new Error('AIP-11 transaction not supported on network')
    }

    const staticFee = store.getters['transaction/staticFee'](
      TRANSACTION_TYPES.GROUP_1.MULTI_SIGNATURE,
      1
    )
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(
               `Multi-Signature fee should be smaller than ${staticFee}`
      )
    }

    const transaction = Transactions.BuilderFactory.multiSignature()
      .multiSignatureAsset({
        min: +minKeys,
        publicKeys
      })
      .fee(fee)

    passphrase = CryptoUtils.normalizePassphrase(passphrase)
    secondPassphrase = CryptoUtils.normalizePassphrase(secondPassphrase)

    const transactionObject = await TransactionSigner.sign(
      {
        address,
        transaction,
        passphrase,
        secondPassphrase,
        wif,
        networkWif,
        multiSignature: transaction.data.asset.multiSignature,
        nonce
      },
      true
    )

    return returnObject
      ? transactionObject
      : transactionObject.getStruct()
  }
}
