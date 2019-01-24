<template>
  <div class="WalletShow relative flex h-full">
    <WalletDetails
      v-if="wallet"
      ref="WalletDetails"
      class="h-full flex-1"
      :class="{
        'w-2/3': isSidebarExpanded,
        'w-6/7': !isSidebarExpanded
      }"
    />
    <WalletSidebar
      v-if="wallet"
      class="sticky pin min-h-full border-l border-theme-line-separator py-10 rounded-r-lg hidden lg:block"
      :class="{
        'w-1/3': isSidebarExpanded,
        'w-1/7': !isSidebarExpanded
      }"
      @expanded="onExpand"
      @collapsed="onCollapse"
      @select="loadWalletData"
    />
  </div>
</template>

<script>
import { WalletSidebar, WalletDetails } from '@/components/Wallet'

export default {
  name: 'WalletShow',

  components: {
    WalletSidebar,
    WalletDetails
  },

  data: () => ({
    isSidebarExpanded: false
  }),

  computed: {
    wallet () {
      return this.wallet_fromRoute
    }
  },

  watch: {
    wallet () {
      if (!this.wallet) {
        this.$router.push({ name: 'wallets' })
      }
    }
  },

  created () {
    if (!this.wallet) {
      this.$router.push({ name: 'wallets' })
    }
  },

  methods: {
    loadWalletData () {
      this.$refs.WalletDetails.fetchWalletVote()
    },

    onCollapse () {
      this.isSidebarExpanded = false
    },
    onExpand () {
      this.isSidebarExpanded = true
    }
  }
}
</script>
