import { createLocalVue, shallowMount } from '@vue/test-utils'
import installI18n from '../../__utils__/i18n'
import WalletAddress from '@/components/Wallet/WalletAddress'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

const mount = (propsData, mocks) => {
  propsData = typeof propsData === 'object' ? propsData : {}
  mocks = typeof mocks === 'object' ? mocks : {}

  mocks = {
    session_network: {
      knownWallets: []
    },
    $store: {
      getters: {
        'delegate/byPublicKey': jest.fn()
      }
    },
    ...mocks
  }

  return shallowMount(WalletAddress, {
    propsData,
    i18n,
    localVue,
    mocks
  })
}

describe('WalletAddress', () => {
  it('should display a full address', () => {
    const wrapper = mount({
      address: 'dummyAddress',
      trunc: false
    }, {
      wallet_formatAddress: address => address
    })

    expect(wrapper.text()).toEqual(expect.stringContaining('dummyAddress'))
  })

  it('should display Second Signature for type 1', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 1 })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.SECOND_SIGNATURE'))
  })

  it('should display Delegate Registration for type 2', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 2 })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.DELEGATE_REGISTRATION'))
  })

  it('should display Vote for type 3', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 3, asset: { votes: ['+dummyAddress'] } })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.VOTE'))
  })

  it('should display Unvote for type 3', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 3, asset: { votes: ['-dummyAddress'] } })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.UNVOTE'))
  })

  it('should display delegate name for vote', () => {
    const props = {
      address: 'dummyAddress',
      type: 3,
      asset: {
        votes: ['+dummyPublicKey1']
      }
    }
    const wrapper = mount(props, {
      $store: {
        getters: {
          'delegate/byPublicKey': (publicKey) => {
            if (publicKey === 'dummyPublicKey1') {
              return 'dummyDelegate1'
            } else if (publicKey === 'dummyPublicKey2') {
              return 'dummyDelegate2'
            }
          }
        }
      }
    })

    expect(wrapper.vm.votedDelegate).toEqual('dummyDelegate1')
    wrapper.setProps({ ...props, asset: { votes: ['+dummyPublicKey2'] } })
    expect(wrapper.vm.votedDelegate).toEqual('dummyDelegate2')
  })

  it('should display delegate name for unvote', () => {
    const props = {
      address: 'dummyAddress',
      type: 3,
      asset: {
        votes: ['-dummyPublicKey1']
      }
    }
    const wrapper = mount(props, {
      $store: {
        getters: {
          'delegate/byPublicKey': (publicKey) => {
            if (publicKey === 'dummyPublicKey1') {
              return 'dummyDelegate1'
            } else if (publicKey === 'dummyPublicKey2') {
              return 'dummyDelegate2'
            }
          }
        }
      }
    })

    expect(wrapper.vm.votedDelegate).toEqual('dummyDelegate1')
    wrapper.setProps({ ...props, asset: { votes: ['-dummyPublicKey2'] } })
    expect(wrapper.vm.votedDelegate).toEqual('dummyDelegate2')
  })

  it('should display Multi Signature for type 4', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 4 })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.MULTI_SIGNATURE'))
  })

  it('should display IPFS for type 5', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 5 })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.IPFS'))
  })

  it('should display Multi Payment for type 6', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 6 })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.MULTI_PAYMENT'))
  })

  it('should display Delegate Resignation for type 7', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 7 })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.DELEGATE_RESIGNATION'))
  })

  it('should display HTLC Lock for type 8', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 8 })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.HTLC_LOCK'))
  })

  it('should display HTLC Claim for type 9', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 9 })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.HTLC_CLAIM'))
  })

  it('should display HTLC Refund for type 10', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 10 })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.HTLC_REFUND'))
  })
})
