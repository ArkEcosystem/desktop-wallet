import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../../__utils__/i18n'
import TransactionConfirmMultiSignature from '@/components/Transaction/TransactionConfirm/TransactionConfirmMultiSignature'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

let wrapper
const createWrapper = (component) => {
  component = component || TransactionConfirmMultiSignature

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

describe('TransactionConfirmMultiSignature', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have multi-signature transaction type (4)', () => {
    expect(wrapper.vm.$options.transactionType).toBe(4)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionConfirmMultiSignature')).toBe(true)
    })

    it('should output senderLabel', () => {
      expect(wrapper.find('.TransactionConfirmMultiSignature__sender .ListDividedItem__value span:first-child').text()).toBe('formatted-address-1')
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
