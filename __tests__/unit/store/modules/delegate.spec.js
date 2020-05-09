import nock from 'nock'
import Vue from 'vue'
import Vuex from 'vuex'
import apiClient, { client as ClientService } from '@/plugins/api-client'
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
  ClientService.host = 'http://127.0.0.1'
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

  describe('dispatch', () => {
    describe('load', () => {
      it('should fetch delegates from api', async () => {
        nock('http://127.0.0.1')
          .get('/api/delegates')
          .query({ page: 1, limit: 100, orderBy: 'rank:asc' })
          .reply(200, {
            data: delegates,
            meta: {
              totalCount: 2
            }
          })

        await store.dispatch('delegate/load')

        expect(Object.values(store.getters['delegate/all'][profile1.networkId])).toEqual(delegates)
      })

      it('should load all pages', async () => {
        const pageCount = 10

        for (let page = 1; page <= pageCount; page++) {
          nock('http://127.0.0.1')
            .get('/api/delegates')
            .query({ page, limit: 100, orderBy: 'rank:asc' })
            .reply(200, {
              data: delegates.map(delegate => ({ ...delegate, address: `${delegate.address}-${page}` })),
              meta: {
                pageCount: 10,
                totalCount: (delegates.length * 10)
              }
            })
        }

        await store.dispatch('delegate/load')

        expect(Object.values(store.getters['delegate/all'][profile1.networkId]).length).toEqual(delegates.length * 10)
      })
    })
  })
})
