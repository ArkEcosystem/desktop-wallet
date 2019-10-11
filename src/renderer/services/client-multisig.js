/* eslint-disable import/no-duplicates */
import got from 'got/source/index'
import gotWallet from 'got'

export default class MultiSignature {
  static async performHandshake ({ host, port }) {
    try {
      // this request should fail because the endpoint does not exist
      await got.get(`${host}:${port}/handshake`)

      return false
    } catch (error) {
      if (error.response && error.response.headers && error.response.headers['x-server-type'] === 'MultiSignature') {
        return true
      }

      console.error('Could not get multi-sig server handshake: ', error)
    }

    return false
  }

  static async sendTransaction ({ host, port }, transaction) {
    try {
      let multiSignature = transaction.multiSignature
      if (transaction.asset && transaction.asset.multiSignature) {
        multiSignature = transaction.asset.multiSignature
      }

      const response = await gotWallet.post(`${host}:${port}/transaction`, {
        body: JSON.stringify({
          data: transaction,
          multisigAsset: multiSignature
        })
      })

      return response
    } catch (error) {
      console.error('Could not post transaction: ', error)
    }

    return false
  }

  static async getTransactions ({ host, port }, publicKey) {
    try {
      const response = await gotWallet.get(`${host}:${port}/transactions`, {
        query: {
          publicKey
        }
      })

      const transactions = JSON.parse(response.body)

      return {
        totalCount: transactions.length,
        transactions: transactions.map(transaction => {
          return {
            ...transaction.data,
            multiSignature: transaction.multisigAsset,
            timestamp: transaction.timestamp
          }
        })
      }
    } catch (error) {
      console.error('Could not post transaction: ', error)
    }

    return {
      totalCount: 0,
      transactions: []
    }
  }
}
