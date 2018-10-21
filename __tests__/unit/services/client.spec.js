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
    const data = [
      { rank: 1, username: 'first', approval: '1', productivity: '99' },
      { rank: 2, username: 'second', approval: '2', productivity: '98' },
      { rank: 3, username: 'third', approval: '3', productivity: '97' }
    ]

    describe('when version is 1', () => {
      const delegates = [
        { rate: data[0].rank, username: data[0].username, approval: data[0].approval, productivity: data[0].productivity },
        { rate: data[1].rank, username: data[1].username, approval: data[1].approval, productivity: data[1].productivity },
        { rate: data[2].rank, username: data[2].username, approval: data[2].approval, productivity: data[2].productivity }
      ]

      beforeEach(() => {
        client.version = 1

        const resource = resource => {
          if (resource === 'delegates') {
            return {
              all: () => ({ data: { delegates, success: true } })
            }
          }
        }

        client.client.resource = resource
      })

      it('should return only some properties for each delegate', async () => {
        const delegates = await client.fetchDelegates()

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
      const delegates = [
        { rank: data[0].rank, username: data[0].username, production: { approval: data[0].approval, productivity: data[0].productivity } },
        { rank: data[1].rank, username: data[1].username, production: { approval: data[1].approval, productivity: data[1].productivity } },
        { rank: data[2].rank, username: data[2].username, production: { approval: data[2].approval, productivity: data[2].productivity } }
      ]

      beforeEach(() => {
        client.version = 2

        const resource = resource => {
          if (resource === 'delegates') {
            return {
              all: () => ({ data: { data: delegates } })
            }
          }
        }

        client.client.resource = resource
      })

      it('should return all properties for each delegate', async () => {
        const delegates = await client.fetchDelegates()

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
    let meta = {
      count: 3
    }
    let data = [
      { id: 1, amount: 100000, fee: 10000000, timestamp: { epoch: 47848091, human: '2018-09-26T08:08:11.000Z' }, sender: 'address1', recipient: 'address2' },
      { id: 2, amount: 200000, fee: 10000000, timestamp: { epoch: 47809625, human: '2018-09-25T21:27:05.000Z' }, sender: 'address2', recipient: 'address3' },
      { id: 3, amount: 300000, fee: 10000000, timestamp: { epoch: 47796863, human: '2018-09-25T17:54:23.000Z' }, sender: 'address3', recipient: 'address3' }
    ]

    describe('when version in v1', () => {
      const transactions = [
        { id: data[0].id, amount: data[0].amount, fee: data[0].fee, timestamp: data[0].timestamp.epoch, senderId: data[0].sender, recipientId: data[0].recipient },
        { id: data[1].id, amount: data[1].amount, fee: data[1].fee, timestamp: data[1].timestamp.epoch, senderId: data[1].sender, recipientId: data[1].recipient },
        { id: data[2].id, amount: data[2].amount, fee: data[2].fee, timestamp: data[2].timestamp.epoch, senderId: data[2].sender, recipientId: data[2].recipient }
      ]

      beforeEach(() => {
        client.version = 1

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
        const response = await client.fetchTransactions('address')
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
      const transactions = [
        { id: data[0].id, amount: data[0].amount, fee: data[0].fee, timestamp: data[0].timestamp, sender: data[0].sender, recipient: data[0].recipient },
        { id: data[1].id, amount: data[1].amount, fee: data[1].fee, timestamp: data[1].timestamp, sender: data[1].sender, recipient: data[1].recipient },
        { id: data[2].id, amount: data[2].amount, fee: data[2].fee, timestamp: data[2].timestamp, sender: data[2].sender, recipient: data[2].recipient }
      ]

      beforeEach(() => {
        client.version = 2

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
        const response = await client.fetchTransactions('address')
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
})
