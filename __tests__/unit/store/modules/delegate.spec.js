import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'
import Vuex from 'vuex'
import apiClient, { client as clientService } from '@/plugins/api-client'
import store from '@/store'
import delegates, { delegate1, delegate2 } from '../../__fixtures__/store/delegate'
import { network1 } from '../../__fixtures__/store/network'
import { profile1 } from '../../__fixtures__/store/profile'

Vue.use(Vuex)
Vue.use(apiClient)

const axiosMock = new MockAdapter(axios)

beforeAll(() => {
  clientService.version = 1
  clientService.host = 'http://127.0.0.1'

  store.commit('network/SET_ALL', [network1])
  store.commit('profile/CREATE', profile1)
  store.commit('session/SET_PROFILE_ID', profile1.id)
  store.dispatch('delegate/set', delegates)
})

describe('delegate store module', () => {
  it('should get delegate list', () => {
    const networkId = store.getters['session/network'].id
    expect(Object.values(store.getters['delegate/all'][networkId])).toIncludeAllMembers(delegates)
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
    const v1DelegateData = delegates.map(delegate => {
      return {
        username: delegate.username,
        address: delegate.address,
        publicKey: delegate.publicKey,
        vote: delegate.voteWeight,
        producedblocks: delegate.blocks.produced,
        missedblocks: delegate.blocks.missed,
        rate: delegate.rank,
        approval: delegate.production.approval,
        productivity: delegate.production.productivity
      }
    })
    const v2DelegateData = delegates.map(delegate => {
      return {
        username: delegate.username,
        address: delegate.address,
        publicKey: delegate.publicKey,
        votes: delegate.voteWeight,
        rank: delegate.rank,
        blocks: {
          produced: delegate.blocks.produced,
          missed: delegate.blocks.missed
        },
        production: {
          approval: delegate.production.approval,
          productivity: delegate.production.productivity
        },
        forged: {
          fees: delegate.forged.fees,
          reward: delegate.forged.rewards,
          total: delegate.forged.total
        }
      }
    })

    axiosMock
      .onGet(`http://127.0.0.1/api/delegates`, { params: { offset: 0, limit: 51, orderBy: 'rank:asc' } })
      .reply(200, {
        totalCount: 2,
        delegates: v1DelegateData
      })

    await store.dispatch('delegate/load')
    const v1Delegates = store.getters['delegate/all']

    clientService.version = 2

    axiosMock
      .onGet(`http://127.0.0.1/api/delegates`, { params: { page: 1, limit: 100, orderBy: 'rank:asc' } })
      .reply(200, {
        data: v2DelegateData,
        meta: {
          totalCount: 2
        }
      })

    await store.dispatch('delegate/load')
    const v2Delegates = store.getters['delegate/all']

    expect(v1Delegates).toEqual(v2Delegates)
  })
})
