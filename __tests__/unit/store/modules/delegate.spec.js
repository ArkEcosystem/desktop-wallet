import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'
import Vuex from 'vuex'
import apiClient, { client as ClientService } from '@/plugins/api-client'
import DelegateModule from '@/store/modules/delegate'
import delegates, { delegate1, delegate2 } from '../../__fixtures__/store/delegate'

Vue.use(Vuex)
Vue.use(apiClient)

const axiosMock = new MockAdapter(axios)

const store = new Vuex.Store({
  modules: {
    delegate: DelegateModule,
    session: {
      namespaced: true,
      getters: {
        network () {
          return {
            id: 'abc',
            constants: {
              activeDelegates: 51
            }
          }
        }
      }
    }
  },
  strict: true
})

beforeEach(() => {
  ClientService.version = 1
  ClientService.host = 'http://127.0.0.1'
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
        producedblocks: delegate.producedBlocks,
        missedblocks: delegate.missedBlocks,
        rate: delegate.rank,
        approval: delegate.approval,
        productivity: delegate.productivity
      }
    })
    const v2DelegateData = delegates.map(delegate => {
      return {
        username: delegate.username,
        address: delegate.address,
        publicKey: delegate.publicKey,
        votes: delegate.voteWeight,
        blocks: {
          produced: delegate.producedBlocks,
          missed: delegate.missedBlocks
        },
        rank: delegate.rank,
        production: {
          approval: delegate.approval,
          productivity: delegate.productivity
        }
      }
    })

    axiosMock
      .onGet(`http://127.0.0.1/api/delegates`, { params: { offset: 0, limit: 51 } })
      .reply(200, {
        totalCount: 2,
        delegates: v1DelegateData
      })

    await store.dispatch('delegate/load')
    const v1Delegates = store.getters['delegate/all']

    ClientService.version = 2

    axiosMock
      .onGet(`http://127.0.0.1/api/delegates`, { params: { page: 1, limit: 100 } })
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
