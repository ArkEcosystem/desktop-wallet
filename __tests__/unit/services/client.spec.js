import ClientService from '@/services/client'

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
      balance: 'balance',
      publicKey: 'public key'
    }
    let wallet = {
      data: {
        data: {
          ...data,
          isDelegate: 'NO'
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
        expect(wallet).toHaveProperty('balance', data.balance)
        expect(wallet).toHaveProperty('publicKey', data.publicKey)
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
        expect(wallet).toHaveProperty('balance', data.balance)
        expect(wallet).toHaveProperty('publicKey', data.publicKey)
        expect(wallet).not.toHaveProperty('isDelegate')
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
          expect(delegate).not.toHaveProperty('rate')
          expect(delegate).not.toHaveProperty('approval')
          expect(delegate).not.toHaveProperty('productivity')
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
})
