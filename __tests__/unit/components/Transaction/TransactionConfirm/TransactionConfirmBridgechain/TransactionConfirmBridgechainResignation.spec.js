import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../../../__utils__/i18n'
import TransactionConfirmBridgechainResignation from '@/components/Transaction/TransactionConfirm/TransactionConfirmBridgechain/TransactionConfirmBridgechainResignation'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

let wrapper
const createWrapper = (component) => {
  component = component || TransactionConfirmBridgechainResignation

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

describe('TransactionConfirmBridgechainResignation', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have magistrates transaction group (2)', () => {
    expect(wrapper.vm.$options.transactionGroup).toBe(2)
  })

  it('should have bridgechain resignation transaction type (4)', () => {
    expect(wrapper.vm.$options.transactionType).toBe(4)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionConfirmBridgechainResignation')).toBe(true)
    })

    it('should output senderLabel', () => {
      expect(wrapper.find('.TransactionConfirmBridgechainResignation__sender .ListDividedItem__value span:first-child').text()).toBe('formatted-address-1')
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
