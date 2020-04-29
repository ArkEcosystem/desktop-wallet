import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../../__utils__/i18n'
import TransactionConfirmSecondSignature from '@/components/Transaction/TransactionConfirm/TransactionConfirmSecondSignature'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

let wrapper
const createWrapper = (component) => {
  component = component || TransactionConfirmSecondSignature

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

describe('TransactionConfirmSecondSignature', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have second signature transaction type (1)', () => {
    expect(wrapper.vm.$options.transactionType).toBe(1)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionConfirmSecondSignature')).toBe(true)
    })

    it('should output senderLabel', () => {
      expect(wrapper.find('.TransactionConfirmSecondSignature__sender .ListDividedItem__value span:first-child').text()).toBe('formatted-address-1')
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
