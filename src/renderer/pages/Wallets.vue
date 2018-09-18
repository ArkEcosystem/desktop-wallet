<template>
  <div id="wrapper">
    <main class="h-full rounded-lg">
      <WalletHeading :wallet="wallet"/>
      <WalletNavigation
        v-model="currentTab"
        :tabs="tabs"
      />
      <component
        :is="currentTab"
        :wallet="wallet"
      />
    </main>
  </div>
</template>

<script>
import WalletHeading from '@/components/Wallet/WalletHeading/WalletHeading.vue'
import WalletNavigation from '@/components/Wallet/WalletNavigation/WalletNavigation.vue'
import WalletTransactions from '@/components/Wallet/WalletTransactions/WalletTransactions.vue'
import WalletDelegates from '@/components/Wallet/WalletDelegates/WalletDelegates.vue'
import WalletStatistics from '@/components/Wallet/WalletStatistics/WalletStatistics.vue'

export default {
  components: {
    WalletHeading,
    WalletNavigation,
    WalletTransactions,
    WalletDelegates,
    WalletStatistics
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
      },
      tabs: [
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
    }
  }
}
</script>

<style>
</style>
