import { cloneDeep } from 'lodash'
import nock from 'nock'
import errorCapturer from '../__utils__/error-capturer'
import { V1 } from '@config'
import fixtures from '../__fixtures__/services/client'
import ClientService from '@/services/client'

jest.mock('@/store', () => ({
  getters: {
    'session/network': {
      constants: {
        epoch: '2017-03-21T13:00:00.000Z'
      }
    },
    'delegate/byAddress': (address) => {
      if (address === 'DTRdbaUW3RQQSL5By4G43JVaeHiqfVp9oh') {
        return {
          username: 'test',
          address,
          publicKey: '034da006f958beba78ec54443df4a3f52237253f7ae8cbdb17dccf3feaa57f3126'
        }
      }
    },
    'transaction/staticFee': (type) => {
      const fees = [
        0.1 * 1e8,
        5 * 1e8,
        25 * 1e8,
        1 * 1e8
      ]

      return fees[type]
    }
  },
  watch: jest.fn()
}))

beforeEach(() => {
  nock.cleanAll()
  nock('http://127.0.0.1')
    .persist()
    .post('/api/v2/wallets/search')
    .reply(200, { data: [] })
})

describe('Services > Client', () => {
  let client

  beforeEach(() => {
    client = new ClientService()
    client.host = `http://127.0.0.1:4003`
  })

  describe('constructor', () => {
    it('should use version 2 the capabilities of the API', () => {
      expect(client.__capabilities).toEqual('2.0.0')
    })
  })

  describe('fetchWallet', () => {
    const data = {
      address: 'address',
      balance: '1202',
      publicKey: 'public key'
    }
    let wallet = {
      body: {
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

      client.client.api = resource
    })

    describe('when version is 2', () => {
      it('should return almost all properties from the wallet endpoint', async () => {
        const wallet = await client.fetchWallet('address')
        expect(wallet).toHaveProperty('address', data.address)
        expect(wallet).toHaveProperty('balance', parseInt(data.balance))
        expect(wallet).toHaveProperty('publicKey', data.publicKey)
        expect(wallet).toHaveProperty('isDelegate', true)
      })
    })
  })

  describe('fetchWallets', () => {
    const wallets = [
      {
        address: 'address1',
        balance: '1202',
        publicKey: 'public key'
      },
      {
        address: 'address2',
        balance: '300',
        publicKey: 'public key'
      }
    ]
    const walletAddresses = ['address1', 'address2']
    let walletsResponse = {
      body: {
        data: [
          {
            ...wallets[0],
            isDelegate: true,
            username: 'test'
          },
          {
            ...wallets[1],
            isDelegate: false,
            username: null
          }
        ]
      }
    }
    const generateWalletResponse = (address) => {
      return {
        body: {
          data: {
            ...wallets.find(wallet => wallet.address === address),
            isDelegate: true,
            username: 'test'
          }
        }
      }
    }

    let getWalletEndpoint = jest.fn(generateWalletResponse)
    let searchWalletEndpoint = jest.fn(() => walletsResponse)
    beforeEach(() => {
      const resource = resource => {
        if (resource === 'wallets') {
          return {
            get: getWalletEndpoint,
            search: searchWalletEndpoint
          }
        }
      }

      client.client.api = jest.fn(resource)
    })

    describe('when version capabilities are at least 2.1.0', () => {
      beforeEach(() => {
        client.__capabilities = '2.1.0'
      })

      it('should call the wallet search endpoint', async () => {
        const fetchedWallets = await client.fetchWallets(walletAddresses)

        expect(client.client.api).toHaveBeenNthCalledWith(1, 'wallets')
        expect(searchWalletEndpoint).toHaveBeenNthCalledWith(1, { addresses: walletAddresses })
        expect(fetchedWallets).toEqual(walletsResponse.body.data)
      })
    })

    describe('when version capabilities are not at least 2.1.0', () => {
      beforeEach(() => {
        client.__capabilities = '2.0.9'
      })

      it('should call the wallet endpoint for each wallet', async () => {
        const fetchedWallets = await client.fetchWallets(walletAddresses)

        expect(client.client.api).toHaveBeenNthCalledWith(1, 'wallets')
        expect(client.client.api).toHaveBeenNthCalledWith(2, 'wallets')
        expect(getWalletEndpoint).toHaveBeenNthCalledWith(1, walletAddresses[0])
        expect(getWalletEndpoint).toHaveBeenNthCalledWith(2, walletAddresses[1])
        expect(fetchedWallets).toEqual([
          generateWalletResponse('address1').body.data,
          generateWalletResponse('address2').body.data
        ].map(wallet => ({ ...wallet, balance: +wallet.balance })))
      })
    })
  })

  describe('fetchWalletVote', () => {
    const publicKey = 'public key'

    const transactions = [{
      asset: {
        votes: ['+' + publicKey]
      }
    }]

    beforeEach(() => {
      const resource = resource => {
        if (resource === 'wallets') {
          return {
            votes: () => ({ body: { data: transactions } })
          }
        }
      }

      client.client.api = resource
    })

    it('should return delegate public key', async () => {
      const response = await client.fetchWalletVote()
      expect(response).toBe(publicKey)
    })
  })

  describe('fetchDelegates', () => {
    const { data, meta } = fixtures.delegates

    const delegates = fixtures.delegates.v2

    beforeEach(() => {
      const resource = resource => {
        if (resource === 'delegates') {
          return {
            all: () => ({ body: { data: delegates, meta } })
          }
        }
      }

      client.client.api = resource
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
      })
    })
  })

  describe('fetchStaticFees', () => {
    const data = fixtures.staticFeeResponses.v2.data

    beforeEach(() => {
      const resource = resource => {
        if (resource === 'transactions') {
          return {
            fees: () => ({ body: fixtures.staticFeeResponses.v2 })
          }
        }
      }

      client.client.api = resource
    })

    it('should return and match fees to types', async () => {
      const response = await client.fetchStaticFees()

      expect(response[0]).toEqual(data.transfer)
      expect(response[1]).toEqual(data.secondSignature)
      expect(response[2]).toEqual(data.delegateRegistration)
      expect(response[3]).toEqual(data.vote)
      expect(response[4]).toEqual(data.multiSignature)
      expect(response[5]).toEqual(data.ipfs)
      expect(response[6]).toEqual(data.timelockTransfer)
      expect(response[7]).toEqual(data.multiPayment)
      expect(response[8]).toEqual(data.delegateResignation)
    })
  })

  describe('fetchDelegateForged', () => {
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
            forged: () => ({ body: { forged: 200, success: true } })
          }
        }
      }

      client.client.api = resource
    })

    it('should return the forged property from the given delegate', async () => {
      const forged = await client.fetchDelegateForged(delegateV2)
      expect(forged).toEqual(100)
    })
  })

  describe('fetchTransactions', () => {
    const { data, meta } = fixtures.transactions

    beforeEach(() => {
      const transactions = cloneDeep(fixtures.transactions.v2)
      const resource = resource => {
        if (resource === 'transactions') {
          return {
            all: () => ({ body: { data: transactions, meta: { totalCount: meta.count } } })
          }
        }
      }

      client.client.api = resource
    })

    it('should return only some properties for each transaction', async () => {
      const response = await client.fetchTransactions()
      expect(response).toHaveProperty('transactions')
      expect(response).toHaveProperty('totalCount', meta.count)

      const transactions = response.transactions
      expect(transactions).toHaveLength(data.length)

      transactions.forEach((transaction, i) => {
        expect(transaction).toHaveProperty('timestamp', data[i].timestamp.unix * 1000)
        expect(transaction).toHaveProperty('sender')
        expect(transaction).toHaveProperty('recipient')
        expect(transaction).not.toHaveProperty('totalAmount')
        expect(transaction).not.toHaveProperty('senderId')
        expect(transaction).not.toHaveProperty('recipientId')
        expect(transaction).not.toHaveProperty('isSender')
        expect(transaction).not.toHaveProperty('isRecipient')
      })
    })
  })

  describe('fetchWalletTransactions', () => {
    const { data, meta } = fixtures.transactions

    beforeEach(() => {
      const transactions = cloneDeep(fixtures.transactions.v2)
      const resource = resource => {
        if (resource === 'wallets') {
          return {
            transactions: () => ({ body: { data: transactions, meta: { totalCount: meta.count } } })
          }
        }
      }

      client.client.api = resource
    })

    it('should return only some properties for each transaction', async () => {
      const response = await client.fetchWalletTransactions('address')
      expect(response).toHaveProperty('transactions')
      expect(response).toHaveProperty('totalCount', meta.count)

      const transactions = response.transactions
      expect(transactions).toHaveLength(data.length)

      transactions.forEach((transaction, i) => {
        expect(transaction).toHaveProperty('totalAmount', data[i].amount + data[i].fee)
        expect(transaction).toHaveProperty('timestamp', data[i].timestamp.unix * 1000)
        expect(transaction).toHaveProperty('isSender')
        expect(transaction).toHaveProperty('isRecipient')
        expect(transaction).toHaveProperty('sender')
        expect(transaction).toHaveProperty('recipient')
        expect(transaction).not.toHaveProperty('senderId')
        expect(transaction).not.toHaveProperty('recipientId')
      })
    })
  })

  describe('fetchTransactionsForWallets', () => {
    const { meta } = fixtures.transactions
    const walletAddresses = ['address1', 'address2']
    let transactions
    let getTransactionsEndpoint
    let searchTransactionsEndpoint
    let walletTransactions

    describe('when version capabilities are at least 2.1.0', () => {
      beforeEach(() => {
        client.__capabilities = '2.1.0'

        transactions = cloneDeep(fixtures.transactions.v2)
        searchTransactionsEndpoint = jest.fn(() => ({ body: { data: transactions } }))

        const resource = resource => {
          if (resource === 'transactions') {
            return {
              search: searchTransactionsEndpoint
            }
          }
        }

        client.client.api = jest.fn(resource)
      })

      it('should call the transaction search endpoint', async () => {
        walletTransactions = walletAddresses.reduce((all, address) => {
          all[address] = transactions.filter(transaction => {
            return [transaction.sender, transaction.recipient].includes(address)
          })
          return all
        }, {})

        const fetchedWallets = await client.fetchTransactionsForWallets(walletAddresses)

        expect(client.client.api).toHaveBeenNthCalledWith(1, 'transactions')
        expect(searchTransactionsEndpoint).toHaveBeenNthCalledWith(1, { addresses: walletAddresses })
        expect(fetchedWallets).toEqual(walletTransactions)
      })
    })

    describe('when version capabilities are not at least 2.1.0', () => {
      beforeEach(() => {
        client.__capabilities = '2.0.9'

        transactions = cloneDeep(fixtures.transactions.v2)
        getTransactionsEndpoint = jest.fn(() => {
          return {
            body: {
              data: transactions,
              meta: {
                totalCount: meta.count
              }
            }
          }
        })

        walletTransactions = walletAddresses.reduce((all, address) => {
          all[address] = transactions
          return all
        }, {})

        const resource = resource => {
          if (resource === 'wallets') {
            return {
              transactions: getTransactionsEndpoint
            }
          }
        }

        client.client.api = jest.fn(resource)
      })

      it('should call the wallet transactions endpoint for each wallet', async () => {
        const fetchedWallets = await client.fetchTransactionsForWallets(walletAddresses)

        expect(client.client.api).toHaveBeenNthCalledWith(1, 'wallets')
        expect(client.client.api).toHaveBeenNthCalledWith(2, 'wallets')
        expect(getTransactionsEndpoint).toHaveBeenCalledTimes(2)
        expect(fetchedWallets).toEqual(walletTransactions)
      })
    })
  })

  describe('buildDelegateRegistration', () => {
    describe('when the fee is bigger than V1 fee', () => {
      it('should throw an Error', async () => {
        const fee = V1.fees[2] + 0.1
        expect(await errorCapturer(client.buildDelegateRegistration({ fee }))).toThrow(/fee/)
      })
    })

    describe('when the fee is smaller or equal to V1 fee (25)', () => {
      it('should not throw an Error', async () => {
        expect(await errorCapturer(client.buildDelegateRegistration({ fee: 25 * 1e8 }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildDelegateRegistration({ fee: 12.09 * 1e8 }))).not.toThrow(/fee/)
      })
    })
  })

  describe('buildSecondSignatureRegistration', () => {
    describe('when the fee is bigger than V1 fee', () => {
      it('should throw an Error', async () => {
        const fee = V1.fees[1] + 0.01
        expect(await errorCapturer(client.buildSecondSignatureRegistration({ fee }))).toThrow(/fee/)
      })
    })

    describe('when the fee is smaller or equal to V1 fee (5)', () => {
      it('should not throw an Error', async () => {
        expect(await errorCapturer(client.buildSecondSignatureRegistration({ fee: 5 * 1e8 }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildSecondSignatureRegistration({ fee: 3.09 * 1e8 }))).not.toThrow(/fee/)
      })
    })
  })

  describe('buildTransfer', () => {
    describe('when the fee is bigger than V1 fee', () => {
      it('should throw an Error', async () => {
        const fee = V1.fees[0] + 0.00001
        expect(await errorCapturer(client.buildTransfer({ fee }))).toThrow(/fee/)
      })
    })

    describe('when the fee is smaller or equal to V1 fee (0.1)', () => {
      it('should not throw an Error', async () => {
        expect(await errorCapturer(client.buildTransfer({ fee: 0.1 * 1e8 }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildTransfer({ fee: 0.09 * 1e8 }))).not.toThrow(/fee/)
      })
    })
  })

  describe('buildVote', () => {
    describe('when the fee is bigger than V1 fee', () => {
      it('should throw an Error', async () => {
        const fee = V1.fees[3] + 0.0000001
        expect(await errorCapturer(client.buildVote({ fee }))).toThrow(/fee/)
      })
    })

    describe('when the fee is smaller or equal to V1 fee (0.1)', () => {
      it('should not throw an Error', async () => {
        expect(await errorCapturer(client.buildVote({ fee: 1 * 1e8 }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildVote({ fee: 0.9 * 1e8 }))).not.toThrow(/fee/)
      })
    })
  })
})
