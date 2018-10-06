import { createLocalVue, shallowMount } from '@vue/test-utils'
import VueI18n from 'vue-i18n'
import WalletAddress from '@/components/Wallet/WalletAddress'

const localVue = createLocalVue()
localVue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: { 'en': {} },
  silentTranslationWarn: true
})

describe('WalletAddress', () => {
  it('Should display a full address', () => {
    const wrapper = shallowMount(WalletAddress, {
      propsData: { address: 'dummyAddress', trunc: false },
      i18n,
      localVue,
      mocks: {
        wallet_formatAddress: address => address
      }
    })
    expect(wrapper.text()).toEqual(expect.stringContaining('dummyAddress'))
  })

  it('Should display Second Signature for type 1', () => {
    const wrapper = shallowMount(WalletAddress, {
      propsData: { address: 'dummyAddress', type: 1 },
      i18n,
      localVue
    })
    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.SECOND_SIGNATURE'))
  })

  it('Should display Delegate Registration for type 2', () => {
    const wrapper = shallowMount(WalletAddress, {
      propsData: { address: 'dummyAddress', type: 2 },
      i18n,
      localVue
    })
    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.DELEGATE_REGISTRATION'))
  })

  it('Should display Vote for type 3', () => {
    const wrapper = shallowMount(WalletAddress, {
      propsData: { address: 'dummyAddress', type: 3, asset: { votes: ['+dummyAddress'] } },
      i18n,
      localVue
    })
    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.VOTE'))
  })

  it('Should display Unvote for type 3', () => {
    const wrapper = shallowMount(WalletAddress, {
      propsData: { address: 'dummyAddress', type: 3, asset: { votes: ['-dummyAddress'] } },
      i18n,
      localVue
    })
    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.UNVOTE'))
  })

  it('Should display Multi Signature for type 4', () => {
    const wrapper = shallowMount(WalletAddress, {
      propsData: { address: 'dummyAddress', type: 4 },
      i18n,
      localVue
    })
    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.MULTI_SIGNATURE'))
  })

  it('Should display IPFS for type 5', () => {
    const wrapper = shallowMount(WalletAddress, {
      propsData: { address: 'dummyAddress', type: 5 },
      i18n,
      localVue
    })
    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.IPFS'))
  })

  it('Should display Timelock Transfer for type 6', () => {
    const wrapper = shallowMount(WalletAddress, {
      propsData: { address: 'dummyAddress', type: 6 },
      i18n,
      localVue
    })
    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.TIMELOCK_TRANSFER'))
  })

  it('Should display Multi Payment for type 7', () => {
    const wrapper = shallowMount(WalletAddress, {
      propsData: { address: 'dummyAddress', type: 7 },
      i18n,
      localVue
    })
    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.MULTI_PAYMENT'))
  })

  it('Should display Delegate Resignation for type 8', () => {
    const wrapper = shallowMount(WalletAddress, {
      propsData: { address: 'dummyAddress', type: 8 },
      i18n,
      localVue
    })
    expect(wrapper.text()).toEqual(expect.stringContaining('TRANSACTION.TYPE.DELEGATE_RESIGNATION'))
  })
})
