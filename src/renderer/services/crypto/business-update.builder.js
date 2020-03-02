import * as MagistrateCrypto from '@arkecosystem/core-magistrate-crypto'
import { TRANSACTION_TYPES } from '@config'
import store from '@/store'
import { CryptoUtils } from './utils'
import { TransactionSigner } from './transaction-signer'

export class BusinessUpdateBuilder {
  static async build (
    {
      address,
      fee,
      asset,
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
    if (!store.getters['session/network'].constants.aip11) {
      throw new Error('AIP-11 transaction not supported on network')
    }

    const staticFee = store.getters['transaction/staticFee'](
      TRANSACTION_TYPES.GROUP_2.BUSINESS_UPDATE,
      2
    )
    if (!isAdvancedFee && fee.gt(staticFee)) {
      throw new Error(
               `Business Update fee should be smaller than ${staticFee}`
      )
    }

    const businessAsset = {
      name: asset.name,
      website: asset.website
    }

    if (asset.vat && asset.vat.length) {
      businessAsset.vat = asset.vat
    }

    if (asset.repository && asset.repository.length) {
      businessAsset.repository = asset.repository
    }

    const transaction = new MagistrateCrypto.Builders.BusinessUpdateBuilder()
      .businessUpdateAsset(businessAsset)
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
