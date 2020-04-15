import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../../__utils__/i18n'
import TransactionConfirmDelegateRegistration from '@/components/Transaction/TransactionConfirm/TransactionConfirmDelegateRegistration'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

let wrapper
const createWrapper = (component, transaction) => {
  component = component || TransactionConfirmDelegateRegistration
  transaction = transaction || {
    asset: {
      delegate: {
        username: 'test_delegate'
      }
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
      wallet_formatAddress: jest.fn((address) => `formatted-${address}`)
    }
  })
}

describe('TransactionConfirmDelegateRegistration', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have delegate registration transaction type (2)', () => {
    expect(wrapper.vm.$options.transactionType).toBe(2)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionConfirmDelegateRegistration')).toBe(true)
    })

    it('should output senderLabel', () => {
      expect(wrapper.find('.TransactionConfirmDelegateRegistration__sender .ListDividedItem__value span:first-child').text()).toBe('formatted-address-1')
    })

    it('should output username', () => {
      expect(wrapper.find('.TransactionConfirmDelegateRegistration__username .ListDividedItem__value').text()).toBe('test_delegate')
    })
  })

  describe('computed', () => {
    describe('senderLabel', () => {
      it('should return a formatted address', () => {
        expect(wrapper.vm.senderLabel).toBe('formatted-address-1')
      })
    })

    describe('username', () => {
      it('should return username if set', () => {
        expect(wrapper.vm.username).toBe('test_delegate')
      })

      it('should return empty string if no asset', () => {
        createWrapper(null, {})

        expect(wrapper.vm.username).toBe('')
      })

      it('should return empty string if no delegate', () => {
        createWrapper(null, {
          asset: {}
        })

        expect(wrapper.vm.username).toBe('')
      })
    })
  })
})
