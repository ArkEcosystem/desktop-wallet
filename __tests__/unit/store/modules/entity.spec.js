import nock from 'nock'
import Vue from 'vue'
import Vuex from 'vuex'
import apiClient, { client as ClientService } from '@/plugins/api-client'
import store from '@/store'
import * as entitiesFixture from '../../__fixtures__/store/entity'
import { network1 } from '../../__fixtures__/store/network'
import { profile1 } from '../../__fixtures__/store/profile'
import { File } from '@arkecosystem/platform-sdk-ipfs'

const entities = Object.values(entitiesFixture)

Vue.use(Vuex)
Vue.use(apiClient)

beforeAll(() => {
  store.commit('network/SET_ALL', [network1])
  store.commit('profile/CREATE', profile1)
  store.commit('session/SET_PROFILE_ID', profile1.id)
})

beforeEach(() => {
  nock.cleanAll()
  nock.disableNetConnect()
  ClientService.host = 'http://127.0.0.1'

  store.commit('entity/SET_ALL_ENTITIES', { entities, networkId: network1.id })
})

describe('entity store module', () => {
  it('should get entity list by session network', () => {
    expect(Object.values(store.getters['entity/bySessionNetwork'])).toEqual(entities)
  })

  it('should get entity list by session profile', () => {
    store.commit('wallet/CREATE', { address: entitiesFixture.business.address, profileId: profile1.id })
    expect(Object.values(store.getters['entity/bySessionProfile'])).toEqual([entitiesFixture.business, entitiesFixture.product, entitiesFixture.plugin])
  })

  it('should load all entities from current network', async () => {
    store.commit('entity/SET_ALL_ENTITIES', { entities: [], networkId: network1.id })
    nock('http://127.0.0.1')
      .get('/api/entities')
      .query({ page: 1, limit: 100 })
      .reply(200, {
        data: [entitiesFixture.business, entitiesFixture.product, entitiesFixture.plugin],
        meta: {
          totalCount: 5,
          pageCount: 2
        }
      })
      .get('/api/entities')
      .query({ page: 2, limit: 100 })
      .reply(200, {
        data: [entitiesFixture.module, entitiesFixture.delegate],
        meta: {
          totalCount: 10,
          pageCount: 2
        }
      })
    await store.dispatch('entity/loadAll')
    expect(Object.values(store.getters['entity/bySessionNetwork'])).toEqual(entities)
  })

  it('should load recent entities from current network', async () => {
    store.commit('entity/SET_ALL_ENTITIES', { entities: [entitiesFixture.business], networkId: network1.id })
    nock('http://127.0.0.1')
      .get('/api/entities')
      .query({ page: 1, limit: 100 })
      .reply(200, {
        data: [entitiesFixture.business, entitiesFixture.product],
        meta: {
          totalCount: 5,
          pageCount: 2
        }
      })
    await store.dispatch('entity/loadRecent')
    expect(Object.values(store.getters['entity/bySessionNetwork'])).toEqual([entitiesFixture.business, entitiesFixture.product])
  })

  it('should load ipfs content', async () => {
    nock('https://platform.ark.io')
      .get('/api/ipfs/' + entitiesFixture.business.data.ipfsData)
      .reply(200, { data: { key: 'business' } })
      .get('/api/ipfs/' + entitiesFixture.product.data.ipfsData)
      .delay(600)
      .reply(200, { data: { key: 'product' } })
      .get('/api/ipfs/' + entitiesFixture.plugin.data.ipfsData)
      .reply(429)

    await store.dispatch('entity/fetchIpfsContent', { registrationId: entitiesFixture.business.id, ipfsHash: entitiesFixture.business.data.ipfsData })
    expect(store.state.entity.ipfsContent.result[entitiesFixture.business.id]).toEqual({ key: 'business' })

    const promise = store.dispatch('entity/fetchIpfsContent', { registrationId: entitiesFixture.product.id, ipfsHash: entitiesFixture.product.data.ipfsData })
    expect(store.state.entity.ipfsContent.loading[entitiesFixture.product.id]).toBeTruthy()
    await promise
    expect(store.state.entity.ipfsContent.loading[entitiesFixture.product.id]).toBeFalsy()
    expect(store.state.entity.ipfsContent.result[entitiesFixture.product.id]).toEqual({ key: 'product' })

    await store.dispatch('entity/fetchIpfsContent', { registrationId: entitiesFixture.plugin.id, ipfsHash: entitiesFixture.plugin.data.ipfsData })
    expect(store.state.entity.ipfsContent.failed[entitiesFixture.plugin.id]).toBeTruthy()
  })

  it('should sanitize ipfs content', async () => {
    const uploadSpy = jest.spyOn(File.prototype, 'upload').mockReturnValue()

    await store.dispatch('entity/uploadIpfsContent', { key1: null, key2: undefined, key3: {}, key4: [], key5: { a: 1, b: undefined, c: null, d: [null], e: 'value' } })
    expect(uploadSpy).toHaveBeenCalledWith({ key5: { a: 1, e: 'value' } })

    jest.clearAllMocks()
  })
})
