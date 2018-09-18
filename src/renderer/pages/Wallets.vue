<template>
  <div id="wrapper">
    <main class="h-full rounded-lg">
      <WalletHeading :wallet="wallet"/>
      <MenuTab v-model="currentTab">
        <MenuTabItem
          v-for="tab in tabs"
          :key="tab.component"
          :label="tab.text"
          :tab="tab.component"
        >
          <component
            :is="tab.component"
            :wallet="wallet" />
        </MenuTabItem>
      </MenuTab>
    </main>
  </div>
</template>

<script>
import WalletHeading from '@/components/Wallet/WalletHeading/WalletHeading.vue'
import WalletTransactions from '@/components/Wallet/WalletTransactions/WalletTransactions.vue'
import WalletDelegates from '@/components/Wallet/WalletDelegates/WalletDelegates.vue'
import WalletStatistics from '@/components/Wallet/WalletStatistics/WalletStatistics.vue'
import { MenuTab, MenuTabItem } from '@/components/Menu'

export default {
  name: 'Wallets',

  components: {
    WalletHeading,
    WalletTransactions,
    WalletDelegates,
    WalletStatistics,
    MenuTab,
    MenuTabItem
  },

  data () {
    return {
      currentTab: 'WalletTransactions',
      wallet: {
        identicon: 'https://api.adorable.io/avatars/285/arkwallet.png',
        address: 'AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm',
        arkBalance: 7978921,
        transactions: [
          {
            transactionId: 'dase32a',
            date: 'Jun 12 09:34:27',
            type: 'received',
            theirAddress: 'A892j1e21',
            tags: '',
            amount: '22.39'
          },
          {
            transactionId: 'e2o1jjel21a',
            date: 'Jun 12 09:35:27',
            type: 'sent',
            theirAddress: 'Apo24ieq234',
            tags: '',
            amount: '325.52'
          },
          {
            transactionId: 'oij32ejowai',
            date: 'Jun 12 09:34:27',
            type: 'sent',
            theirAddress: 'Aio2u34j3q',
            tags: '',
            amount: '23502.08'
          },
          {
            transactionId: 'fi3j2iodjsa',
            date: 'Jun 15 09:33:27',
            type: 'received',
            theirAddress: 'A892j1e21',
            tags: '',
            amount: '100.00'
          },
          {
            transactionId: 'lkj234kl32j',
            date: 'Jun 12 09:34:27',
            type: 'received',
            theirAddress: 'Afjsadf0983',
            tags: '',
            amount: '80.00'
          }
        ]
      }
    }
  },

  computed: {
    network () {
      return this.$store.getters['session/currentNetwork']
    },

    tabs () {
      const tabs = [
        {
          component: 'WalletTransactions',
          text: this.$t('PAGES.WALLET.TRANSACTIONS')
        },
        {
          component: 'WalletDelegates',
          text: this.$t('PAGES.WALLET.DELEGATES')
        }
      ]

      if (this.network.market && this.network.market.enabled) {
        tabs.push({
          component: 'WalletStatistics',
          text: this.$t('PAGES.WALLET.STATISTICS')
        })
      }

      return tabs
    }
  }
}
</script>

<style>
</style>
