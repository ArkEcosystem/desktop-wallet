import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../../__utils__/i18n'
import { WalletButtonAdditionalLedgers } from '@/components/Wallet/WalletButtons'

const i18n = useI18nGlobally()
let wrapper
beforeEach(() => {
  wrapper = shallowMount(WalletButtonAdditionalLedgers, {
    i18n,
    mocks: {
      $store: {
        getters: {
          'ledger/isConnected' () {
            return true
          }
        }
      }
    }
  })
})

describe('WalletButtonAdditionalLedgers', () => {
  it('should render modal', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
