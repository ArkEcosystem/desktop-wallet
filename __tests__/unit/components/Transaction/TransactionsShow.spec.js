import { mount } from '@vue/test-utils'
import { useI18nGlobally } from '../../__utils__/i18n'
import TransactionShow from '@/components/Transaction/TransactionShow'
import FormatterMixin from '@/mixins/formatter'

const i18n = useI18nGlobally()

describe('TransactionShow', () => {
  let transaction
  let wrapper

  beforeEach(() => {
    transaction = {
      id: 1,
      amount: 1000,
      fee: 1000,
      sender: 'abc',
      confirmations: 10,
      recipient: 'abc',
      timestamp: new Date()
    }

    wrapper = mount(TransactionShow, {
      i18n,
      propsData: {
        transaction
      },
      mixins: [FormatterMixin],
      mocks: {
        $d: jest.fn(),
        wallet_formatAddress: address => address
      },
      stubs: {
        'TransactionAmount': true,
        'ModalWindow': true
      }
    })
  })

  it('should be instantiated', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should contain all items', () => {
    const findValues = wrapper.findAll('.ListDividedItem__label')
    expect(findValues).toHaveLength(Object.keys(transaction).length)
  })
})
