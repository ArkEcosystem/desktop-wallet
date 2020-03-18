import { Identities, Transactions } from '@arkecosystem/crypto'
import { dayjs } from '@/services/datetime'
import store from '@/store'
import TransactionService from '@/services/transaction'
import WalletService from '@/services/wallet'
import { CryptoUtils } from './utils'

export class TransactionSigner {
  static async sign (
    {
      transaction,
      passphrase,
      secondPassphrase,
      wif,
      networkWif,
      networkId,
      multiSignature,
      nonce
    },
    returnObject = false
  ) {
    let network
    if (networkId) {
      network = store.getters['network/byId'](networkId)
    }
    if (!network) {
      network = store.getters['session/network']
    }

    transaction = transaction.network(network.version)

    // TODO replace with dayjs
    const epochTime = dayjs(network.constants.epoch)
      .utc()
      .valueOf()
    const now = dayjs().valueOf()
    transaction.data.timestamp = Math.floor((now - epochTime) / 1000)

    if (passphrase) {
      passphrase = CryptoUtils.normalizePassphrase(passphrase)
    }

    if (network.constants.aip11) {
      transaction.version(2).nonce(nonce)
    } else {
      transaction.version(1)
    }

    if (multiSignature) {
      let senderPublicKey = null
      if (passphrase) {
        senderPublicKey = WalletService.getPublicKeyFromPassphrase(
          passphrase
        )
      } else if (wif) {
        senderPublicKey = WalletService.getPublicKeyFromWIF(wif)
      }

      const publicKeyIndex = multiSignature.publicKeys.indexOf(
        senderPublicKey
      )
      transaction.senderPublicKey(senderPublicKey)
      if (publicKeyIndex > -1) {
        if (passphrase) {
          transaction.multiSign(passphrase, publicKeyIndex)
        } else if (wif) {
          transaction.multiSignWithWif(publicKeyIndex, wif, networkWif)
        }
      } else if (
        TransactionService.isMultiSignatureRegistration(transaction.data) &&
        !transaction.data.signatures
      ) {
        transaction.data.signatures = []
      }
    } else {
      if (passphrase) {
        transaction.sign(passphrase)
      } else if (wif) {
        transaction.signWithWif(wif, networkWif)
      }

      if (secondPassphrase) {
        transaction.secondSign(
          CryptoUtils.normalizePassphrase(secondPassphrase)
        )
      }
    }

    if (returnObject) {
      return transaction
    }

    if (multiSignature) {
      if (!transaction.data.senderPublicKey) {
        transaction.senderPublicKey(
          WalletService.getPublicKeyFromMultiSignatureAsset(
            multiSignature
          )
        )
      }
      const transactionJson = transaction.build().toJson()
      transactionJson.multiSignature = multiSignature
      if (!transactionJson.signatures) {
        transactionJson.signatures = []
      }

      return transactionJson
    }

    const response = transaction.build().toJson()
    response.totalAmount = TransactionService.getTotalAmount(response)

    return response
  }

  // todo: why is this async? it doesn't make any use of promises or await
  static async multiSign (
    transaction,
    { multiSignature, networkWif, passphrase, secondPassphrase, wif }
  ) {
    if (!passphrase && !wif) {
      throw new Error('No passphrase or wif provided')
    }

    transaction = CryptoUtils.transactionFromData(transaction)

    const network = store.getters['session/network']
    if (!network.constants.aip11) {
      throw new Error(
        'Multi-Signature Transactions are not supported yet'
      )
    }

    let keys
    if (passphrase) {
      keys = Identities.Keys.fromPassphrase(passphrase)
    } else {
      keys = Identities.Keys.fromWIF(wif, { wif: networkWif })
    }

    const isReady = TransactionService.isMultiSignatureReady(
      {
        ...transaction,
        multiSignature,
        signatures: [...transaction.signatures]
      },
      true
    )

    if (!isReady) {
      const index = multiSignature.publicKeys.indexOf(keys.publicKey)
      if (index >= 0) {
        Transactions.Signer.multiSign(transaction, keys, index)
        transaction.signatures = transaction.signatures.filter(
          (value, index, self) => {
            return self.indexOf(value) === index
          }
        )
      } else {
        throw new Error(
          'passphrase/wif is not used to sign this transaction'
        )
      }
    } else if (
      TransactionService.needsWalletSignature(
        transaction,
        keys.publicKey
      )
    ) {
      Transactions.Signer.sign(transaction, keys)

      if (secondPassphrase) {
        const secondaryKeys = Identities.Keys.fromPassphrase(
          secondPassphrase
        )
        Transactions.Signer.secondSign(transaction, secondaryKeys)
      }

      transaction.id = TransactionService.getId(transaction)
    }

    return {
      ...transaction,
      multiSignature
    }
  }
}
