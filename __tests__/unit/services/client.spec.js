import { cloneDeep } from 'lodash'
import errorCapturer from '../__utils__/error-capturer'
import fixtures from '../__fixtures__/services/client'
import ClientService from '@/services/client'

jest.mock('@/store', () => ({
  getters: {
    'session/network': {
      constants: {
        epoch: '2017-03-21T13:00:00.000Z'
      }
    }
  },
  watch: jest.fn()
}))

describe('Services > Client', () => {
  let client

  beforeEach(() => {
    client = new ClientService()
  })

  describe('set version', () => {
    it('should establish the API client version', () => {
      expect(client.version).toEqual(null)
      client.version = 2
      expect(client.version).toEqual(2)
    })

    xit('should establish `API-Version` HTTP header of the API client', () => {
    })
  })

  describe('fetchWallet', () => {
    const data = {
      address: 'address',
      balance: '1202',
      publicKey: 'public key'
    }
    let wallet = {
      data: {
        data: {
          ...data,
          isDelegate: true,
          username: 'test'
        }
      }
    }
    let account = {
      data: {
        success: true,
        account: {
          ...data,
          unconfirmedBalance: 'NO',
          unconfirmedSignature: 'NO',
          secondSignature: 'NO',
          multisignatures: 'NO',
          u_multisignatures: 'NO'
        }
      }
    }

    beforeEach(() => {
      const resource = resource => {
        if (resource === 'accounts') {
          return {
            get: () => account
          }
        } else if (resource === 'wallets') {
          return {
            get: () => wallet
          }
        }
      }

      client.client.resource = resource
    })

    describe('when version is 1', () => {
      beforeEach(() => {
        client.version = 1
      })

      it('should return only some properties from the account endpoint', async () => {
        const wallet = await client.fetchWallet('address')
        expect(wallet).toHaveProperty('address', data.address)
        expect(wallet).toHaveProperty('balance', parseInt(data.balance))
        expect(wallet).toHaveProperty('publicKey', data.publicKey)
        expect(wallet).toHaveProperty('isDelegate', true)
        expect(wallet).not.toHaveProperty('unconfirmedBalance')
        expect(wallet).not.toHaveProperty('unconfirmedSignature')
        expect(wallet).not.toHaveProperty('secondSignature')
        expect(wallet).not.toHaveProperty('multisignatures')
        expect(wallet).not.toHaveProperty('u_multisignatures')
      })
    })

    describe('when version is 2', () => {
      beforeEach(() => {
        client.version = 2
      })

      it('should return almost all properties from the wallet endpoint', async () => {
        const wallet = await client.fetchWallet('address')
        expect(wallet).toHaveProperty('address', data.address)
        expect(wallet).toHaveProperty('balance', parseInt(data.balance))
        expect(wallet).toHaveProperty('publicKey', data.publicKey)
        expect(wallet).toHaveProperty('isDelegate', true)
      })
    })
  })

  describe('fetchWalletVote', () => {
    const publicKey = 'public key'

    describe('when version is 1', () => {
      const delegates = [{
        publicKey
      }]

      beforeEach(() => {
        client.version = 1

        const resource = resource => {
          if (resource === 'accounts') {
            return {
              delegates: () => ({ data: { delegates, success: true } })
            }
          }
        }

        client.client.resource = resource
      })

      it('should return delegate public key', async () => {
        const response = await client.fetchWalletVote()
        expect(response).toBe(publicKey)
      })
    })

    describe('when version is 2', () => {
      const transactions = [{
        asset: {
          votes: ['+' + publicKey]
        }
      }]

      beforeEach(() => {
        client.version = 2

        const resource = resource => {
          if (resource === 'wallets') {
            return {
              votes: () => ({ data: { data: transactions } })
            }
          }
        }

        client.client.resource = resource
      })

      it('should return delegate public key', async () => {
        const response = await client.fetchWalletVote()
        expect(response).toBe(publicKey)
      })
    })
  })

  describe('fetchDelegates', () => {
    const { data, meta } = fixtures.delegates

    describe('when version is 1', () => {
      const delegates = fixtures.delegates.v1

      beforeEach(() => {
        client.version = 1

        const resource = resource => {
          if (resource === 'delegates') {
            return {
              all: () => ({ data: { delegates, success: true, totalCount: meta.totalCount } })
            }
          }
        }

        client.client.resource = resource
      })

      it('should return only some properties for each delegate', async () => {
        const response = await client.fetchDelegates()
        expect(response).toHaveProperty('delegates')
        expect(response).toHaveProperty('totalCount', meta.totalCount)

        const delegates = response.delegates
        expect(delegates).toHaveLength(data.length)
        delegates.forEach((delegate, i) => {
          expect(delegate).toHaveProperty('rank', data[i].rank)
          expect(delegate).toHaveProperty('username', data[i].username)
          expect(delegate).toHaveProperty('production.approval', data[i].approval)
          expect(delegate).toHaveProperty('production.productivity', data[i].productivity)
        })
      })
    })

    describe('when version is 2', () => {
      const delegates = fixtures.delegates.v2

      beforeEach(() => {
        client.version = 2

        const resource = resource => {
          if (resource === 'delegates') {
            return {
              all: () => ({ data: { data: delegates, meta } })
            }
          }
        }

        client.client.resource = resource
      })

      it('should return all properties for each delegate', async () => {
        const response = await client.fetchDelegates()
        expect(response).toHaveProperty('delegates')
        expect(response).toHaveProperty('totalCount', meta.totalCount)

        const delegates = response.delegates
        expect(delegates).toHaveLength(data.length)
        delegates.forEach((delegate, i) => {
          expect(delegate).toHaveProperty('rank', data[i].rank)
          expect(delegate).toHaveProperty('username', data[i].username)
          expect(delegate).toHaveProperty('production.approval', data[i].approval)
          expect(delegate).toHaveProperty('production.productivity', data[i].productivity)
        })
      })
    })
  })

  describe('fetchDelegateForged', () => {
    const delegateV1 = {
      publicKey: 'dummyKey'
    }

    const delegateV2 = {
      publicKey: 'dummyKey',
      forged: {
        total: 100
      }
    }

    beforeEach(() => {
      const resource = resource => {
        if (resource === 'delegates') {
          return {
            forged: () => ({ data: { forged: 200, success: true } })
          }
        }
      }

      client.client.resource = resource
    })

    describe('when version is 1', () => {
      beforeEach(() => {
        client.version = 1
      })

      it('should perform a request to retrieve the forged amount', async () => {
        const forged = await client.fetchDelegateForged(delegateV1)
        expect(forged).toEqual(200)
      })
    })

    describe('when version is 2', () => {
      beforeEach(() => {
        client.version = 2
      })

      it('should return the forged property from the given delegate', async () => {
        const forged = await client.fetchDelegateForged(delegateV2)
        expect(forged).toEqual(100)
      })
    })
  })

  describe('fetchTransactions', () => {
    const { data, meta } = fixtures.transactions

    beforeEach(() => {
      client.version = 2

      const transactions = cloneDeep(fixtures.transactions.v2)
      const resource = resource => {
        if (resource === 'transactions') {
          return {
            all: () => ({ data: { data: transactions, meta: { totalCount: meta.count } } })
          }
        }
      }

      client.client.resource = resource
    })

    it('should return only some properties for each transaction', async () => {
      const response = await client.fetchTransactions()
      expect(response).toHaveProperty('transactions')
      expect(response).toHaveProperty('totalCount', meta.count)

      const transactions = response.transactions
      expect(transactions).toHaveLength(data.length)

      transactions.forEach((transaction, i) => {
        expect(transaction).toHaveProperty('timestamp')
        expect(transaction.timestamp.toJSON()).toBe(data[i].timestamp.human)
        expect(transaction).toHaveProperty('sender')
        expect(transaction).toHaveProperty('recipient')
        expect(transaction).not.toHaveProperty('totalAmount')
        expect(transaction).not.toHaveProperty('senderId')
        expect(transaction).not.toHaveProperty('recipientId')
        expect(transaction).not.toHaveProperty('isSender')
        expect(transaction).not.toHaveProperty('isReceiver')
      })
    })
  })

  describe('fetchWalletTransactions', () => {
    const { data, meta } = fixtures.transactions

    describe('when version in v1', () => {
      beforeEach(() => {
        client.version = 1

        const transactions = cloneDeep(fixtures.transactions.v1)
        const resource = resource => {
          if (resource === 'transactions') {
            return {
              all: () => ({ data: { transactions, success: true, count: meta.count.toString() } })
            }
          }
        }

        client.client.resource = resource
      })

      it('should return only some properties for each transaction', async () => {
        const response = await client.fetchWalletTransactions('address')
        expect(response).toHaveProperty('transactions')
        expect(response).toHaveProperty('totalCount', meta.count)

        const transactions = response.transactions
        expect(transactions).toHaveLength(data.length)

        transactions.forEach((transaction, i) => {
          expect(transaction).toHaveProperty('totalAmount', data[i].amount + data[i].fee)
          expect(transaction).toHaveProperty('timestamp')
          expect(transaction.timestamp.toJSON()).toBe(data[i].timestamp.human)
          expect(transaction).toHaveProperty('isSender')
          expect(transaction).toHaveProperty('isReceiver')
          expect(transaction).toHaveProperty('sender')
          expect(transaction).toHaveProperty('recipient')
          expect(transaction).not.toHaveProperty('senderId')
          expect(transaction).not.toHaveProperty('recipientId')
        })
      })
    })

    describe('when version in v2', () => {
      beforeEach(() => {
        client.version = 2

        const transactions = cloneDeep(fixtures.transactions.v2)
        const resource = resource => {
          if (resource === 'wallets') {
            return {
              transactions: () => ({ data: { data: transactions, meta: { totalCount: meta.count } } })
            }
          }
        }

        client.client.resource = resource
      })

      it('should return only some properties for each transaction', async () => {
        const response = await client.fetchWalletTransactions('address')
        expect(response).toHaveProperty('transactions')
        expect(response).toHaveProperty('totalCount', meta.count)

        const transactions = response.transactions
        expect(transactions).toHaveLength(data.length)

        transactions.forEach((transaction, i) => {
          expect(transaction).toHaveProperty('totalAmount', data[i].amount + data[i].fee)
          expect(transaction).toHaveProperty('timestamp')
          expect(transaction.timestamp.toJSON()).toBe(data[i].timestamp.human)
          expect(transaction).toHaveProperty('isSender')
          expect(transaction).toHaveProperty('isReceiver')
          expect(transaction).toHaveProperty('sender')
          expect(transaction).toHaveProperty('recipient')
          expect(transaction).not.toHaveProperty('senderId')
          expect(transaction).not.toHaveProperty('recipientId')
        })
      })
    })
  })

  describe('buildTransfer', () => {
    describe('when the fee is bigger than 0.1', () => {
      it('should throw an Error', async () => {
        expect(await errorCapturer(client.buildTransfer({ fee: 0.2 * Math.pow(10, 8) }))).toThrow(/fee/)
      })
    })

    describe('when the fee is smaller or equal to 0.1', () => {
      it('should not throw an Error', async () => {
        expect(await errorCapturer(client.buildTransfer({ fee: 0.1 * Math.pow(10, 8) }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildTransfer({ fee: 0.09 * Math.pow(10, 8) }))).not.toThrow(/fee/)
      })
    })
  })
})
