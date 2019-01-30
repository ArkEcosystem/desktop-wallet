import { cloneDeep } from 'lodash'
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
        expect(wallet).toHaveProperty('isDelegate', false)
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
    let walletsResponse = {
      data: {
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
    const generateAccountResponse = (address) => {
      return {
        data: {
          success: true,
          account: {
            ...wallets.find(wallet => wallet.address === address),
            unconfirmedBalance: 'NO',
            unconfirmedSignature: 'NO',
            secondSignature: 'NO',
            multisignatures: 'NO',
            u_multisignatures: 'NO'
          }
        }
      }
    }
    const generateWalletResponse = (address) => {
      return {
        data: {
          data: {
            ...wallets.find(wallet => wallet.address === address),
            isDelegate: true,
            username: 'test'
          }
        }
      }
    }

    let getAccountEndpoint = jest.fn(generateAccountResponse)
    let getWalletEndpoint = jest.fn(generateWalletResponse)
    let searchWalletEndpoint = jest.fn(() => walletsResponse)
    beforeEach(() => {
      const resource = resource => {
        if (resource === 'accounts') {
          return {
            get: getAccountEndpoint
          }
        } else if (resource === 'wallets') {
          return {
            get: getWalletEndpoint,
            search: searchWalletEndpoint
          }
        }
      }

      client.client.resource = jest.fn(resource)
    })

    describe('when version is 1', () => {
      beforeEach(() => {
        client.version = 1
      })

      it('should call the accounts endpoint as a fallback', async () => {
        const walletAddresses = ['address1', 'address2']
        const fetchedWallets = await client.fetchWallets(walletAddresses)
        expect(client.client.resource).toHaveBeenNthCalledWith(1, 'accounts')
        expect(client.client.resource).toHaveBeenNthCalledWith(2, 'accounts')
        expect(getAccountEndpoint).toHaveBeenNthCalledWith(1, walletAddresses[0])
        expect(getAccountEndpoint).toHaveBeenNthCalledWith(2, walletAddresses[1])
        expect(fetchedWallets).toEqual([
          { ...wallets[0], balance: +wallets[0].balance, isDelegate: false },
          { ...wallets[1], balance: +wallets[1].balance, isDelegate: false }
        ])
      })
    })

    describe('when version is 2', () => {
      beforeEach(() => {
        client.version = 2
      })

      it('should call the wallets endpoint as a fallback if multi-wallets endpoint unavailable', async () => {
        const walletAddresses = ['address1', 'address2']
        const fetchedWallets = await client.fetchWallets(walletAddresses)
        expect(client.client.resource).toHaveBeenNthCalledWith(1, 'wallets')
        expect(client.client.resource).toHaveBeenNthCalledWith(2, 'wallets')
        expect(getWalletEndpoint).toHaveBeenNthCalledWith(1, walletAddresses[0])
        expect(getWalletEndpoint).toHaveBeenNthCalledWith(2, walletAddresses[1])
        expect(fetchedWallets).toEqual([
          generateWalletResponse('address1').data.data,
          generateWalletResponse('address2').data.data
        ].map(wallet => ({ ...wallet, balance: +wallet.balance })))
      })

      it('should call the search endpoint if multi-wallets endpoint available', async () => {
        client.hasMultiWalletSearch = true
        const walletAddresses = ['address1', 'address2']
        const fetchedWallets = await client.fetchWallets(walletAddresses)
        expect(client.client.resource).toHaveBeenNthCalledWith(1, 'wallets')
        expect(searchWalletEndpoint).toHaveBeenNthCalledWith(1, { addresses: walletAddresses })
        expect(fetchedWallets).toEqual(walletsResponse.data.data)
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

  describe('fetchStaticFees', () => {
    describe('when version is 1', () => {
      const data = fixtures.staticFeeResponses.v1.fees

      beforeEach(() => {
        client.version = 1

        const resource = resource => {
          if (resource === 'blocks') {
            return {
              fees: () => ({ data: fixtures.staticFeeResponses.v1 })
            }
          }
        }

        client.client.resource = resource
      })

      it('should return and match fees to types', async () => {
        const response = await client.fetchStaticFees()

        expect(response[0]).toEqual(data.send)
        expect(response[1]).toEqual(data.secondsignature)
        expect(response[2]).toEqual(data.delegate)
        expect(response[3]).toEqual(data.vote)
        expect(response[4]).toEqual(data.multisignature)
      })
    })

    describe('when version is 2', () => {
      const data = fixtures.staticFeeResponses.v2.data

      beforeEach(() => {
        client.version = 2

        const resource = resource => {
          if (resource === 'transactions') {
            return {
              fees: () => ({ data: fixtures.staticFeeResponses.v2 })
            }
          }
        }

        client.client.resource = resource
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
          expect(transaction).toHaveProperty('timestamp', new Date(data[i].timestamp.human).getTime())
          expect(transaction).toHaveProperty('isSender')
          expect(transaction).toHaveProperty('isRecipient')
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
  })

  describe('fetchTransactionsForWallets', () => {
    const { meta } = fixtures.transactions

    describe('when version in v1', () => {
      let getTransactionsEndpoint
      let transactions
      beforeEach(() => {
        client.version = 1

        transactions = cloneDeep(fixtures.transactions.v1)
        getTransactionsEndpoint = jest.fn(() => {
          return {
            data: {
              transactions, success: true, count: meta.count.toString()
            }
          }
        })

        const resource = resource => {
          if (resource === 'transactions') {
            return {
              all: getTransactionsEndpoint
            }
          }
        }

        client.client.resource = jest.fn(resource)
      })

      it('should call the v1 endpoint as a fallback', async () => {
        const walletAddresses = ['address1', 'address2']
        const fetchedWallets = await client.fetchTransactionsForWallets(walletAddresses)
        expect(client.client.resource).toHaveBeenNthCalledWith(1, 'transactions')
        expect(client.client.resource).toHaveBeenNthCalledWith(2, 'transactions')
        expect(getTransactionsEndpoint).toHaveBeenCalledTimes(2)
        expect(fetchedWallets).toEqual(
          ['address1', 'address2'].reduce((map, address, index) => {
            map[address] = transactions

            return map
          }, {})
        )
      })
    })

    describe('when version in v2', () => {
      let getTransactionsEndpoint
      let searchTransactionsEndpoint
      let transactions
      beforeEach(() => {
        client.version = 2

        transactions = cloneDeep(fixtures.transactions.v2)
        searchTransactionsEndpoint = jest.fn(() => ({ data: { data: transactions } }))
        getTransactionsEndpoint = jest.fn(() => {
          return {
            data: {
              data: transactions,
              meta: {
                totalCount: meta.count
              }
            }
          }
        })

        const resource = resource => {
          if (resource === 'wallets') {
            return {
              transactions: getTransactionsEndpoint
            }
          } else if (resource === 'transactions') {
            return {
              search: searchTransactionsEndpoint
            }
          }
        }

        client.client.resource = jest.fn(resource)
      })

      it('should call the transactions endpoint as a fallback if multi-wallets endpoint unavailable', async () => {
        const walletAddresses = ['address1', 'address2']
        const fetchedWallets = await client.fetchTransactionsForWallets(walletAddresses)
        expect(client.client.resource).toHaveBeenNthCalledWith(1, 'wallets')
        expect(client.client.resource).toHaveBeenNthCalledWith(2, 'wallets')
        expect(getTransactionsEndpoint).toHaveBeenCalledTimes(2)
        expect(fetchedWallets).toEqual(['address1', 'address2'].reduce((map, address, index) => {
          map[address] = transactions

          return map
        }, {}))
      })

      it('should call the search endpoint if multi-wallets endpoint available', async () => {
        client.hasMultiWalletSearch = true
        const walletAddresses = ['address1', 'address2']
        const fetchedWallets = await client.fetchTransactionsForWallets(walletAddresses)
        expect(client.client.resource).toHaveBeenNthCalledWith(1, 'transactions')
        expect(searchTransactionsEndpoint).toHaveBeenNthCalledWith(1, { addresses: walletAddresses })
        expect(fetchedWallets).toEqual(['address1', 'address2'].reduce((map, address, index) => {
          map[address] = transactions.filter(transaction => {
            return [transaction.sender, transaction.recipient].includes(address)
          })

          return map
        }, {}))
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
        const fee = V1.fees[2] + 0.01
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
