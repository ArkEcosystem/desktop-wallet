import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../../../__utils__/i18n'
import TransactionConfirmBusinessResignation from '@/components/Transaction/TransactionConfirm/TransactionConfirmBusiness/TransactionConfirmBusinessResignation'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

let wrapper
const createWrapper = (component) => {
  component = component || TransactionConfirmBusinessResignation

  wrapper = mount(component, {
    i18n,
    localVue,
    sync: false,
    provide: {
      currentWallet: {
        address: 'address-1'
      }
    },
    mocks: {
      wallet_formatAddress: jest.fn((address) => `formatted-${address}`)
    }
  })
}

describe('TransactionConfirmBusinessResignation', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have magistrates transaction group (2)', () => {
    expect(wrapper.vm.$options.transactionGroup).toBe(2)
  })

  it('should have business resignation transaction type (1)', () => {
    expect(wrapper.vm.$options.transactionType).toBe(1)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionConfirmBusinessResignation')).toBe(true)
    })

    it('should output senderLabel', () => {
      expect(wrapper.find('.TransactionConfirmBusinessResignation__sender .ListDividedItem__value span:first-child').text()).toBe('formatted-address-1')
    })
  })

  describe('computed', () => {
    describe('senderLabel', () => {
      it('should return a formatted address', () => {
        expect(wrapper.vm.senderLabel).toBe('formatted-address-1')
      })
    })
  })
})
