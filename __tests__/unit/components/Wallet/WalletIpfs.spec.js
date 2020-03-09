import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../__utils__/i18n'
import { WalletIpfs } from '@/components/Wallet/WalletIpfs'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

let wrapper
const createWrapper = (component) => {
  component = component || WalletIpfs

  wrapper = mount(component, {
    i18n,
    localVue,
    stubs: {
      WalletTransactions: '<div class="WalletTransactions"></div>'
    }
  })
}

describe('WalletIpfs', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should render', () => {
    expect(wrapper.contains('.WalletIpfs')).toBe(true)
  })

  it('should include WalletTransactions component', () => {
    expect(wrapper.contains('.WalletTransactions')).toBe(true)
  })

  describe('closeTransactionModal', () => {
    it('should toggle method if open', () => {
      const toggleClose = jest.fn()
      wrapper.vm.closeTransactionModal(toggleClose, true)

      expect(toggleClose).toHaveBeenCalledTimes(1)
    })

    it('should do nothing if already closed', () => {
      const toggleClose = jest.fn()
      wrapper.vm.closeTransactionModal(toggleClose, false)

      expect(toggleClose).not.toHaveBeenCalled()
    })

    it('should not toggle method if not a function', async () => {
      expect(() => { wrapper.vm.closeTransactionModal(null, true) }).not.toThrowError()
    })
  })
})
