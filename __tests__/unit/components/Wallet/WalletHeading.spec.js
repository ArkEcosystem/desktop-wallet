import { mount } from '@vue/test-utils'

import WalletHeading from '@/components/Wallet/WalletHeading/WalletHeading'

const sampleWalletData = {
  identicon: 'https://api.adorable.io/avatars/285/arkwallet.png',
  address: 'AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm',
  arkBalance: 7978921
}

let heading

describe('the WalletHeading component', () => {
  beforeEach(() => {
    heading = mount(WalletHeading, {
      propsData: {
        wallet: sampleWalletData
      }
    })
  })

  it("displays the wallet's identicon", () => {
    const identicon = heading.find('.WalletHeading__identicon')

    expect(identicon.attributes().src).toBe(sampleWalletData.identicon)
  })

  it("displays the wallet's address", () => {
    const address = heading.find('.WalletHeading__address')

    expect(address.text()).toBe(sampleWalletData.address)
  })

  it("displays the wallet's ARK balance", () => {
    const arkBalance = heading.find('.WalletHeading__arkBalance')

    const formattedBalance = arkBalance.text().split(',').join('')

    expect(formattedBalance).toContain(sampleWalletData.arkBalance.toString())
  })
})
