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
  it('Should display a full address', () => {
    const wrapper = mount({
      address: 'dummyAddress',
      trunc: false
    }, {
      wallet_formatAddress: address => address
    })

    expect(wrapper.text()).toEqual(expect.stringContaining('dummyAddress'))
  })

  it('Should display Second Signature for type 1', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 1 })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.SECOND_SIGNATURE'))
  })

  it('Should display Delegate Registration for type 2', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 2 })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.DELEGATE_REGISTRATION'))
  })

  it('Should display Vote for type 3', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 3, asset: { votes: ['+dummyAddress'] } })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.VOTE'))
  })

  it('Should display Unvote for type 3', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 3, asset: { votes: ['-dummyAddress'] } })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.UNVOTE'))
  })

  it('Should display Multi Signature for type 4', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 4 })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.MULTI_SIGNATURE'))
  })

  it('Should display IPFS for type 5', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 5 })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.IPFS'))
  })

  it('Should display Timelock Transfer for type 6', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 6 })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.TIMELOCK_TRANSFER'))
  })

  it('Should display Multi Payment for type 7', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 7 })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.MULTI_PAYMENT'))
  })

  it('Should display Delegate Resignation for type 8', () => {
    const wrapper = mount({ address: 'dummyAddress', type: 8 })

    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.DELEGATE_RESIGNATION'))
  })
})
