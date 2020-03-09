import { mount } from '@vue/test-utils'
import { useI18nGlobally } from '../../__utils__/i18n'
import { TransactionShow } from '@/components/Transaction'
import CurrencyMixin from '@/mixins/currency'
import FormatterMixin from '@/mixins/formatter'

const i18n = useI18nGlobally()

let spyT
let transaction
let wrapper
const createWrapper = (addressFromRoute) => {
  spyT = jest.fn(key => key)

  wrapper = mount(TransactionShow, {
    i18n,
    propsData: {
      transaction
    },
    mixins: [FormatterMixin],
    mocks: {
      $d: jest.fn(),
      $t: spyT,
      currency_format: jest.fn(CurrencyMixin.methods.currency_format),
      currency_subToUnit: jest.fn(CurrencyMixin.methods.currency_subToUnit),
      currency_toBuilder: jest.fn(CurrencyMixin.methods.currency_toBuilder),
      formatter_networkCurrency: jest.fn(FormatterMixin.methods.formatter_networkCurrency),
      session_network: {
        constants: {
          activeDelegates: 51
        },
        symbol: 'A',
        fractionDigits: 8,
        knownWallets: []
      },
      wallet_name: address => address,
      wallet_formatAddress: address => address,
      wallet_fromRoute: {
        address: addressFromRoute !== undefined ? addressFromRoute : 'route-address'
      }
    },
    stubs: {
      TransactionAmount: true,
      ModalWindow: true
    }
  })
}

describe('TransactionShow', () => {
  beforeEach(() => {
    transaction = {
      id: 'tx1',
      amount: 1000,
      fee: 1000,
      sender: 'sender-address',
      confirmations: 10,
      recipient: 'recipient-address',
      timestamp: new Date(),
      type: 0,
      typeGroup: 1
    }

    createWrapper()
  })

  it('should be instantiated', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should contain all items', () => {
    const findValues = wrapper.findAll('.ListDividedItem__label')
    const excludedKeys = ['type', 'typeGroup']

    expect(findValues).toHaveLength(Object.keys(transaction).filter(key => !excludedKeys.includes(key)).length)
  })

  describe('computed', () => {
    describe('amountTooltip', () => {
      beforeEach(() => {
        transaction = {
          id: 'tx1',
          amount: 1000,
          fee: 1000,
          sender: 'sender-address',
          confirmations: 10,
          recipient: 'recipient-address',
          timestamp: new Date(),
          type: 6,
          typeGroup: 1,
          asset: {
            payments: [{
              recipientId: 'payment-address-1',
              amount: 10 * 1e8
            }, {
              recipientId: 'payment-address-2',
              amount: 10 * 1e8
            }]
          }
        }
      })

      it('should return null if wallet not sender', () => {
        expect(wrapper.vm.amountTooltip).toBe(null)
      })

      it('should return null if no wallet address', () => {
        createWrapper(null)

        expect(wrapper.vm.amountTooltip).toBe(null)
      })

      it('should return null if magistrate transaction', () => {
        transaction = {
          id: 'tx1',
          amount: 1000,
          fee: 1000,
          sender: 'sender-address',
          confirmations: 10,
          recipient: 'recipient-address',
          timestamp: new Date(),
          type: 0,
          typeGroup: 2
        }

        createWrapper('sender-address')

        expect(wrapper.vm.amountTooltip).toBe(null)
      })

      it('should return null if not multipayment', () => {
        transaction = {
          id: 'tx1',
          amount: 1000,
          fee: 1000,
          sender: 'sender-address',
          confirmations: 10,
          recipient: 'recipient-address',
          timestamp: new Date(),
          type: 0,
          typeGroup: 1
        }

        createWrapper('sender-address')

        expect(wrapper.vm.amountTooltip).toBe(null)
      })

      it('should return null if sender of multipayment but not to self', () => {
        createWrapper('sender-address')

        expect(wrapper.vm.amountTooltip).toBe(null)
      })

      it('should return amount if sender of multipayment to self', () => {
        transaction.asset.payments.push({
          recipientId: 'sender-address',
          amount: 5 * 1e8
        })

        createWrapper('sender-address')

        spyT.mockClear()
        TransactionShow.computed.amountTooltip.call(wrapper.vm)

        expect(wrapper.vm.amountTooltip).toBe('TRANSACTION.ERROR.MULTI_PAYMENT_TO_SELF')
        expect(spyT).toHaveBeenCalledWith(
          'TRANSACTION.ERROR.MULTI_PAYMENT_TO_SELF',
          {
            amount: 'A 5.00'
          }
        )
      })

      it('should return amount if transaction walletAddress of multipayment to self', () => {
        transaction.walletAddress = 'sender-address'
        transaction.asset.payments.push({
          recipientId: 'sender-address',
          amount: 5 * 1e8
        })

        createWrapper()

        spyT.mockClear()
        TransactionShow.computed.amountTooltip.call(wrapper.vm)

        expect(wrapper.vm.amountTooltip).toBe('TRANSACTION.ERROR.MULTI_PAYMENT_TO_SELF')
        expect(spyT).toHaveBeenCalledWith(
          'TRANSACTION.ERROR.MULTI_PAYMENT_TO_SELF',
          {
            amount: 'A 5.00'
          }
        )
      })
    })
  })
})
