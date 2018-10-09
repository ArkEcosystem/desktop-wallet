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

const sampleWalletData = {
  identicon: 'https://api.adorable.io/avatars/285/abott@adorable.png',
  address: 'AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm',
  balance: 797.8921
}

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
    const wrapper = shallowMount(WalletHeadingPrimaryActions, {
      mocks: {
        wallet_fromRoute: sampleWalletData
      }
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})

describe('WalletHeadingSecondaryActions', () => {
  it('should be instatiated', () => {
    const wrapper = shallowMount(WalletHeadingSecondaryActions, {
      mocks: {
        wallet_fromRoute: sampleWalletData
      }
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
