<template>
  <main class="WalletDetails flex flex-col">
    <WalletHeading class="sticky pin-t z-10" />
    <MenuTab
      v-model="currentTab"
      class="flex-1 overflow-y-auto"
    >
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
        />
      </MenuTabItem>
    </MenuTab>
  </main>
</template>

<script>
import { WalletHeading, WalletTransactions, WalletDelegates, WalletStatistics } from '@/components/Wallet'
import WalletSignVerify from '@/components/Wallet/WalletSignVerify'
import { MenuTab, MenuTabItem } from '@/components/Menu'

export default {
  components: {
    WalletHeading,
    WalletTransactions,
    WalletDelegates,
    WalletSignVerify,
    WalletStatistics,
    MenuTab,
    MenuTabItem
  },

  data () {
    return {
      currentTab: ''
    }
  },

  computed: {
    tabs () {
      let tabs = [
        {
          component: 'WalletTransactions',
          text: this.$t('PAGES.WALLET.TRANSACTIONS')
        },
        {
          component: 'WalletDelegates',
          text: this.$t('PAGES.WALLET.DELEGATES')
        },
        {
          component: 'WalletSignVerify',
          text: this.$t('PAGES.WALLET.SIGN_VERIFY')
        }
      ]

      // TODO enable when there is something to show
      // if (this.session_network.market && this.session_network.market.enabled) {
      //   tabs.push({
      //     component: 'WalletStatistics',
      //     text: this.$t('PAGES.WALLET.STATISTICS')
      //   })
      // }

      return tabs
    }
  },

  watch: {
    currentTab () {
      switch (this.currentTab) {
        case 'WalletTransactions':
          this.$synchronizer.focus('wallets', 'contacts')
          break
        case 'WalletDelegates':
          this.$synchronizer.focus('wallets', 'contacts', 'delegates')
          break
        case 'WalletSignVerify':
          // TODO
          break
      }
    }
  },

  mounted () {
    this.currentTab = this.tabs[0].component
  }
}
</script>

<style lang="postcss" scoped>
.WalletDetails >>> .MenuTab {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.WalletDetails >>> .MenuTab > .MenuTab__nav {
  @apply .sticky .pin-t .z-10;
}
</style>
