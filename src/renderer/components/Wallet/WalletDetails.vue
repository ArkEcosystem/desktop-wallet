<template>
  <main class="h-full rounded-lg w-4/5">
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
          :wallet="wallet"
        />
      </MenuTabItem>
    </MenuTab>
  </main>
</template>

<script>
import WalletHeading from '@/components/Wallet/WalletHeading/WalletHeading.vue'
import WalletTransactions from '@/components/Wallet/WalletTransactions/WalletTransactions.vue'
import WalletDelegates from '@/components/Wallet/WalletDelegates/WalletDelegates.vue'
import WalletStatistics from '@/components/Wallet/WalletStatistics/WalletStatistics.vue'
import { MenuTab, MenuTabItem } from '@/components/Menu'

export default {
  components: {
    WalletHeading,
    WalletTransactions,
    WalletDelegates,
    WalletStatistics,
    MenuTab,
    MenuTabItem
  },

  props: {
    wallet: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      currentTab: ''
    }
  },

  computed: {
    network () {
      return this.$store.getters['session/currentNetwork']
    },

    tabs () {
      let tabs = [
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
  },

  mounted () {
    this.currentTab = this.tabs[0].component
  }
}
</script>
