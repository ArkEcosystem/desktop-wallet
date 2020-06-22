import { cloneDeep } from 'lodash'
import nock from 'nock'
import { Identities, Managers } from '@arkecosystem/crypto'
import fixtures from '../__fixtures__/services/client'
import ClientService from '@/services/client'
import BigNumber from '@/plugins/bignumber'
import store from '@/store'
import logger from 'electron-log'
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
  watch: jest.fn(() => {
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

  describe('newConnection', () => {
    it('should create a new connection', () => {
      const connection = ClientService.newConnection('http://localhost')

      expect(connection.host).toBe('http://localhost/api')
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
        .get('/api/node/configuration')
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
        .get('/api/node/configuration/crypto')
        .reply(200, {
          data: cryptoConfig
        })

      expect(await ClientService.fetchNetworkCrypto('http://127.0.0.1')).toEqual(cryptoConfig)
    })
  })

  describe('fetchFeeStatistics', () => {
    const mockEndpoint = (config) => {
      nock('http://127.0.0.1')
        .get('/api/node/fees')
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
        .get('/api/node/fees')
        .query({ days: 7 })
        .reply(500)

      expect(await ClientService.fetchFeeStatistics('http://127.0.0.1')).toEqual([])
    })
  })

  describe('host getter/setter', () => {
    it('should return formatted host', () => {
      client.host = 'http://6.6.6.6'

      expect(client.host).toEqual('http://6.6.6.6/api')
    })

    it('should update current client', () => {
      client.host = 'http://7.7.7.7'

      expect(client.client.host).toEqual('http://7.7.7.7/api')
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
        .get('/api/node/syncing')
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
      expect(response).toHaveProperty('meta', meta)

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
        .get('/api/delegates/USERNAME/voters')
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
        .get('/api/businesses/BUSINESS_ID/bridgechains?page=1&limit=50&orderBy=name%3Aasc')
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

      await expect(client.fetchTransactionsForWallets(['address-1'])).rejects.toThrow('oops')

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

      await expect(client.fetchWalletVote('address2')).rejects.toThrow('oops')
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

    describe('standard transaction', () => {
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
        await expect(client.buildVote({ fee })).rejects.toThrow(/fee/)
      })
    })

    describe('when the fee is smaller or equal to the static fee fee (0.1)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(false)

        await expect(
          client.buildVote({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[1][3]) }
          })
        ).resolves.not.toThrow(/fee/)

        await expect(
          client.buildVote({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[1][3] - 1) }
          })
        ).resolves.not.toThrow(/fee/)

        spy.mockRestore()
      })
    })
  })

  describe('buildDelegateRegistration', () => {
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

    describe('standard transaction', () => {
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
        await expect(client.buildDelegateRegistration({ fee })).rejects.toThrow(/fee/)
      })
    })

    describe('when the fee is smaller or equal to the static fee (25)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(false)

        await expect(
          client.buildDelegateRegistration({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[1][2]) }
          })
        ).resolves.not.toThrow(/fee/)

        await expect(
          client.buildDelegateRegistration({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[1][2] - 1) }
          })
        ).resolves.not.toThrow(/fee/)

        spy.mockRestore()
      })
    })
  })

  describe('buildTransfer', () => {
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

    describe('standard transaction', () => {
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
        await expect(client.buildTransfer({ fee })).rejects.toThrow(/fee/)
      })
    })

    describe('when the fee is smaller or equal to the static fee (0.1)', () => {
      it('should not throw an Error', async () => {
        await expect(
          client.buildTransfer({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[1][0]) }
          })
        ).resolves.not.toThrow(/fee/)

        await expect(
          client.buildTransfer({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[1][0] - 1) }
          })
        ).resolves.not.toThrow(/fee/)
      })
    })
  })

  describe('buildSecondSignatureRegistration', () => {
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

    describe('standard transaction', () => {
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
        await expect(client.buildSecondSignatureRegistration({ fee })).rejects.toThrow(/fee/)
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(false)

        await expect(
          client.buildSecondSignatureRegistration({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[1][1]) }
          })
        ).resolves.not.toThrow(/fee/)

        await expect(
          client.buildSecondSignatureRegistration({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[1][1] - 1) }
          })
        ).resolves.not.toThrow(/fee/)

        spy.mockRestore()
      })
    })
  })

  describe('buildMultiSignature', () => {
    const minKeys = 3
    const publicKeys = []
    for (let i = 0; i < 5; i++) {
      publicKeys.push(Identities.PublicKey.fromPassphrase(`passphrase ${i}`))
    }

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

    describe('standard transaction', () => {
      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        await expect(client.buildMultiSignature(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')
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
        await expect(client.buildMultiSignature({ fee, minKeys, publicKeys })).rejects.toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)

        await expect(
          client.buildMultiSignature({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[1][4]) }
          })
        ).resolves.not.toThrow(/fee/)

        await expect(
          client.buildMultiSignature({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[1][4] - 1) }
          })
        ).resolves.not.toThrow(/fee/)

        spy.mockRestore()
      })
    })
  })

  describe('buildIpfs', () => {
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

    describe('standard transaction', () => {
      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        await expect(client.buildIpfs(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')
      })

      it('should not create transaction with invalid hash', async () => {
        const spy = setAip11AndSpy(true)

        const newRawTransaction = {
          ...rawTransaction,
          hash: 'invalid hash'
        }

        await expect(client.buildIpfs(newRawTransaction, true)).rejects.toThrow(/base58/)

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
        await expect(client.buildIpfs({ fee })).rejects.toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)

        await expect(
          client.buildIpfs({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[1][5]) }
          })
        ).resolves.not.toThrow(/fee/)

        await expect(
          client.buildIpfs({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[1][5] - 1) }
          })
        ).resolves.not.toThrow(/fee/)

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

    describe('standard transaction', () => {
      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        await expect(client.buildMultiPayment(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')
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
        await expect(client.buildMultiPayment({ fee })).rejects.toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)

        await expect(
          client.buildMultiPayment({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[1][6]) }
          })
        ).resolves.not.toThrow(/fee/)

        await expect(
          client.buildMultiPayment({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[1][6] - 1) }
          })
        ).resolves.not.toThrow(/fee/)

        spy.mockRestore()
      })
    })
  })

  describe('buildDelegateResignation', () => {
    const address = Identities.Address.fromPassphrase('passphrase', 23)
    const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
    const rawTransaction = {
      address,
      fee: new BigNumber(fees[1][7]),
      passphrase: 'passphrase',
      secondPassphrase: 'second passphrase',
      networkWif: 170
    }

    describe('standard transaction', () => {
      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        await expect(client.buildDelegateResignation(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')
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
        await expect(client.buildDelegateResignation({ fee })).rejects.toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)

        await expect(
          client.buildDelegateResignation({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[1][7]) }
          })
        ).resolves.not.toThrow(/fee/)

        await expect(
          client.buildDelegateResignation({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[1][7] - 1) }
          })
        ).resolves.not.toThrow(/fee/)

        spy.mockRestore()
      })
    })
  })

  describe('buildBusinessRegistration', () => {
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

    describe('standard transaction', () => {
      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        await expect(client.buildBusinessRegistration(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')
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
        await expect(client.buildBusinessRegistration({ fee })).rejects.toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)

        await expect(
          client.buildBusinessRegistration({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[2][0]) }
          })
        ).resolves.not.toThrow(/fee/)

        await expect(
          client.buildBusinessRegistration({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[2][0] - 1) }
          })
        ).resolves.not.toThrow(/fee/)

        spy.mockRestore()
      })
    })
  })

  describe('buildBusinessUpdate', () => {
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

    describe('standard transaction', () => {
      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        await expect(client.buildBusinessUpdate(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')
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
        await expect(client.buildBusinessUpdate({ fee })).rejects.toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)

        await expect(
          client.buildBusinessUpdate({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[2][2]) }
          })
        ).resolves.not.toThrow(/fee/)

        await expect(
          client.buildBusinessUpdate({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[2][2] - 1) }
          })
        ).resolves.not.toThrow(/fee/)

        spy.mockRestore()
      })
    })
  })

  describe('buildBusinessResignation', () => {
    const address = Identities.Address.fromPassphrase('passphrase', 23)
    const publicKey = Identities.PublicKey.fromPassphrase('passphrase')
    const rawTransaction = {
      address,
      fee: new BigNumber(fees[2][1]),
      passphrase: 'passphrase',
      secondPassphrase: 'second passphrase',
      networkWif: 170
    }

    describe('standard transaction', () => {
      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        await expect(client.buildBusinessResignation(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')
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
        await expect(client.buildBusinessResignation({ fee })).rejects.toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)

        await expect(
          client.buildBusinessResignation({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[2][1]) }
          })
        ).resolves.not.toThrow(/fee/)

        await expect(
          client.buildBusinessResignation({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[2][1] - 1) }
          })
        ).resolves.not.toThrow(/fee/)

        spy.mockRestore()
      })
    })
  })

  describe('buildBridgechainRegistration', () => {
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

    describe('standard transaction', () => {
      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        await expect(client.buildBridgechainRegistration(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')
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
        await expect(client.buildBridgechainRegistration({ fee })).rejects.toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)

        await expect(
          client.buildBridgechainRegistration({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[2][3]) }
          })
        ).resolves.not.toThrow(/fee/)

        await expect(
          client.buildBridgechainRegistration({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[2][3] - 1) }
          })
        ).resolves.not.toThrow(/fee/)

        spy.mockRestore()
      })
    })
  })

  describe('buildBridgechainUpdate', () => {
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

    describe('standard transaction', () => {
      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        await expect(client.buildBridgechainUpdate(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')
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
        await expect(client.buildBridgechainUpdate({ fee })).rejects.toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)

        await expect(
          client.buildBridgechainUpdate({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[2][5]) }
          })
        ).resolves.not.toThrow(/fee/)

        await expect(
          client.buildBridgechainUpdate({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[2][5] - 1) }
          })
        ).resolves.not.toThrow(/fee/)

        spy.mockRestore()
      })
    })
  })

  describe('buildBridgechainResignation', () => {
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

    describe('standard transaction', () => {
      it('should not build a v1 transaction', async () => {
        setAip11AndSpy(false, false)

        await expect(client.buildBridgechainResignation(rawTransaction, true)).rejects.toThrow('AIP-11 transaction not supported on network')
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
        await expect(client.buildBridgechainResignation({ fee })).rejects.toThrow(/fee/)
        spy.mockRestore()
      })
    })

    describe('when the fee is smaller or equal to the static fee (5)', () => {
      it('should not throw an Error', async () => {
        const spy = setAip11AndSpy(true)

        await expect(
          client.buildBridgechainResignation({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[2][4]) }
          })
        ).resolves.not.toThrow(/fee/)

        await expect(
          client.buildBridgechainResignation({
            ...rawTransaction,
            ...{ fee: new BigNumber(fees[2][4] - 1) }
          })
        ).resolves.not.toThrow(/fee/)

        spy.mockRestore()
      })
    })
  })

  describe('broadcastTransaction', () => {
    beforeEach(() => {
      nock('http://127.0.0.1:4003')
        .post('/api/transactions')
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
            .post('/api/transactions')
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
