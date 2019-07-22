import nock from 'nock'
import Vue from 'vue'
import Vuex from 'vuex'
import apiClient from '@/plugins/api-client'
import store from '@/store'
import delegates, { delegate1, delegate2 } from '../../__fixtures__/store/delegate'
import { network1 } from '../../__fixtures__/store/network'
import { profile1 } from '../../__fixtures__/store/profile'

Vue.use(Vuex)
Vue.use(apiClient)

beforeAll(() => {
  store.commit('network/SET_ALL', [network1])
  store.commit('profile/CREATE', profile1)
  store.commit('session/SET_PROFILE_ID', profile1.id)
  store.dispatch('delegate/set', delegates)
})

beforeEach(() => {
  nock.cleanAll()
  nock('http://127.0.0.1')
    .persist()
    .post('/api/v2/wallets/search')
    .reply(200, { data: [] })
})

describe('delegate store module', () => {
  it('should get delegate list', () => {
    expect(Object.values(store.getters['delegate/all'][profile1.networkId])).toEqual(delegates)
  })

  it('should get a single delegate by its address', () => {
    expect(store.getters['delegate/byAddress']('AKdr5d9AMEnsKYxpDcoHdyyjSCKVx3r9Nj')).toEqual(delegate1)
  })

  it('should return false when delegate with address does not exist', () => {
    expect(store.getters['delegate/byAddress']('wrong address')).toBe(false)
  })

  it('should return false when no address is given', () => {
    expect(store.getters['delegate/byAddress']()).toBe(false)
  })

  it('should get a single delegate by its public key', () => {
    expect(store.getters['delegate/byPublicKey']('02bf72c578a12c35a97ca1230b93017161ee42c3f0ab82f6fe7c95b3b43561a076')).toEqual(delegate2)
  })

  it('should return false when delegate with public key does not exist', () => {
    expect(store.getters['delegate/byPublicKey']('wrong public key')).toBe(false)
  })

  it('should return false when no public key is given', () => {
    expect(store.getters['delegate/byPublicKey']()).toBe(false)
  })

  it('should fetch delegates from v1 api should store the same as v2 api', async () => {
    const v2DelegateData = delegates.map(delegate => {
      return {
        username: delegate.username,
        address: delegate.address,
        publicKey: delegate.publicKey,
        votes: delegate.voteWeight,
        rank: delegate.rank,
        blocks: {
          produced: delegate.blocks.produced
        },
        production: {
          approval: delegate.production.approval
        },
        forged: {
          fees: delegate.forged.fees,
          rewards: delegate.forged.rewards,
          total: delegate.forged.total
        }
      }
    })

    nock('http://127.0.0.1')
      .get('/api/v2/delegates')
      .query({ page: 1, limit: 100, orderBy: 'rank:asc' })
      .reply(200, {
        data: v2DelegateData,
        meta: {
          totalCount: 2
        }
      })

    await store.dispatch('delegate/load')

    expect(Object.values(store.getters['delegate/all'][profile1.networkId])).toEqual(delegates)
  })
})
