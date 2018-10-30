import { shallowMount } from '@vue/test-utils'
import { useI18nGlobally } from '../../__utils__/i18n'
import { WalletDelegates } from '@/components/Wallet'

const i18n = useI18nGlobally()

describe('WalletDelegates', () => {
  it('should render', () => {
    const wrapper = shallowMount(WalletDelegates, {
      i18n,
      stubs: {
        'vue-good-table': true
      }
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
