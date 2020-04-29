import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../../__utils__/i18n'
import TransactionConfirmVote from '@/components/Transaction/TransactionConfirm/TransactionConfirmVote'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

let wrapper
const createWrapper = (component) => {
  component = component || TransactionConfirmVote

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

describe('TransactionConfirmVote', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have vote transaction type (3)', () => {
    expect(wrapper.vm.$options.transactionType).toBe(3)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionConfirmVote')).toBe(true)
    })

    it('should output senderLabel', () => {
      expect(wrapper.find('.TransactionConfirmVote__sender .ListDividedItem__value span:first-child').text()).toBe('formatted-address-1')
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
