import Vue from 'vue'
import Vuex from 'vuex'
import DelegateModule from '@/store/modules/delegate'
import delegates, { delegate1, delegate2 } from '../../__fixtures__/store/delegate'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    delegate: DelegateModule,
    session: {
      namespaced: true,
      getters: {
        network () {
          return {
            id: 'abc'
          }
        }
      }
    }
  },
  strict: true
})

beforeEach(() => {
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

  it('should return false when no address is given', () => {
    expect(store.getters['delegate/byAddress']()).toBe(false)
  })

  it('should get a single delegate by its public key', () => {
    expect(store.getters['delegate/byPublicKey']('02bf72c578a12c35a97ca1230b93017161ee42c3f0ab82f6fe7c95b3b43561a076')).toEqual(delegate2)
  })

  it('should return false when no public key is given', () => {
    expect(store.getters['delegate/byPublicKey']()).toBe(false)
  })
})
