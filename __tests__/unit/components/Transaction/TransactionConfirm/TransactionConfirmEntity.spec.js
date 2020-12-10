import Vue from 'vue'
import Vuex from 'vuex'
import apiClient from '@/plugins/api-client'
import { mount } from '@vue/test-utils'
import { useI18nGlobally } from '../../../__utils__/i18n'
import { TransactionConfirmEntityRegistration, TransactionConfirmEntityUpdate, TransactionConfirmEntityResignation } from '@/components/Transaction/TransactionConfirm/Entity'
import store from '@/store'

import { business } from '../../../__fixtures__/store/entity'
import { businessRegistration } from '../../../__fixtures__/store/transaction'
import { network1 } from '../../../__fixtures__/store/network'
import { profile1 } from '../../../__fixtures__/store/profile'

Vue.use(Vuex)
Vue.use(apiClient)

const i18n = useI18nGlobally()

const createWrapper = (Component) => {
  return mount(Component, {
    i18n,
    propsData: {
      transaction: {
        ...businessRegistration,
        entityForm: {
          entityName: 'test'
        }
      },
      currentWallet: {
        address: 'address-1'
      }
    },
    store,
    mocks: {
      wallet_formatAddress: jest.fn((address) => `formatted-${address}`),
      formatter_networkCurrency: jest.fn((value) => value)
    }
  })
}

beforeAll(() => {
  store.commit('network/SET_ALL', [network1])
  store.commit('profile/CREATE', profile1)
  store.commit('session/SET_PROFILE_ID', profile1.id)

  store.commit('entity/SET_ALL_ENTITIES', { entities: [business], networkId: network1.id })
})

describe('Registration', () => {
  it('should have entity action (0)', () => {
    const wrapper = createWrapper(TransactionConfirmEntityRegistration)
    expect(wrapper.vm.$options.entityAction).toBe(0)
  })
})

describe('Update', () => {
  it('should have entity action (1)', () => {
    const wrapper = createWrapper(TransactionConfirmEntityUpdate)
    expect(wrapper.vm.$options.entityAction).toBe(1)
  })
})

describe('Resignation', () => {
  it('should have entity action (2)', () => {
    const wrapper = createWrapper(TransactionConfirmEntityResignation)
    expect(wrapper.vm.$options.entityAction).toBe(2)
  })
})
