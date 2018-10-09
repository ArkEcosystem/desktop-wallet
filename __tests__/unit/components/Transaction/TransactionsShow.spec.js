import { mount } from '@vue/test-utils'
import { TransactionShow } from '@/components/Transaction'

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
      propsData: {
        transaction
      },
      mocks: {
        $d: jest.fn(),
        wallet_formatAddress: address => address
      },
      stubs: {
        'TransactionAmount': true
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
