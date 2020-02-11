import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../../../__utils__/i18n'
import TransactionConfirmBusinessRegistration from '@/components/Transaction/TransactionConfirm/TransactionConfirmBusiness/TransactionConfirmBusinessRegistration'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

let wrapper
const createWrapper = (component, transaction) => {
  component = component || TransactionConfirmBusinessRegistration
  transaction = transaction || {
    asset: {
      businessRegistration: {
        name: 'test business',
        website: 'https://ark.io',
        vat: 'GB12345678',
        repository: 'https://github.com/arkecosystem/desktop-wallet.git'
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

describe('TransactionConfirmBusinessRegistration', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have magistrates transaction group (2)', () => {
    expect(wrapper.vm.$options.transactionGroup).toBe(2)
  })

  it('should have business registration transaction type (0)', () => {
    expect(wrapper.vm.$options.transactionType).toBe(0)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionConfirmBusinessRegistration')).toBe(true)
    })

    it('should output senderLabel', () => {
      expect(wrapper.find('.TransactionConfirmBusinessRegistration__sender .ListDividedItem__value span').text()).toBe('address-1')
    })

    it('should output name', () => {
      expect(wrapper.find('.TransactionConfirmBusinessRegistration__name .ListDividedItem__value').text()).toBe('test business')
    })

    it('should output website', () => {
      expect(wrapper.find('.TransactionConfirmBusinessRegistration__website .ListDividedItem__value').text()).toBe('https://ark.io')
    })

    it('should output vat when provided', () => {
      expect(wrapper.find('.TransactionConfirmBusinessRegistration__vat .ListDividedItem__value').text()).toBe('GB12345678')
    })

    it('should not output vat when not provided', () => {
      createWrapper(null, {
        asset: {
          businessRegistration: {
            name: 'test business',
            website: 'https://ark.io',
            repository: 'https://github.com/arkecosystem/desktop-wallet.git'
          }
        }
      })

      expect(wrapper.contains('.TransactionConfirmBusinessRegistration__vat')).toBe(false)
    })

    it('should output repo when provided', () => {
      expect(wrapper.find('.TransactionConfirmBusinessRegistration__repository .ListDividedItem__value').text()).toBe('https://github.com/arkecosystem/desktop-wallet.git')
    })

    it('should not output repo when not provided', () => {
      createWrapper(null, {
        asset: {
          businessRegistration: {
            name: 'test business',
            website: 'https://ark.io',
            vat: 'GB12345678'
          }
        }
      })

      expect(wrapper.contains('.TransactionConfirmBusinessRegistration__repository')).toBe(false)
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
