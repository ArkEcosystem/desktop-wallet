import { shallowMount } from '@vue/test-utils'
import WalletHeading from '@/components/Wallet/WalletHeading/WalletHeading'
import WalletHeadingInfo from '@/components/Wallet/WalletHeading/WalletHeadingInfo'
import WalletHeadingActions from '@/components/Wallet/WalletHeading/WalletHeadingActions'
import WalletHeadingPrimaryActions from '@/components/Wallet/WalletHeading/WalletHeadingPrimaryActions'
import WalletHeadingSecondaryActions from '@/components/Wallet/WalletHeading/WalletHeadingSecondaryActions'

const sampleWalletData = {
  address: 'AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm',
  balance: 7978921
}

describe('WalletHeading', () => {
  it('should be instatiated', () => {
    const wrapper = shallowMount(WalletHeading)
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})

describe('WalletHeadingInfo', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(WalletHeadingInfo, {
      mocks: {
        wallet_fromRoute: sampleWalletData
      }
    })
  })

  it('should be instatiated', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  it('should display the identicon', () => {
    const identicon = wrapper.find('.WalletHeading__identicon')
    expect(identicon.isVisible()).toBeTrue()
  })

  it('should display the address', () => {
    const address = wrapper.find('.WalletHeading__address')
    expect(address.isVisible()).toBeTrue()
    expect(address.text()).toBe(sampleWalletData.address)
  })
})

describe('WalletHeadingActions', () => {
  it('should be instatiated', () => {
    const wrapper = shallowMount(WalletHeadingActions)
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
