<template>
  <div class="WalletShow relative flex h-full">
    <WalletDetails
      ref="WalletDetails"
      class="h-full flex-1"
    />
    <WalletSidebar
      class="sticky pin min-h-full w-32 border-l border-theme-line-separator py-10 rounded-r-lg"
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

  methods: {
    loadWalletData () {
      this.$refs.WalletDetails.fetchWalletVote()
    }
  }
}
</script>
