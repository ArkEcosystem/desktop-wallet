<template>
  <div class="WalletShow relative flex h-full">
    <WalletDetails
      v-if="wallet"
      ref="WalletDetails"
      class="flex-1"
      :class="{
        'w-2/3': isSidebarExpanded,
        'w-7/8': !isSidebarExpanded
      }"
    />
    <WalletSidebar
      v-if="wallet"
      class="border-l border-theme-line-separator rounded-r-lg hidden lg:block"
      :class="{
        'w-1/3': isSidebarExpanded,
        'w-1/8': !isSidebarExpanded
      }"
      @expanded="onExpand"
      @collapsed="onCollapse"
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
    onCollapse () {
      this.isSidebarExpanded = false
    },
    onExpand () {
      this.isSidebarExpanded = true
    }
  }
}
</script>
