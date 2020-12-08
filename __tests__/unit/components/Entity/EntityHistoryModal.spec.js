import Vue from 'vue'
import Vuex from 'vuex'
import nock from 'nock'
import { mount } from '@vue/test-utils'
import apiClient, { client as ClientService } from '@/plugins/api-client'
import { EntityHistoryModal } from '@/components/Entity'
import store from '@/store'

import { businessRegistration } from '../../__fixtures__/store/transaction'
import { useI18nGlobally } from '../../__utils__/i18n'

const i18n = useI18nGlobally()

Vue.use(apiClient)
Vue.use(Vuex)

beforeAll(() => {
  nock.cleanAll()
  nock.disableNetConnect()
  ClientService.host = 'http://127.0.0.1'

  nock('http://127.0.0.1')
    .post('/api/transactions/search')
    .query(true)
    .reply(200, { meta: {}, data: [businessRegistration] })
    .post('/api/transactions/search')
    .query(true)
    .reply(200, { meta: {}, data: [] })
})

describe('EntityHistoryModal', () => {
  it('should render', async () => {
    const wrapper = mount(EntityHistoryModal, {
      propsData: {
        registrationId: '1'
      },
      stubs: {
        ModalWindow: true
      },
      mocks: {
        formatter_date: jest.fn(value => value)
      },
      store,
      i18n
    })

    await new Promise(resolve => setTimeout(resolve, 200))

    expect(wrapper.text()).toContain('ENTITY.ACTIONS.REGISTER')
    expect(wrapper.text()).toContain('1606902120000')
  })
})
