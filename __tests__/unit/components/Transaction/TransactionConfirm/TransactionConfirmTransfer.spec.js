import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../../__utils__/i18n'
import TransactionConfirmTransfer from '@/components/Transaction/TransactionConfirm/TransactionConfirmTransfer'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

let wrapper
const createWrapper = (component, transaction) => {
  component = component || TransactionConfirmTransfer
  transaction = transaction || {
    amount: (1 * 1e8).toString(),
    fee: (0.1 * 1e8).toString(),
    recipientId: 'recipient-address',
    vendorField: 'test vendorField'
  }

  wrapper = mount(component, {
    i18n,
    localVue,
    sync: false,
    provide: {
      currentWallet: {
        address: 'address-1'
      },
      transaction
    },
    mocks: {
      formatter_networkCurrency: jest.fn((amount) => amount),
      wallet_formatAddress: jest.fn((address) => `formatted-${address}`)
    }
  })
}

describe('TransactionConfirmTransfer', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have transfer transaction type (0)', () => {
    expect(wrapper.vm.$options.transactionType).toBe(0)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionConfirmTransfer')).toBe(true)
    })

    it('should output senderLabel', () => {
      expect(wrapper.find('.TransactionConfirmTransfer__sender .ListDividedItem__value span:first-child').text()).toBe('formatted-address-1')
    })

    it('should output amount', () => {
      expect(wrapper.find('.TransactionConfirmTransfer__amount .ListDividedItem__value').text()).toBe('100000000')
    })

    it('should output recipientLabel', () => {
      expect(wrapper.find('.TransactionConfirmTransfer__recipient .ListDividedItem__value span:first-child').text()).toBe('formatted-recipient-address')
    })

    it('should output vendorField', () => {
      expect(wrapper.find('.TransactionConfirmTransfer__vendorfield .ListDividedItem__value').text()).toBe('test vendorField')
    })

    it('should not output vendorField if not provided', () => {
      createWrapper(null, {
        amount: (1 * 1e8).toString(),
        fee: (0.1 * 1e8).toString(),
        recipientId: 'recipient-address'
      })

      expect(wrapper.contains('.TransactionConfirmTransfer__vendorfield')).toBe(false)
    })

    it('should output fee', () => {
      expect(wrapper.find('.TransactionConfirmTransfer__fee .ListDividedItem__value').text()).toBe('10000000')
    })
  })

  describe('computed', () => {
    describe('senderLabel', () => {
      it('should return a formatted address', () => {
        expect(wrapper.vm.senderLabel).toBe('formatted-address-1')
      })
    })

    describe('recipientLabel', () => {
      it('should return a formatted address', () => {
        expect(wrapper.vm.recipientLabel).toBe('formatted-recipient-address')
      })
    })
  })
})
