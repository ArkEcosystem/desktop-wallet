<template>
  <main class="WalletDetails flex flex-col">
    <WalletHeading
      :wallet="wallet"
      class="sticky pin-t z-10"
    />
    <MenuTab
      v-model="currentTab"
      class="flex-1 overflow-y-auto">
      <MenuTabItem
        v-for="tab in tabs"
        :key="tab.component"
        :label="tab.text"
        :tab="tab.component"
      >
        <component
          slot-scope="{ isActive }"
          :is="tab.component"
          :is-active="isActive"
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

<style scoped>
.WalletDetails >>> .MenuTab {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.WalletDetails >>> .MenuTab > .MenuTab__nav {
  @apply .sticky .pin-t .z-10;
}
</style>
