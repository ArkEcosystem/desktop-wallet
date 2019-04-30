import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../__utils__/i18n'
import { ModalAdditionalLedgers } from '@/components/Modal'

Vue.use(Vuelidate)

const i18n = useI18nGlobally()
let wrapper
beforeEach(() => {
  wrapper = shallowMount(ModalAdditionalLedgers, {
    i18n,
    mocks: {
      $store: {
        getters: {
          'ledger/wallets' () {
            return []
          }
        }
      }
    }
  })
})

describe('ModalAdditionalLedgers', () => {
  it('should render modal', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
