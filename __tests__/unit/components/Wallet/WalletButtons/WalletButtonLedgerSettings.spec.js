import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../../__utils__/i18n'
import { WalletButtonLedgerSettings } from '@/components/Wallet/WalletButtons'

const i18n = useI18nGlobally()
let wrapper
beforeEach(() => {
  wrapper = shallowMount(WalletButtonLedgerSettings, {
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

describe('WalletButtonLedgerSettings', () => {
  it('should render', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
