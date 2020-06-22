import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../../__utils__/i18n'
import CurrencyMixin from '@/mixins/currency'
import TransactionConfirmMultiPayment from '@/components/Transaction/TransactionConfirm/TransactionConfirmMultiPayment'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

let wrapper
const createWrapper = (component, transaction) => {
  component = component || TransactionConfirmMultiPayment
  transaction = transaction || {
    asset: {
      payments: [
        {
          address: 'address-1',
          amount: (1 * 1e8).toString()
        },
        {
          address: 'address-2',
          amount: (2 * 1e8).toString()
        }
      ]
    }
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
      currency_toBuilder: jest.fn(CurrencyMixin.methods.currency_toBuilder),
      formatter_networkCurrency: jest.fn((amount) => amount),
      wallet_formatAddress: jest.fn((address) => `formatted-${address}`),
      wallet_name: jest.fn(wallet => wallet)
    },
    stubs: {
      Identicon: '<div></div>'
    }
  })
}

describe('TransactionConfirmMultiPayment', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have multi-payment transaction type (6)', () => {
    expect(wrapper.vm.$options.transactionType).toBe(6)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionConfirmMultiPayment')).toBe(true)
    })

    it('should output senderLabel', () => {
      expect(wrapper.find('.TransactionConfirmMultiPayment__sender .ListDividedItem__value span:first-child').text()).toBe('formatted-address-1')
    })

    it('should output recipients', () => {
      const recipients = wrapper.findAll('.TransactionConfirmMultiPayment__recipients .InputEditableList__list__item')

      for (const recipientIndex in wrapper.vm.transaction.asset.payments) {
        const recipient = wrapper.vm.transaction.asset.payments[recipientIndex]
        const recipientElement = recipients.at(recipientIndex)
        const addressText = recipientElement.find('.TransactionRecipientList__recipient').text().replace('TRANSACTION.RECIPIENT:', '')
        const amountText = recipientElement.find('.TransactionRecipientList__amount').text().replace('TRANSACTION.AMOUNT:', '')

        expect(addressText.trim()).toBe(recipient.address)
        expect(amountText.trim()).toBe(recipient.amount)
      }
    })
  })

  describe('computed', () => {
    describe('senderLabel', () => {
      it('should return a formatted address', () => {
        expect(wrapper.vm.senderLabel).toBe('formatted-address-1')
      })
    })

    describe('payments', () => {
      it('should return all payments', () => {
        expect(wrapper.vm.payments).toEqual([
          {
            address: 'address-1',
            amount: '100000000'
          },
          {
            address: 'address-2',
            amount: '200000000'
          }
        ])
      })
    })
  })
})
