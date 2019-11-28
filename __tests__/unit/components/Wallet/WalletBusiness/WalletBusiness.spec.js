import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../../__utils__/i18n'
import { WalletBusiness } from '@/components/Wallet/WalletBusiness'
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

let wrapper
const createWrapper = (component, propsData) => {
  component = component || WalletBusiness
  propsData = propsData || {
    value: ''
  }

  wrapper = mount(component, {
    i18n,
    localVue,
    propsData,
    sync: false,
    stubs: {
      WalletBusinessBridgechains: `<div>
        <div class="WalletBusinessBridgechains"></div>
      </div>`
    }
  })
}

describe('WalletBusiness', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should render', () => {
    expect(wrapper.contains('.WalletBusiness')).toBe(true)
  })

  it('should include WalletBusinessBridgechains component', () => {
    expect(wrapper.contains('.WalletBusinessBridgechains')).toBe(true)
  })

  it('should initiate with bridgechain lookup', () => {
    expect(wrapper.vm.bridgechainRegistration).toEqual({
      type: TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_REGISTRATION,
      group: TRANSACTION_GROUPS.MAGISTRATE
    })
  })

  describe('closeTransactionModal', () => {
    it('should toggle modal if open', () => {
      const toggleMethod = jest.fn()
      wrapper.vm.closeTransactionModal(toggleMethod, true)

      expect(toggleMethod).toHaveBeenCalled()
    })

    it('should not toggle modal if closed', () => {
      const toggleMethod = jest.fn()
      wrapper.vm.closeTransactionModal(toggleMethod, false)

      expect(toggleMethod).not.toHaveBeenCalled()
    })
  })
})
