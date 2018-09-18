import { mount } from '@vue/test-utils'

import WalletNavigation from '@/components/Wallet/WalletNavigation/WalletNavigation'

const tabs = [
  {
    component: 'WalletTransactions',
    text: 'Transactions'
  },
  {
    component: 'WalletDelegates',
    text: 'Delegates'
  },
  {
    component: 'WalletStatistics',
    text: 'Statistics'
  }
]

let walletNavComponent

beforeAll(() => {
  walletNavComponent = mount(WalletNavigation, {
    propsData: {
      tabs: tabs,
      currentTab: tabs[0].component
    }
  })
})

it('can toggle to different tabs', () => {
  const componentToToggleTo = tabs[1].component

  walletNavComponent.find(`.${componentToToggleTo}`).trigger('click')

  expect(walletNavComponent.emitted().changeTab).toBeTruthy()
  expect(walletNavComponent.emitted().changeTab[0]).toContain(componentToToggleTo)
})
