import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import WalletHeading from '@/components/Wallet/WalletHeading/WalletHeading'
import WalletHeadingActions from '@/components/Wallet/WalletHeading/WalletHeadingActions'
import WalletHeadingPrimaryActions from '@/components/Wallet/WalletHeading/WalletHeadingPrimaryActions'
import WalletHeadingSecondaryActions from '@/components/Wallet/WalletHeading/WalletHeadingSecondaryActions'

const localVue = createLocalVue()

localVue.use(Vuex)

const store = new Vuex.Store({
  state: {}
})

describe('WalletHeading', () => {
  it('should be instatiated', () => {
    const wrapper = shallowMount(WalletHeading, { store, localVue })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})

describe('WalletHeadingActions', () => {
  it('should be instatiated', () => {
    const wrapper = shallowMount(WalletHeadingActions, { store, localVue })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})

describe('WalletHeadingPrimaryActions', () => {
  it('should be instatiated', () => {
    const wrapper = shallowMount(WalletHeadingPrimaryActions)
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})

describe('WalletHeadingSecondaryActions', () => {
  it('should be instatiated', () => {
    const wrapper = shallowMount(WalletHeadingSecondaryActions)
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
