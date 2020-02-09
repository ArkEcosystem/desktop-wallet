import { cloneDeep } from 'lodash'
import nock from 'nock'
import { Identities, Managers, Transactions } from '@arkecosystem/crypto'
import errorCapturer from '../__utils__/error-capturer'
import fixtures from '../__fixtures__/services/client'
import ClientService from '@/services/client'
import BigNumber from '@/plugins/bignumber'
import store from '@/store'
import logger from 'electron-log'
import TransactionService from '@/services/transaction'
import WalletService from '@/services/wallet'

const sessionNetwork = Object.freeze({
  nethash: 'test-nethash',
  constants: {
    epoch: '2017-03-21T13:00:00.000Z',
    aip11: false
  },
  vendorField: {
    maxLength: 64
  }
})

jest.mock('@/store', () => ({
  // __mock__: {

  // },
  getters: {
    'session/profile': {
      id: 'test-profile'
    },
    'session/network': {},
    'network/byId': (id) => {
      let version = 23
      if (id === 'ark.devnet') {
        version = 30
      }

      return {
        constants: {
          epoch: '2017-03-21T13:00:00.000Z'
        },
        version
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
    'transaction/staticFee': (type, group = 1) => {
      const fees = {
        1: [
          0.1 * 1e8, // Transfer
          5 * 1e8, // Second signautre
          25 * 1e8, // Delegate registration
          1 * 1e8, // Vote
          5 * 1e8, // Multisignature
          5 * 1e8, // IPFS
          1 * 1e8, // Multi-payment
          25 * 1e8 // Delegate resignation
        ],
        2: [
          50 * 1e8, // Business Registration
          50 * 1e8, // Business Resignation
          50 * 1e8, // Business Update
          50 * 1e8, // Bridgechain Registration
          50 * 1e8, // Bridgechain Resignation
          50 * 1e8 // Bridgechain Update
        ]
      }

      return fees[group][type]
    },
    'peer/current': () => ({
      ip: '1.1.1.1',
      port: '8080',
      isHttps: false
    }),
    'peer/broadcastPeers': () => [
      {
        ip: '1.1.1.1',
        port: '8080',
        isHttps: false
      },
      {
        ip: '2.2.2.2',
        port: '8080',
        isHttps: false
      }
    ]
  },
  dispatch: jest.fn(),
  watch: jest.fn((getter, callback, options) => {
    // getter()
    // require('@/store').__mock__.watch = {
    //   getter: getter(),
    //   getter: callback(),
    //   options
    // }
  })
}))

const setAip11AndSpy = (enabled = true, spy = true) => {
  const network = {
    ...sessionNetwork,
    constants: {
      ...sessionNetwork.constants,
      aip11: enabled
    }
  }

  Managers.configManager.getMilestone().aip11 = enabled
  store.getters['session/network'] = network

  if (!spy) {
    return
  }

  return jest.spyOn(store.getters, 'network/byId').mockReturnValue(network)
}

beforeEach(() => {
  Managers.configManager.setFromPreset('testnet')
  store.getters['session/network'] = cloneDeep(sessionNetwork)

  nock.cleanAll()
})

describe('Services > Client', () => {
  let client

  const wallets = [
    {
      address: 'address1',
      balance: '1202',
      publicKey: 'public key',
      vote: 'voted delegate'
    },
    {
      address: 'address2',
      balance: '300',
      publicKey: 'public key'
    }
  ]

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

  const getWalletEndpoint = jest.fn(generateWalletResponse)

  const fees = {
    1: [
      0.1 * 1e8, // Transfer
      5 * 1e8, // Second signautre
      25 * 1e8, // Delegate registration
      1 * 1e8, // Vote
      5 * 1e8, // Multisignature
      5 * 1e8, // IPFS
      1 * 1e8, // Multi-payment
      25 * 1e8 // Delegate resignation
    ],
    2: [
      50 * 1e8, // Business Registration
      50 * 1e8, // Business Resignation
      50 * 1e8, // Business Update
      50 * 1e8, // Bridgechain Registration
      50 * 1e8, // Bridgechain Resignation
      50 * 1e8 // Bridgechain Update
    ]
  }

  beforeEach(() => {
    client = new ClientService()
    client.host = 'http://127.0.0.1:4003'
  })

  describe('constructor', () => {
    it('should not watch profile if false', () => {
      const watchProfileOriginal = ClientService.__watchProfile
      ClientService.__watchProfile = jest.fn()

      client = new ClientService(false)

      expect(ClientService.__watchProfile).not.toHaveBeenCalled()
      ClientService.__watchProfile = watchProfileOriginal
    })
  })

  describe('normalizePassphrase', () => {
    it('should normalize if provided', () => {
      const spy = jest.spyOn(String.prototype, 'normalize')

      const passphrase = client.normalizePassphrase('test')

      expect(spy).toHaveBeenNthCalledWith(1, 'NFD')
      expect(passphrase).toBe('test')

      spy.mockRestore()
    })

    it('should not normalize if no passphrase', () => {
      const spy = jest.spyOn(String.prototype, 'normalize')

      client.normalizePassphrase(null)

      expect(spy).not.toHaveBeenCalled()

      spy.mockRestore()
    })
  })

  describe('newConnection', () => {
    it('should create a new connection', () => {
      const connection = ClientService.newConnection('http://localhost')

      expect(connection.host).toBe('http://localhost/api/v2')
    })

    it('should set timeout if provided', () => {
      const connection = ClientService.newConnection('http://localhost', 100)

      expect(connection.opts.timeout).toBe(100)
    })

    it('should use default 5000ms timeout if not provided', () => {
      const connection = ClientService.newConnection('http://localhost')

      expect(connection.opts.timeout).toBe(5000)
    })

    it('should throw error if no server', () => {
      expect(() => ClientService.newConnection(null)).toThrow()
    })
  })

  describe('fetchNetworkConfig', () => {
    const mockEndpoint = (config) => {
      nock('http://127.0.0.1')
        .get('/api/v2/node/configuration')
        .reply(200, {
          data: config
        })
    }

    it('should fetch network config', async () => {
      const networkConfig = {
        nethash: 'nethash'
      }

      mockEndpoint(networkConfig)

      expect(await ClientService.fetchNetworkConfig('http://127.0.0.1')).toEqual(networkConfig)
    })

    it('should update network store', async () => {
      const networkConfig = {
        nethash: 'test-nethash',
        constants: {
          vendorFieldLength: 10
        }
      }

      mockEndpoint(networkConfig)

      await ClientService.fetchNetworkConfig('http://127.0.0.1')
      const spy = jest.spyOn(store, 'dispatch')

      expect(spy).toHaveBeenCalledWith('network/update', {
        ...sessionNetwork,
        vendorField: {
          ...sessionNetwork.vendorField,
          maxLength: 10
        }
      })

      spy.mockRestore()
    })

    it('should not update network store if vendorfield is the same', async () => {
      const networkConfig = {
        nethash: 'test-nethash',
        constants: {
          vendorFieldLength: 64
        }
      }

      mockEndpoint(networkConfig)

      await ClientService.fetchNetworkConfig('http://127.0.0.1')
      const spy = jest.spyOn(store, 'dispatch')

      expect(spy).not.toHaveBeenCalled()

      spy.mockRestore()
    })
  })

  describe('fetchNetworkCrypto', () => {
    it('should fetch data from crypto endpoint', async () => {
      const cryptoConfig = {
        exceptions: {},
        genesisBlock: {},
        milestones: {},
        network: {}
      }

      nock('http://127.0.0.1')
        .get('/api/v2/node/configuration/crypto')
        .reply(200, {
          data: cryptoConfig
        })

      expect(await ClientService.fetchNetworkCrypto('http://127.0.0.1')).toEqual(cryptoConfig)
    })
  })

  describe('fetchFeeStatistics', () => {
    const mockEndpoint = (config) => {
      nock('http://127.0.0.1')
        .get('/api/v2/node/fees')
        .query({ days: 7 })
        .reply(200, {
          data: config
        })
    }

    it('should fetch fees for updated endpoint schema', async () => {
      mockEndpoint({
        1: {
          transfer: {
            avg: '9434054',
            max: '10000000',
            min: '500000',
            sum: '1962283291'
          }
        }
      })

      expect(await ClientService.fetchFeeStatistics('http://127.0.0.1')).toEqual({
        1: [
          {
            type: 0,
            fees: {
              minFee: 500000,
              maxFee: 10000000,
              avgFee: 9434054
            }
          }
        ]
      })
    })

    it('should fetch fees for old endpoint schema', async () => {
      mockEndpoint([
        {
          type: 0,
          avg: '9434054',
          max: '10000000',
          min: '500000',
          sum: '1962283291'
        }
      ])

      expect(await ClientService.fetchFeeStatistics('http://127.0.0.1')).toEqual([
        {
          type: 0,
          fees: {
            minFee: 500000,
            maxFee: 10000000,
            avgFee: 9434054
          }
        }
      ])
    })

    it('should return empty array on error', async () => {
      nock('http://127.0.0.1')
        .get('/api/v2/node/fees')
        .query({ days: 7 })
        .reply(500)

      expect(await ClientService.fetchFeeStatistics('http://127.0.0.1')).toEqual([])
    })
  })

  describe('host getter/setter', () => {
    it('should return formatted host', () => {
      client.host = 'http://6.6.6.6'

      expect(client.host).toEqual('http://6.6.6.6/api/v2')
    })

    it('should update current client', () => {
      client.host = 'http://7.7.7.7'

      expect(client.client.host).toEqual('http://7.7.7.7/api/v2')
    })
  })

  describe('fetchPeerStatus', () => {
    it('should fetch data from syncing endpoint', async () => {
      const response = {
        syncing: false,
        blocks: -7,
        height: 10969757,
        id: 'e1315d04c74bb7edc0a0c902e399eafb2e6cf12c0d36e8ecd692408a14d9dda3'
      }

      nock('http://127.0.0.1:4003')
        .get('/api/v2/node/syncing')
        .reply(200, {
          data: response
        })

      expect(await client.fetchPeerStatus()).toEqual(response)
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

  describe('fetchDelegateVoters', () => {
    it('should fetch data from syncing endpoint', async () => {
      const meta = {
        totalCount: 531
      }

      nock('http://127.0.0.1:4003')
        .get('/api/v2/delegates/USERNAME/voters')
        .reply(200, {
          meta,
          data: {}
        })

      expect(await client.fetchDelegateVoters({ username: 'USERNAME' })).toEqual(meta.totalCount)
    })
  })

  describe('fetchDelegateForged', () => {
    it('should return the forged property from the given delegate', async () => {
      const forged = await client.fetchDelegateForged({
        publicKey: 'dummyKey',
        forged: {
          total: 100
        }
      })

      expect(forged).toEqual(100)
    })

    it('should return 0 if no forged data', async () => {
      const forged = await client.fetchDelegateForged({
        publicKey: 'dummyKey'
      })

      expect(forged).toEqual('0')
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

      expect(response.transfer).toBe(data.transfer)
      expect(response.secondSignature).toBe(data.secondSignature)
      expect(response.delegateRegistration).toBe(data.delegateRegistration)
      expect(response.vote).toBe(data.vote)
      expect(response.multiSignature).toBe(data.multiSignature)
      expect(response.ipfs).toBe(data.ipfs)
      expect(response.multiPayment).toBe(data.multiPayment)
      expect(response.delegateResignation).toBe(data.delegateResignation)
      expect(response.htlcLock).toBe(data.htlcLock)
      expect(response.htlcClaim).toBe(data.htlcClaim)
      expect(response.htlcRefund).toBe(data.htlcRefund)
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

  describe('fetchBusinessBridgechains', () => {
    it('should fetch data from bridgechains endpoint', async () => {
      const response = {
        meta: {
          totalCount: 137
        },
        data: [
          {
            address: 'address-1',
            publicKey: 'publicKey-1',
            name: 'Business Name',
            website: 'http://t-explorer.ark.io',
            isResigned: false
          }
        ]
      }

      nock('http://127.0.0.1:4003')
        .get('/api/v2/businesses/BUSINESS_ID/bridgechains')
        .reply(200, response)

      expect(await client.fetchBusinessBridgechains('BUSINESS_ID')).toEqual(response)
    })
  })

  describe('fetchWalletTransactions', () => {
    const { data, meta } = fixtures.transactions

    beforeEach(() => {
      const transactions = cloneDeep(fixtures.transactions.v2)
      const resource = resource => {
        if (resource === 'wallets') {
          return {
            transactions: (_, queryOptions) => {
              const transactionsResponse = transactions.filter(t => !queryOptions.type || (queryOptions.type && t.type === queryOptions.type))

              return {
                body: {
                  data: transactionsResponse,
                  meta: {
                    totalCount: meta.count
                  }
                }
              }
            }
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
        expect(transaction).toHaveProperty('totalAmount')
        expect(transaction.totalAmount).toBeString()
        expect(transaction.totalAmount).toEqual(new BigNumber(data[i].amount).plus(data[i].fee).toString())
        expect(transaction).toHaveProperty('timestamp', data[i].timestamp.unix * 1000)
        expect(transaction).toHaveProperty('isSender')
        expect(transaction).toHaveProperty('isRecipient')
        expect(transaction).toHaveProperty('sender')
        expect(transaction).toHaveProperty('recipient')
        expect(transaction).not.toHaveProperty('senderId')
        expect(transaction).not.toHaveProperty('recipientId')
      })
    })

    it('should filter transactions by transaction type', async () => {
      const response = await client.fetchWalletTransactions('address', { transactionType: 1 })

      expect(response.transactions.length).toBe(1)
      expect(response.transactions[0].type).toBe(1)
    })
  })

  describe('fetchTransactionsForWallets', () => {
    const walletAddresses = ['address1', 'address2']
    let transactions
    let searchTransactionsEndpoint
    let walletTransactions

    it('should call the transaction search endpoint', async () => {
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

    it('should log error if api fails', async () => {
      const spy = jest.spyOn(logger, 'error').mockImplementation()
      jest.spyOn(client, 'fetchWalletTransactions').mockReturnValue({})

      await client.fetchTransactionsForWallets(['address-1'], null)
      expect(spy).toHaveBeenCalledTimes(1)

      spy.mockRestore()
    })

    it('should fall back to fetchWalletTransactions if search endpoint fails', async () => {
      const spy = jest.spyOn(client, 'fetchWalletTransactions').mockReturnValue({
        transactions: ['test']
      })

      const response = await client.fetchTransactionsForWallets(['address-1'])

      expect(spy).toHaveBeenCalledWith('address-1', {})
      expect(response['address-1']).toEqual(['test'])
    })

    it('should log error for each fetchWalletTransactions failure', async () => {
      const spy = jest.spyOn(logger, 'error').mockImplementation()
      const error = new Error('Wallet not found')
      jest.spyOn(client, 'fetchWalletTransactions').mockImplementation(() => {
        throw error
      })

      const response = await client.fetchTransactionsForWallets(['address-1', 'address-2'])

      expect(spy).toHaveBeenNthCalledWith(2, error)
      expect(response).toEqual({})

      spy.mockRestore()
    })

    it('should throw error on fetchWalletTransactions failure (not "Wallet not found")', async () => {
      const spy = jest.spyOn(logger, 'error').mockImplementation()
      const error = new Error('oops')
      jest.spyOn(client, 'fetchWalletTransactions').mockImplementation(() => {
        throw error
      })

      expect(await errorCapturer(client.fetchTransactionsForWallets(['address-1']))).toThrow('oops')

      spy.mockRestore()
    })
  })

  describe('fetchWallet', () => {
    const data = {
      address: 'address',
      balance: '1202',
      publicKey: 'public key'
    }
    const wallet = {
      body: {
        data: {
          ...data,
          isDelegate: true,
          username: 'test'
        }
      }
    }
    const account = {
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
        expect(wallet).toHaveProperty('balance', data.balance)
        expect(wallet).toHaveProperty('publicKey', data.publicKey)
        expect(wallet).toHaveProperty('isDelegate', true)
      })
    })
  })

  describe('fetchWallets', () => {
    const walletAddresses = ['address1', 'address2']
    const walletsResponse = {
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
    const searchWalletEndpoint = jest.fn(() => walletsResponse)
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

    it('should call the wallet search endpoint', async () => {
      const fetchedWallets = await client.fetchWallets(walletAddresses)

      expect(client.client.api).toHaveBeenNthCalledWith(1, 'wallets')
      expect(searchWalletEndpoint).toHaveBeenNthCalledWith(1, { addresses: walletAddresses })
      expect(fetchedWallets).toEqual(walletsResponse.body.data)
    })
  })

  describe('fetchWalletVote', () => {
    const voteDelegate = 'voted delegate'

    beforeEach(() => {
      const resource = resource => {
        if (resource === 'wallets') {
          return {
            get: generateWalletResponse
          }
        }
      }

      client.client.api = resource
    })

    it('should return delegate public key if wallet is voting', async () => {
      const response = await client.fetchWalletVote('address1')
      expect(response).toBe(voteDelegate)
    })

    it('should return null if wallet is not voting', async () => {
      const response = await client.fetchWalletVote('address2')
      expect(response).toBeNull()
    })

    it('should log error', async () => {
      const spy = jest.spyOn(logger, 'error').mockImplementation()
      const error = new Error('Wallet not found')
      jest.spyOn(client, 'fetchWallet').mockImplementation(() => {
        throw error
      })

      const response = await client.fetchWalletVote('address2')

      expect(spy).toHaveBeenCalledWith(error)
      expect(response).toBe(null)

      spy.mockRestore()
    })

    it('should throw if error is not "Wallet not found"', async () => {
      const spy = jest.spyOn(logger, 'error').mockImplementation()
      const error = new Error('oops')
      jest.spyOn(client, 'fetchWallet').mockImplementation(() => {
        throw error
      })

      expect(await errorCapturer(client.fetchWalletVote('address2'))).toThrow('oops')
      spy.mockRestore()
    })
  })

  describe('fetchWalletVotes', () => {
    const transactions = [{
      asset: {
        votes: ['+test']
      }
    }, {
      asset: {
        votes: ['+test2']
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

    it('should return vote transactions', async () => {
      const response = await client.fetchWalletVotes()
      expect(response).toBe(transactions)
    })
  })

  describe('__parseCurrentPeer', () => {
    it('should parse peer from current host', () => {
      client.host = 'http://1.1.1.1:8080'

      expect(client.__parseCurrentPeer()).toEqual({
        ip: '1.1.1.1',
        port: '8080',
        isHttps: false
      })
    })

    it('should parse https', () => {
      client.host = 'https://1.1.1.1:8080'

      expect(client.__parseCurrentPeer()).toEqual({
        ip: '1.1.1.1',
        port: '8080',
        isHttps: true
      })
    })

    it('should default port if not found', () => {
      client.host = 'http://1.1.1.1'

      expect(client.__parseCurrentPeer()).toEqual({
        ip: '1.1.1.1',
        port: '80',
        isHttps: false
      })

      client.host = 'https://1.1.1.1'

      expect(client.__parseCurrentPeer()).toEqual({
        ip: '1.1.1.1',
        port: '443',
        isHttps: true
      })
    })
  })

  describe('buildVote', () => {
    describe('standard transaction', () => {
      const address = Identities.Address.fromPassphrase('passphrase', 23)
      const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
      const rawTransaction = {
        address,
        votes: [
          `+${publicKey}`
        ],
        fee: new BigNumber(fees[1][3]),
        passphrase: 'passphrase',
        secondPassphrase: 'second passphrase',
        networkWif: 170
      }

      it('should build a valid v1 transaction', async () => {
        Managers.configManager.getMilestone().aip11 = false

        const transaction = await client.buildVote(rawTransaction, true)

        expect(transaction.asset.votes).toEqual(rawTransaction.votes)
        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.recipientId).toEqual(address)
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.type).toEqual(3)
        expect(transaction.version).toEqual(1)
      })

      it('should build a valid v2 transaction', async () => {
        const spy = setAip11AndSpy(true)

        Managers.configManager.getMilestone().aip11 = true

        const transaction = await client.buildVote(rawTransaction, true)

        spy.mockRestore()

        expect(transaction.asset.votes).toEqual(rawTransaction.votes)
        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.type).toEqual(3)
        expect(transaction.version).toEqual(2)
      })
    })

    describe('when the fee is bigger than the static fee', () => {
      it('should throw an Error', async () => {
        const fee = new BigNumber(fees[1][3] + 1)
        expect(await errorCapturer(client.buildVote({ fee }))).toThrow(/fee/)
      })
    })

    describe('when the fee is smaller or equal to the static fee fee (0.1)', () => {
      it('should not throw an Error', async () => {
        expect(await errorCapturer(client.buildVote({ fee: new BigNumber(fees[1][3]) }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildVote({ fee: new BigNumber(fees[1][3] - 1) }))).not.toThrow(/fee/)
      })
    })
  })

  describe('buildDelegateRegistration', () => {
    describe('standard transaction', () => {
      const address = Identities.Address.fromPassphrase('passphrase', 23)
      const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
      const rawTransaction = {
        address,
        username: 'bob',
        fee: new BigNumber(fees[1][2]),
        passphrase: 'passphrase',
        secondPassphrase: 'second passphrase',
        networkWif: 170
      }

      it('should build a valid v1 transaction', async () => {
        setAip11AndSpy(false, false)

        const transaction = await client.buildDelegateRegistration(rawTransaction, true)

        expect(transaction.asset.delegate.username).toEqual(rawTransaction.username)
        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.type).toEqual(2)
        expect(transaction.version).toEqual(1)
      })

      it('should build a valid v2 transaction', async () => {
        const spy = setAip11AndSpy(true)

        const transaction = await client.buildDelegateRegistration(rawTransaction, true)

        spy.mockRestore()

        expect(transaction.asset.delegate.username).toEqual(rawTransaction.username)
        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.type).toEqual(2)
        expect(transaction.version).toEqual(2)
      })
    })

    describe('when the fee is bigger than the static fee', () => {
      it('should throw an Error', async () => {
        const fee = new BigNumber(fees[1][2] + 1)
        expect(await errorCapturer(client.buildDelegateRegistration({ fee }))).toThrow(/fee/)
      })
    })

    describe('when the fee is smaller or equal to the static fee (25)', () => {
      it('should not throw an Error', async () => {
        expect(await errorCapturer(client.buildDelegateRegistration({ fee: new BigNumber(fees[1][2]) }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildDelegateRegistration({ fee: new BigNumber(fees[1][2] - 1) }))).not.toThrow(/fee/)
      })
    })
  })

  describe('buildTransfer', () => {
    describe('standard transaction', () => {
      const address = Identities.Address.fromPassphrase('passphrase', 23)
      const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
      const rawTransaction = {
        address,
        amount: new BigNumber(100 * 1e8),
        fee: new BigNumber(fees[1][0]),
        recipientId: address,
        vendorField: 'this is a test',
        passphrase: 'passphrase',
        secondPassphrase: 'second passphrase',
        networkWif: 170
      }

      it('should build a valid v1 transaction', async () => {
        setAip11AndSpy(false, false)

        const transaction = await client.buildTransfer(rawTransaction, true)

        expect(transaction.vendorField).toEqual(rawTransaction.vendorField)
        expect(transaction.amount).toEqual(rawTransaction.amount.toString())
        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.type).toEqual(0)
        expect(transaction.version).toEqual(1)
      })

      it('should build a valid v2 transaction', async () => {
        const spy = setAip11AndSpy(true)

        const transaction = await client.buildTransfer(rawTransaction, true)

        spy.mockRestore()

        expect(transaction.vendorField).toEqual(rawTransaction.vendorField)
        expect(transaction.amount).toEqual(rawTransaction.amount.toString())
        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.type).toEqual(0)
        expect(transaction.version).toEqual(2)
      })
    })

    describe('when a custom network is specified', () => {
      it('should have the correct version', async () => {
        setAip11AndSpy(false, false)
        const networkId = 'ark.devnet'
        const transaction = await client.buildTransfer({ fee: new BigNumber(fees[1][0]), networkId, passphrase: 'test' }, false, true)
        expect(transaction.data.network).toBe(30)
      })
    })

    describe('when the fee is bigger than the static fee', () => {
      it('should throw an Error', async () => {
        const fee = new BigNumber(fees[1][0] + 1)
        expect(await errorCapturer(client.buildTransfer({ fee }))).toThrow(/fee/)
      })
    })

    describe('when the fee is smaller or equal to the static fee (0.1)', () => {
      it('should not throw an Error', async () => {
        expect(await errorCapturer(client.buildTransfer({ fee: new BigNumber(fees[1][0]) }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildTransfer({ fee: new BigNumber(fees[1][0] - 1) }))).not.toThrow(/fee/)
      })
    })
  })

  describe('buildSecondSignatureRegistration', () => {
    describe('standard transaction', () => {
      const address = Identities.Address.fromPassphrase('passphrase', 23)
      const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
      const secondPublicKey = Identities.PublicKey.fromPassphrase('second passphrase')
      const rawTransaction = {
        address,
        fee: new BigNumber(fees[1][1]),
        passphrase: 'passphrase',
        secondPassphrase: 'second passphrase',
        networkWif: 170
      }

      it('should build a valid v1 transaction', async () => {
        setAip11AndSpy(false, false)

        const transaction = await client.buildSecondSignatureRegistration(rawTransaction, true)

        expect(transaction.asset.signature.publicKey).toEqual(secondPublicKey)
        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.type).toEqual(1)
        expect(transaction.version).toEqual(1)
      })

      it('should build a valid v2 transaction', async () => {
        const spy = setAip11AndSpy(true)

        const transaction = await client.buildSecondSignatureRegistration(rawTransaction, true)

        spy.mockRestore()

        expect(transaction.asset.signature.publicKey).toEqual(secondPublicKey)
        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.type).toEqual(1)
        expect(transaction.version).toEqual(2)
      })
    })

    describe('when the fee is bigger than the static fee', () => {
      it('should throw an Error', async () => {
        const fee = new BigNumber(fees[1][1] + 1)
        expect(await errorCapturer(client.buildSecondSignatureRegistration({ fee }))).toThrow(/fee/)
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        expect(await errorCapturer(client.buildSecondSignatureRegistration({ fee: new BigNumber(fees[1][1]) }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildSecondSignatureRegistration({ fee: new BigNumber(fees[1][1] - 1) }))).not.toThrow(/fee/)
      })
    })
  })

  describe('buildMultiSignature', () => {
    const minKeys = 3
    const publicKeys = []
    for (let i = 0; i < 5; i++) {
      publicKeys.push(Identities.PublicKey.fromPassphrase(`passphrase ${i}`))
    }

    describe('standard transaction', () => {
      const address = Identities.Address.fromPassphrase('passphrase', 23)
      const publicKey = Identities.PublicKey.fromPassphrase('passphrase')

      const rawTransaction = {
        address,
        publicKeys,
        minKeys,
        fee: new BigNumber(fees[1][4]),
        passphrase: 'passphrase',
        secondPassphrase: 'second passphrase',
        networkWif: 170
      }

      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        expect(await errorCapturer(client.buildMultiSignature(rawTransaction, true))).toThrow('AIP-11 transaction not supported on network')
      })

      it('should build a valid v2 transaction', async () => {
        const spy = setAip11AndSpy(true)

        const transaction = await client.buildMultiSignature(rawTransaction, true)

        spy.mockRestore()

        expect(transaction.asset.multiSignature.publicKeys).toEqual(publicKeys)
        expect(transaction.asset.multiSignature.min).toEqual(rawTransaction.minKeys)
        expect(transaction.fee + '').toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual('public key of passphrase')
        expect(transaction.type).toEqual(4)
        expect(transaction.version).toEqual(2)
      })

      it('should return object if required', async () => {
        const spy = setAip11AndSpy(true)

        const transaction = await client.buildMultiSignature(rawTransaction, true, true)

        spy.mockRestore()

        expect(transaction.constructor.name).toEqual('MultiSignatureBuilder')
        expect(transaction.data.asset.multiSignature.publicKeys).toEqual(publicKeys)
        expect(transaction.data.asset.multiSignature.min).toEqual(rawTransaction.minKeys)
        expect(transaction.data.fee + '').toEqual(rawTransaction.fee.toString())
        expect(transaction.data.senderPublicKey).toEqual('public key of passphrase')
        expect(transaction.data.type).toEqual(4)
        expect(transaction.data.version).toEqual(2)
      })

      it('should add own wallet to signatures', async () => {
        const spy = setAip11AndSpy(true)
        const getPublicKeyFromPassphrase = WalletService.getPublicKeyFromPassphrase
        WalletService.getPublicKeyFromPassphrase = jest.fn((passphrase) => Identities.PublicKey.fromPassphrase(passphrase))

        const newPublicKeys = [
          ...publicKeys,
          publicKey
        ]
        const newRawTransaction = {
          ...rawTransaction,
          publicKeys: newPublicKeys
        }

        const transaction = await client.buildMultiSignature(newRawTransaction, true)

        spy.mockRestore()
        WalletService.getPublicKeyFromPassphrase = getPublicKeyFromPassphrase

        const publicKeyIndex = newPublicKeys.indexOf(publicKey)
        const signature = transaction.signatures.find(s => parseInt(s.substring(0, 2), 16) === publicKeyIndex)

        expect(signature).toBeTruthy()
        expect(transaction.asset.multiSignature.publicKeys).toEqual(newPublicKeys)
        expect(transaction.asset.multiSignature.min).toEqual(rawTransaction.minKeys)
        expect(transaction.fee + '').toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.type).toEqual(4)
        expect(transaction.version).toEqual(2)
      })
    })

    describe('when the fee is bigger than the static fee', () => {
      it('should throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        const fee = new BigNumber(fees[1][4] + 1)
        expect(await errorCapturer(client.buildMultiSignature({ fee, minKeys, publicKeys }))).toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        expect(await errorCapturer(client.buildMultiSignature({ fee: new BigNumber(fees[1][4]) }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildMultiSignature({ fee: new BigNumber(fees[1][4] - 1) }))).not.toThrow(/fee/)
        spy.mockRestore()
      })
    })
  })

  describe('buildIpfs', () => {
    describe('standard transaction', () => {
      const address = Identities.Address.fromPassphrase('passphrase', 23)
      const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
      const rawTransaction = {
        address,
        fee: new BigNumber(fees[1][5]),
        hash: 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6',
        passphrase: 'passphrase',
        secondPassphrase: 'second passphrase',
        networkWif: 170
      }

      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        expect(await errorCapturer(client.buildIpfs(rawTransaction, true))).toThrow('AIP-11 transaction not supported on network')
      })

      it('should not create transaction with invalid hash', async () => {
        const spy = setAip11AndSpy(true)

        const newRawTransaction = {
          ...rawTransaction,
          hash: 'invalid hash'
        }

        expect(await errorCapturer(client.buildIpfs(newRawTransaction, true))).toThrow('Invalid base58 string.')

        spy.mockRestore()
      })

      it('should build a valid v2 transaction', async () => {
        const spy = setAip11AndSpy(true)

        const transaction = await client.buildIpfs(rawTransaction, true)

        spy.mockRestore()

        expect(transaction.asset.ipfs).toEqual(rawTransaction.hash)
        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.type).toEqual(5)
        expect(transaction.version).toEqual(2)
      })
    })

    describe('when the fee is bigger than the static fee', () => {
      it('should throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        const fee = new BigNumber(fees[1][5] + 1)
        expect(await errorCapturer(client.buildIpfs({ fee }))).toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        expect(await errorCapturer(client.buildIpfs({ fee: new BigNumber(fees[1][5]) }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildIpfs({ fee: new BigNumber(fees[1][5] - 1) }))).not.toThrow(/fee/)
        spy.mockRestore()
      })
    })
  })

  describe('buildMultiPayment', () => {
    const recipients = []
    for (let i = 0; i < 5; i++) {
      recipients.push({
        address: Identities.Address.fromPassphrase(`passphrase ${i}`, 23),
        amount: new BigNumber((i + 1) * 1e8)
      })
    }

    describe('standard transaction', () => {
      const address = Identities.Address.fromPassphrase('passphrase', 23)
      const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
      const rawTransaction = {
        address,
        recipients,
        fee: new BigNumber(fees[1][6]),
        vendorField: 'this is a test',
        passphrase: 'passphrase',
        secondPassphrase: 'second passphrase',
        networkWif: 170
      }

      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        expect(await errorCapturer(client.buildMultiPayment(rawTransaction, true))).toThrow('AIP-11 transaction not supported on network')
      })

      it('should build a valid v2 transaction', async () => {
        const spy = setAip11AndSpy(true)

        const transaction = await client.buildMultiPayment(rawTransaction, true)

        spy.mockRestore()

        for (const recipientIndex in recipients) {
          expect(transaction.asset.payments[recipientIndex].recipientId).toEqual(recipients[recipientIndex].address)
          expect(transaction.asset.payments[recipientIndex].amount).toEqual(recipients[recipientIndex].amount.toString())
        }
        expect(transaction.vendorField).toEqual(rawTransaction.vendorField)
        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.type).toEqual(6)
        expect(transaction.version).toEqual(2)
      })
    })

    describe('when the fee is bigger than the static fee', () => {
      it('should throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        const fee = new BigNumber(fees[1][6] + 1)
        expect(await errorCapturer(client.buildMultiPayment({ fee }))).toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        expect(await errorCapturer(client.buildMultiPayment({ fee: new BigNumber(fees[1][6]) }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildMultiPayment({ fee: new BigNumber(fees[1][6] - 1) }))).not.toThrow(/fee/)
        spy.mockRestore()
      })
    })
  })

  describe('buildDelegateResignation', () => {
    describe('standard transaction', () => {
      const address = Identities.Address.fromPassphrase('passphrase', 23)
      const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
      const rawTransaction = {
        address,
        fee: new BigNumber(fees[1][7]),
        passphrase: 'passphrase',
        secondPassphrase: 'second passphrase',
        networkWif: 170
      }

      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        expect(await errorCapturer(client.buildDelegateResignation(rawTransaction, true))).toThrow('AIP-11 transaction not supported on network')
      })

      it('should build a valid v2 transaction', async () => {
        const spy = setAip11AndSpy(true)

        const transaction = await client.buildDelegateResignation(rawTransaction, true)

        spy.mockRestore()

        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.type).toEqual(7)
        expect(transaction.version).toEqual(2)
      })
    })

    describe('when the fee is bigger than the static fee', () => {
      it('should throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        const fee = new BigNumber(fees[1][7] + 1)
        expect(await errorCapturer(client.buildDelegateResignation({ fee }))).toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        expect(await errorCapturer(client.buildDelegateResignation({ fee: new BigNumber(fees[1][7]) }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildDelegateResignation({ fee: new BigNumber(fees[1][7] - 1) }))).not.toThrow(/fee/)
        spy.mockRestore()
      })
    })
  })

  describe('buildBusinessRegistration', () => {
    describe('standard transaction', () => {
      const address = Identities.Address.fromPassphrase('passphrase', 23)
      const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
      const rawTransaction = {
        address,
        fee: new BigNumber(fees[2][0]),
        asset: {
          name: 'google',
          website: 'https://www.google.com',
          vat: 'GB123456',
          repository: 'https://github.com/arkecosystem/desktop-wallet.git'
        },
        passphrase: 'passphrase',
        secondPassphrase: 'second passphrase',
        networkWif: 170
      }

      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        expect(await errorCapturer(client.buildBusinessRegistration(rawTransaction, true))).toThrow('AIP-11 transaction not supported on network')
      })

      it('should build a valid v2 transaction', async () => {
        const spy = setAip11AndSpy(true)

        const transaction = await client.buildBusinessRegistration(rawTransaction, true)

        spy.mockRestore()

        expect(transaction.asset.businessRegistration).toEqual(rawTransaction.asset)
        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.typeGroup).toEqual(2)
        expect(transaction.type).toEqual(0)
        expect(transaction.version).toEqual(2)
      })

      it('should build a valid v2 transaction without optional data', async () => {
        const spy = setAip11AndSpy(true)

        const newRawTransaction = {
          ...rawTransaction,
          asset: {
            name: 'google',
            website: 'https://www.google.com'
          }
        }
        const transaction = await client.buildBusinessRegistration(newRawTransaction, true)

        spy.mockRestore()

        expect(transaction.asset.businessRegistration).toEqual(newRawTransaction.asset)
        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.typeGroup).toEqual(2)
        expect(transaction.type).toEqual(0)
        expect(transaction.version).toEqual(2)
      })
    })

    describe('when the fee is bigger than the static fee', () => {
      it('should throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        const fee = new BigNumber(fees[2][0] + 1)
        expect(await errorCapturer(client.buildBusinessRegistration({ fee }))).toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        expect(await errorCapturer(client.buildBusinessRegistration({ fee: new BigNumber(fees[2][0]) }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildBusinessRegistration({ fee: new BigNumber(fees[2][0] - 1) }))).not.toThrow(/fee/)
        spy.mockRestore()
      })
    })
  })

  describe('buildBusinessUpdate', () => {
    describe('standard transaction', () => {
      const address = Identities.Address.fromPassphrase('passphrase', 23)
      const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
      const rawTransaction = {
        address,
        fee: new BigNumber(fees[2][2]),
        asset: {
          name: 'google',
          website: 'https://www.google.com',
          vat: 'GB123456',
          repository: 'https://github.com/arkecosystem/desktop-wallet.git'
        },
        passphrase: 'passphrase',
        secondPassphrase: 'second passphrase',
        networkWif: 170
      }

      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        expect(await errorCapturer(client.buildBusinessUpdate(rawTransaction, true))).toThrow('AIP-11 transaction not supported on network')
      })

      it('should build a valid v2 transaction', async () => {
        const spy = setAip11AndSpy(true)

        const transaction = await client.buildBusinessUpdate(rawTransaction, true)

        spy.mockRestore()

        expect(transaction.asset.businessUpdate).toEqual(rawTransaction.asset)
        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.typeGroup).toEqual(2)
        expect(transaction.type).toEqual(2)
        expect(transaction.version).toEqual(2)
      })

      it('should build a valid v2 transaction without optional data', async () => {
        const spy = setAip11AndSpy(true)

        const newRawTransaction = {
          ...rawTransaction,
          asset: {
            name: 'google',
            website: 'https://www.google.com'
          }
        }
        const transaction = await client.buildBusinessUpdate(newRawTransaction, true)

        spy.mockRestore()

        expect(transaction.asset.businessUpdate).toEqual(newRawTransaction.asset)
        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.typeGroup).toEqual(2)
        expect(transaction.type).toEqual(2)
        expect(transaction.version).toEqual(2)
      })
    })

    describe('when the fee is bigger than the static fee', () => {
      it('should throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        const fee = new BigNumber(fees[2][2] + 1)
        expect(await errorCapturer(client.buildBusinessUpdate({ fee }))).toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        expect(await errorCapturer(client.buildBusinessUpdate({ fee: new BigNumber(fees[2][2]) }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildBusinessUpdate({ fee: new BigNumber(fees[2][2] - 1) }))).not.toThrow(/fee/)
        spy.mockRestore()
      })
    })
  })

  describe('buildBusinessResignation', () => {
    describe('standard transaction', () => {
      const address = Identities.Address.fromPassphrase('passphrase', 23)
      const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
      const rawTransaction = {
        address,
        fee: new BigNumber(fees[2][1]),
        passphrase: 'passphrase',
        secondPassphrase: 'second passphrase',
        networkWif: 170
      }

      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        expect(await errorCapturer(client.buildBusinessResignation(rawTransaction, true))).toThrow('AIP-11 transaction not supported on network')
      })

      it('should build a valid v2 transaction', async () => {
        const spy = setAip11AndSpy(true)

        const transaction = await client.buildBusinessResignation(rawTransaction, true)

        spy.mockRestore()

        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.typeGroup).toEqual(2)
        expect(transaction.type).toEqual(1)
        expect(transaction.version).toEqual(2)
      })
    })

    describe('when the fee is bigger than the static fee', () => {
      it('should throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        const fee = new BigNumber(fees[2][1] + 1)
        expect(await errorCapturer(client.buildBusinessResignation({ fee }))).toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        expect(await errorCapturer(client.buildBusinessResignation({ fee: new BigNumber(fees[2][1]) }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildBusinessResignation({ fee: new BigNumber(fees[2][1] - 1) }))).not.toThrow(/fee/)
        spy.mockRestore()
      })
    })
  })

  describe('buildBridgechainRegistration', () => {
    describe('standard transaction', () => {
      const address = Identities.Address.fromPassphrase('passphrase', 23)
      const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
      const rawTransaction = {
        address,
        fee: new BigNumber(fees[2][3]),
        asset: {
          name: 'test_bridgechain',
          seedNodes: [
            '1.1.1.1',
            '2.2.2.2',
            '3.3.3.3',
            '4.4.4.4'
          ],
          ports: {
            '@arkecosystem/core-api': 4003
          },
          genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
          bridgechainRepository: 'https://github.com/arkecosystem/core.git'
        },
        passphrase: 'passphrase',
        secondPassphrase: 'second passphrase',
        networkWif: 170
      }

      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        expect(await errorCapturer(client.buildBridgechainRegistration(rawTransaction, true))).toThrow('AIP-11 transaction not supported on network')
      })

      it('should build a valid v2 transaction', async () => {
        const spy = setAip11AndSpy(true)

        const transaction = await client.buildBridgechainRegistration(rawTransaction, true)

        spy.mockRestore()

        expect(transaction.asset.bridgechainRegistration).toEqual(rawTransaction.asset)
        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.typeGroup).toEqual(2)
        expect(transaction.type).toEqual(3)
        expect(transaction.version).toEqual(2)
      })
    })

    describe('when the fee is bigger than the static fee', () => {
      it('should throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        const fee = new BigNumber(fees[2][3] + 1)
        expect(await errorCapturer(client.buildBridgechainRegistration({ fee }))).toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        expect(await errorCapturer(client.buildBridgechainRegistration({ fee: new BigNumber(fees[2][3]) }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildBridgechainRegistration({ fee: new BigNumber(fees[2][3] - 1) }))).not.toThrow(/fee/)
        spy.mockRestore()
      })
    })
  })

  describe('buildBridgechainUpdate', () => {
    describe('standard transaction', () => {
      const address = Identities.Address.fromPassphrase('passphrase', 23)
      const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
      const rawTransaction = {
        address,
        fee: new BigNumber(fees[2][5]),
        asset: {
          bridgechainId: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
          seedNodes: [
            '1.1.1.1',
            '2.2.2.2',
            '3.3.3.3',
            '4.4.4.4'
          ],
          ports: {
            '@arkecosystem/core-api': 4003
          }
        },
        passphrase: 'passphrase',
        secondPassphrase: 'second passphrase',
        networkWif: 170
      }

      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        expect(await errorCapturer(client.buildBridgechainUpdate(rawTransaction, true))).toThrow('AIP-11 transaction not supported on network')
      })

      it('should build a valid v2 transaction', async () => {
        const spy = setAip11AndSpy(true)

        const transaction = await client.buildBridgechainUpdate(rawTransaction, true)

        spy.mockRestore()

        expect(transaction.asset.bridgechainUpdate).toEqual(rawTransaction.asset)
        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.typeGroup).toEqual(2)
        expect(transaction.type).toEqual(5)
        expect(transaction.version).toEqual(2)
      })
    })

    describe('when the fee is bigger than the static fee', () => {
      it('should throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        const fee = new BigNumber(fees[2][5] + 1)
        expect(await errorCapturer(client.buildBridgechainUpdate({ fee }))).toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        expect(await errorCapturer(client.buildBridgechainUpdate({ fee: new BigNumber(fees[2][5]) }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildBridgechainUpdate({ fee: new BigNumber(fees[2][5] - 1) }))).not.toThrow(/fee/)
        spy.mockRestore()
      })
    })
  })

  describe('buildBridgechainResignation', () => {
    describe('standard transaction', () => {
      const address = Identities.Address.fromPassphrase('passphrase', 23)
      const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
      const rawTransaction = {
        address,
        fee: new BigNumber(fees[2][4]),
        bridgechainId: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
        passphrase: 'passphrase',
        secondPassphrase: 'second passphrase',
        networkWif: 170
      }

      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        expect(await errorCapturer(client.buildBridgechainResignation(rawTransaction, true))).toThrow('AIP-11 transaction not supported on network')
      })

      it('should build a valid v2 transaction', async () => {
        const spy = setAip11AndSpy(true)

        const transaction = await client.buildBridgechainResignation(rawTransaction, true)

        spy.mockRestore()

        expect(transaction.asset.bridgechainResignation.bridgechainId).toEqual(rawTransaction.bridgechainId)
        expect(transaction.fee).toEqual(rawTransaction.fee.toString())
        expect(transaction.senderPublicKey).toEqual(publicKey)
        expect(transaction.typeGroup).toEqual(2)
        expect(transaction.type).toEqual(4)
        expect(transaction.version).toEqual(2)
      })
    })

    describe('when the fee is bigger than the static fee', () => {
      it('should throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        const fee = new BigNumber(fees[2][4] + 1)
        expect(await errorCapturer(client.buildBridgechainResignation({ fee }))).toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)
        expect(await errorCapturer(client.buildBridgechainResignation({ fee: new BigNumber(fees[2][4]) }))).not.toThrow(/fee/)
        expect(await errorCapturer(client.buildBridgechainResignation({ fee: new BigNumber(fees[2][4] - 1) }))).not.toThrow(/fee/)
        spy.mockRestore()
      })
    })
  })

  describe('__signTransaction', () => {
    const address = Identities.Address.fromPassphrase('passphrase', 23)
    const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
    const passphrase = 'passphrase'
    const secondPassphrase = 'second passphrase'
    let transaction
    let signData

    beforeEach(() => {
      transaction = Transactions.BuilderFactory
        .transfer()
        .amount(new BigNumber(1 * 1e8))
        .fee(new BigNumber(0.1 * 1e8))
        .recipientId(address)
        .vendorField('test vendorfield')

      signData = {
        address,
        transaction,
        passphrase,
        secondPassphrase,
        networkWif: 170,
        networkId: 'ark.mainnet'
      }
    })

    it('should sign transaction', async () => {
      setAip11AndSpy(false, false)

      const response = await client.__signTransaction(signData)

      expect(response.vendorField).toEqual(transaction.data.vendorField)
      expect(response.amount).toBe(new BigNumber(1 * 1e8).toString())
      expect(response.fee).toBe(new BigNumber(0.1 * 1e8).toString())
      expect(response.senderPublicKey).toEqual(publicKey)
      expect(response.type).toEqual(0)
      expect(response.version).toEqual(1)
    })

    it('should get network from session if no id', async () => {
      const networkByIdSpy = jest.spyOn(store.getters, 'network/byId')

      await client.__signTransaction({
        ...signData,
        networkId: null
      })

      expect(networkByIdSpy).not.toHaveBeenCalled()

      networkByIdSpy.mockRestore()
    })

    it('should get network by id if provided', async () => {
      const networkByIdSpy = jest.spyOn(store.getters, 'network/byId')

      await client.__signTransaction(signData)

      expect(networkByIdSpy).toHaveBeenCalledWith('ark.mainnet')

      networkByIdSpy.mockRestore()
    })

    it('should normalize passphrase if provided', async () => {
      const spy = jest.spyOn(client, 'normalizePassphrase')

      await client.__signTransaction(signData)

      expect(spy).toHaveBeenCalledWith(signData.passphrase)
      expect(spy).toHaveBeenCalledWith(signData.secondPassphrase)
    })

    it('should not normalize if no passphrase is provided', async () => {
      const spy = jest.spyOn(client, 'normalizePassphrase')
      const wif = Identities.WIF.fromPassphrase(passphrase, { wif: 170 })

      await client.__signTransaction({
        ...signData,
        passphrase: null,
        secondPassphrase: null,
        wif
      })

      expect(spy).not.toHaveBeenCalled()
    })

    it('should create v1 transaction if aip11 disabled', async () => {
      const response = await client.__signTransaction(signData)

      expect(response.version).toBe(1)
      expect(response.nonce).toBeFalsy()
      expect(response.timestamp).toBeTruthy()
    })

    it('should create v2 transaction if aip11 enabled', async () => {
      const spy = setAip11AndSpy(true)

      const response = await client.__signTransaction(signData)

      spy.mockRestore()

      expect(response.version).toBe(2)
      expect(response.nonce).toBe('1')
    })

    it('should increment nonce of wallet', async () => {
      const spy = setAip11AndSpy(true)
      nock('http://127.0.0.1:4003')
        .get(`/api/v2/wallets/${address}`)
        .reply(200, {
          data: {
            nonce: 3
          }
        })

      const response = await client.__signTransaction(signData)

      spy.mockRestore()

      expect(response.version).toBe(2)
      expect(response.nonce).toBe('4')
    })

    it('should default nonce to 0 if no wallet', async () => {
      const spy = setAip11AndSpy(true)
      nock('http://127.0.0.1:4003')
        .get(`/api/v2/wallets/${address}`)
        .reply(200, {
          data: {}
        })

      const response = await client.__signTransaction(signData)

      spy.mockRestore()

      expect(response.version).toBe(2)
      expect(response.nonce).toBe('1')
    })

    it('should sign with passphrase', async () => {
      const spy = setAip11AndSpy(true)
      const spySignPassphrase = jest.spyOn(transaction, 'sign')

      const response = await client.__signTransaction(signData)

      spy.mockRestore()

      expect(response.version).toBe(2)
      expect(response.nonce).toBe('1')
      expect(spySignPassphrase).toHaveBeenCalledWith(passphrase)
    })

    it('should sign with second passphrase', async () => {
      const spy = setAip11AndSpy(true)
      const spySecondSignPassphrase = jest.spyOn(transaction, 'secondSign')

      const response = await client.__signTransaction(signData)

      spy.mockRestore()

      expect(response.version).toBe(2)
      expect(response.nonce).toBe('1')
      expect(spySecondSignPassphrase).toHaveBeenCalledWith(secondPassphrase)
    })

    it('should sign with wif', async () => {
      const spy = setAip11AndSpy(true)
      const spySignWif = jest.spyOn(transaction, 'signWithWif')
      const wif = Identities.WIF.fromPassphrase(passphrase, { wif: 170 })

      const response = await client.__signTransaction({
        ...signData,
        passphrase: null,
        secondPassphrase: null,
        wif
      })

      spy.mockRestore()

      expect(response.version).toBe(2)
      expect(response.nonce).toBe('1')
      expect(spySignWif).toHaveBeenCalledWith(wif, 170)
    })

    it('should return object', async () => {
      const spy = setAip11AndSpy(true)

      const response = await client.__signTransaction(signData, true)

      spy.mockRestore()

      expect(response.data).toBeTruthy()
      expect(response.constructor.name).toBe('TransferBuilder')
    })

    describe('multiSignature', () => {
      const minKeys = 3
      let multiSignature
      let publicKeys
      let aip11Spy

      beforeEach(() => {
        publicKeys = []
        for (let i = 0; i < 5; i++) {
          publicKeys.push(Identities.PublicKey.fromPassphrase(`passphrase ${i}`))
        }

        multiSignature = {
          publicKeys,
          min: minKeys
        }
        aip11Spy = setAip11AndSpy(true)
      })

      afterEach(() => {
        aip11Spy.mockRestore()
      })

      it('should create transaction for multi-signature wallet when using passphrase', async () => {
        const getPublicKeyFromPassphrase = WalletService.getPublicKeyFromPassphrase
        WalletService.getPublicKeyFromPassphrase = jest.fn((passphrase) => Identities.PublicKey.fromPassphrase(passphrase))

        const response = await client.__signTransaction({
          ...signData,
          multiSignature
        })

        WalletService.getPublicKeyFromPassphrase = getPublicKeyFromPassphrase

        expect(response.signatures.length).toBe(0)
      })

      it('should return transaction with multiSignature property', async () => {
        const getPublicKeyFromPassphrase = WalletService.getPublicKeyFromPassphrase
        WalletService.getPublicKeyFromPassphrase = jest.fn((passphrase) => Identities.PublicKey.fromPassphrase(passphrase))

        const response = await client.__signTransaction({
          ...signData,
          multiSignature
        })

        WalletService.getPublicKeyFromPassphrase = getPublicKeyFromPassphrase

        expect(response.multiSignature).toBe(multiSignature)
      })

      describe('own passphrase used', () => {
        beforeEach(() => {
          publicKeys.push(Identities.PublicKey.fromPassphrase(`${passphrase}`))
        })

        it('should add signature to list of signatures', async () => {
          const spyMultiSign = jest.spyOn(transaction, 'multiSign')
          const getPublicKeyFromPassphraseMock = jest.fn((passphrase) => Identities.PublicKey.fromPassphrase(passphrase))
          const getPublicKeyFromPassphrase = WalletService.getPublicKeyFromPassphrase
          WalletService.getPublicKeyFromPassphrase = getPublicKeyFromPassphraseMock

          const response = await client.__signTransaction({
            ...signData,
            multiSignature
          })

          WalletService.getPublicKeyFromPassphrase = getPublicKeyFromPassphrase

          const publicKeyIndex = publicKeys.indexOf(publicKey)
          const signature = response.signatures.find(s => parseInt(s.substring(0, 2), 16) === publicKeyIndex)

          expect(getPublicKeyFromPassphraseMock).toHaveBeenCalledWith(passphrase)
          expect(spyMultiSign).toHaveBeenCalledWith(passphrase, publicKeyIndex)
          expect(signature).toBeTruthy()
        })
      })

      describe('own wif used', () => {
        beforeEach(() => {
          publicKeys.push(Identities.PublicKey.fromPassphrase(`${passphrase}`))
        })

        it('should add signature to list of signatures', async () => {
          const spyMultiSignWithWif = jest.spyOn(transaction, 'multiSignWithWif')
          const getPublicKeyFromWIFMock = jest.fn((wif) => Identities.PublicKey.fromWIF(wif, { wif: 170 }))
          const getPublicKeyFromWIF = WalletService.getPublicKeyFromWIF
          WalletService.getPublicKeyFromWIF = getPublicKeyFromWIFMock

          const wif = Identities.WIF.fromPassphrase(passphrase, { wif: 170 })
          const response = await client.__signTransaction({
            ...signData,
            multiSignature,
            passphrase: null,
            secondPassphrase: null,
            wif
          })

          WalletService.getPublicKeyFromWIF = getPublicKeyFromWIF

          const publicKeyIndex = publicKeys.indexOf(publicKey)
          const signature = response.signatures.find(s => parseInt(s.substring(0, 2), 16) === publicKeyIndex)

          expect(getPublicKeyFromWIFMock).toHaveBeenCalledWith(wif)
          expect(spyMultiSignWithWif).toHaveBeenCalledWith(publicKeyIndex, wif, 170)
          expect(signature).toBeTruthy()
        })
      })
    })
  })

  describe('multiSign', () => {
    const masterPassphrase = 'passphrase'
    const address = Identities.Address.fromPassphrase(masterPassphrase, 23)
    const publicKey = Identities.PublicKey.fromPassphrase(masterPassphrase)
    const minKeys = 3
    let publicKeys
    let transaction
    let signData
    let multiSignature
    let aip11Spy

    beforeEach(() => {
      publicKeys = []
      for (let i = 0; i < 5; i++) {
        publicKeys.push(Identities.PublicKey.fromPassphrase(`passphrase ${i}`))
      }

      multiSignature = {
        publicKeys,
        min: minKeys
      }
      aip11Spy = setAip11AndSpy(true)

      transaction = {
        amount: new BigNumber(1 * 1e8),
        fee: new BigNumber(0.1 * 1e8),
        type: 0,
        typeGroup: 1,
        recipientId: address,
        vendorField: 'test vendorfield',
        version: 2,
        network: 23,
        senderPublicKey: publicKey,
        nonce: '1',
        signatures: []
      }

      signData = {
        multiSignature,
        networkWif: 170,
        passphrase: 'passphrase 1'
      }
    })

    afterEach(() => {
      aip11Spy.mockRestore()
    })

    it('should throw error if no passphrase or wif', async () => {
      expect(await errorCapturer(client.multiSign(transaction, { multiSignature }))).toThrow('No passphrase or wif provided')
    })

    it('should throw error aip11 not enabled', async () => {
      setAip11AndSpy(false, false)

      expect(await errorCapturer(client.multiSign(transaction, signData))).toThrow('Multi-Signature Transactions are not supported yet')
    })

    it('should parse transaction from data', async () => {
      const spy = jest.spyOn(client, '__transactionFromData')

      await client.multiSign(transaction, signData)
      expect(spy).toHaveBeenCalledWith(transaction)
    })

    it('should get keys from passphrase if provided', async () => {
      const spy = jest.spyOn(Identities.Keys, 'fromPassphrase')

      await client.multiSign(transaction, signData)
      expect(spy).toHaveBeenCalledWith('passphrase 1')

      spy.mockRestore()
    })

    it('should get keys from wif if provided', async () => {
      const wif = Identities.WIF.fromPassphrase('passphrase 1', { wif: 170 })
      const spy = jest.spyOn(Identities.Keys, 'fromWIF')

      await client.multiSign(transaction, {
        ...signData,
        passphrase: null,
        wif
      })
      expect(spy).toHaveBeenCalledWith(wif, { wif: 170 })

      spy.mockRestore()
    })

    it('should check if signatures are needed', async () => {
      const spy = jest.spyOn(TransactionService, 'isMultiSignatureReady')

      await client.multiSign(transaction, signData)

      expect(spy).toHaveBeenCalledWith({ ...transaction, multiSignature }, true)
      expect(spy).toHaveBeenCalledTimes(1)

      spy.mockRestore()
    })

    it('should throw error if passphrase is not required for multi-signature wallet', async () => {
      expect(await errorCapturer(client.multiSign(transaction, { ...signData, passphrase: 'not used' }))).toThrow('passphrase/wif is not used to sign this transaction')
    })

    it('should add signature for passphrase', async () => {
      const response = await client.multiSign(transaction, signData)

      expect(response.signatures.length).toBe(1)
      expect(response.signatures[0]).toBeTruthy()
    })

    it('should add additional signatures upto minimum required', async () => {
      for (let i = 0; i < minKeys; i++) {
        transaction = await client.multiSign(transaction, { ...signData, passphrase: `passphrase ${i}` })
      }

      expect(transaction.signatures.length).toBe(3)
      for (let i = 0; i < minKeys; i++) {
        const publicKeyIndex = publicKeys.indexOf(Identities.PublicKey.fromPassphrase(`passphrase ${i}`))
        const signature = transaction.signatures.find(s => parseInt(s.substring(0, 2), 16) === publicKeyIndex)

        expect(signature).toBeTruthy()
      }
    })

    it('should not sign transaction if not primary sender', async () => {
      for (let i = 0; i < 4; i++) {
        transaction = await client.multiSign(transaction, { ...signData, passphrase: `passphrase ${i}` })
      }

      expect(transaction.signature).toBeFalsy()
    })

    it('should ignore duplicate signatures for passphrase', async () => {
      transaction = await client.multiSign(transaction, { ...signData, passphrase: 'passphrase 1' })
      transaction = await client.multiSign(transaction, { ...signData, passphrase: 'passphrase 2' })
      transaction = await client.multiSign(transaction, { ...signData, passphrase: 'passphrase 1' })

      const publicKeyIndex = publicKeys.indexOf(Identities.PublicKey.fromPassphrase('passphrase 1'))
      const signatures = transaction.signatures.filter(s => parseInt(s.substring(0, 2), 16) === publicKeyIndex)
      expect(signatures.length).toBe(1)
    })

    it('should only sign transaction with sender passphrase for registration', async () => {
      transaction = {
        fee: new BigNumber(0.1 * 1e8),
        type: 4,
        typeGroup: 1,
        version: 2,
        network: 23,
        senderPublicKey: publicKey,
        nonce: '1',
        signatures: [],
        asset: {
          multiSignature
        }
      }

      for (let i = 0; i < 5; i++) {
        transaction = await client.multiSign(transaction, { ...signData, passphrase: `passphrase ${i}` })
      }
      transaction = await client.multiSign(transaction, { ...signData, passphrase: masterPassphrase })

      expect(transaction.signature).toBeTruthy()
      expect(transaction.signatures.length).toBe(5)
    })

    it('should sign transaction with sender second passphrase for registration', async () => {
      transaction = {
        fee: new BigNumber(0.1 * 1e8),
        type: 4,
        typeGroup: 1,
        version: 2,
        network: 23,
        senderPublicKey: publicKey,
        nonce: '1',
        signatures: [],
        asset: {
          multiSignature
        }
      }

      for (let i = 0; i < 5; i++) {
        transaction = await client.multiSign(transaction, { ...signData, passphrase: `passphrase ${i}` })
      }
      transaction = await client.multiSign(transaction, {
        ...signData,
        passphrase: masterPassphrase,
        secondPassphrase: 'second-passphrase'
      })

      expect(transaction.signature).toBeTruthy()
      expect(transaction.secondSignature).toBeTruthy()
      expect(transaction.signatures.length).toBe(5)
    })
  })

  describe('__transactionFromData', () => {
    let transaction

    beforeEach(() => {
      transaction = {
        amount: new BigNumber(1 * 1e8),
        fee: new BigNumber(0.1 * 1e8),
        type: 0,
        typeGroup: 1,
        recipientId: 'address-1',
        vendorField: 'test vendorfield',
        version: 2,
        network: 23,
        senderPublicKey: 'publicKey-1',
        timestamp: 100000,
        nonce: '1',
        signatures: [],
        multiSignature: {
          min: 3,
          publicKeys: [
            1,
            2,
            3
          ]
        }
      }
    })

    it('should do a deep clone', () => {
      const clonedTransaction = client.__transactionFromData(transaction)
      transaction.amount = new BigNumber(2 * 1e8)

      expect(clonedTransaction.amount + '').toEqual('100000000')
    })

    it('should remove unnecessary properties', () => {
      const clonedTransaction = client.__transactionFromData(transaction)

      expect(clonedTransaction.timestamp).toBe(undefined)
      expect(clonedTransaction.multiSignature).toBe(undefined)
    })
  })

  describe('broadcastTransaction', () => {
    beforeEach(() => {
      nock('http://127.0.0.1:4003')
        .post('/api/v2/transactions')
        .reply(200, {
          data: 'transaction'
        })
    })

    it('should get current peer', async () => {
      const spy = jest.spyOn(store.getters, 'peer/current')

      await client.broadcastTransaction({ network: 23 })

      expect(spy).toHaveBeenCalledTimes(1)

      spy.mockRestore()
    })

    it('should parse current peer if no peer found', async () => {
      const spyPeerCurrent = jest.spyOn(store.getters, 'peer/current').mockReturnValue(null)
      const spy = jest.spyOn(client, '__parseCurrentPeer')

      await client.broadcastTransaction({ network: 23 })

      expect(spy).toHaveBeenCalledTimes(1)

      spy.mockRestore()
      spyPeerCurrent.mockRestore()
    })

    it('should do nothing if no transactions', async () => {
      const spy = jest.spyOn(store.getters, 'peer/current')

      await client.broadcastTransaction([])

      expect(spy).not.toHaveBeenCalled()

      spy.mockRestore()
    })

    it('should do nothing if empty transaction object', async () => {
      const spy = jest.spyOn(store.getters, 'peer/current')

      await client.broadcastTransaction({})

      expect(spy).not.toHaveBeenCalled()

      spy.mockRestore()
    })

    it('should return transaction response', async () => {
      const response = await client.broadcastTransaction({ network: 23 })

      expect(response.length).toBe(1)
      expect(response[0].body).toEqual({
        data: 'transaction'
      })
    })

    describe('broadcast', () => {
      let spyDispatch
      beforeEach(() => {
        spyDispatch = jest.spyOn(store, 'dispatch').mockImplementation((_, peer) => {
          // Copied from peer store
          const client = new ClientService(false)
          const scheme = peer.isHttps ? 'https://' : 'http://'
          client.host = `${scheme}${peer.ip}:${peer.port}`
          client.client.withOptions({ timeout: 3000 })

          return client
        })

        for (const ip of ['1.1.1.1', '2.2.2.2']) {
          nock(`http://${ip}:8080`)
            .post('/api/v2/transactions')
            .reply(200, {
              data: `broadcast transaction for ${ip}`
            })
        }
      })

      afterEach(() => {
        spyDispatch.mockRestore()
      })

      it('should get peers to broadcast to', async () => {
        const spy = jest.spyOn(store.getters, 'peer/broadcastPeers')

        await client.broadcastTransaction({ network: 23 }, true)

        expect(spy).toHaveBeenCalledTimes(1)

        spy.mockRestore()
      })

      it('should broadcast to all peers and return responses', async () => {
        const response = await client.broadcastTransaction({ network: 23 }, true)

        expect(spyDispatch).toHaveBeenCalledWith('peer/clientServiceFromPeer', {
          ip: '1.1.1.1',
          port: '8080',
          isHttps: false
        })
        expect(spyDispatch).toHaveBeenCalledWith('peer/clientServiceFromPeer', {
          ip: '2.2.2.2',
          port: '8080',
          isHttps: false
        })
        expect(response.length).toBe(2)
        expect(response[0].body).toEqual({
          data: 'broadcast transaction for 1.1.1.1'
        })
        expect(response[1].body).toEqual({
          data: 'broadcast transaction for 2.2.2.2'
        })
      })

      it('should broadcast to current peer if no broadcast peers', async () => {
        const spy = jest.spyOn(store.getters, 'peer/broadcastPeers').mockReturnValue()
        const response = await client.broadcastTransaction({ network: 23 }, true)

        spy.mockRestore()

        expect(response.length).toBe(1)
        expect(response[0].body).toEqual({
          data: 'transaction'
        })
      })
    })
  })

  // describe('__watchProfile', () => {
  //   it('should watch current profile', () => {

  //     client.__watchProfile()

  //     expect(store.watch).toHaveBeenCalledWith()
  //   })
  // })
})
