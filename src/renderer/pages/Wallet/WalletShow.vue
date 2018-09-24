<template>
  <div class="WalletShow relative flex h-full">
    <WalletDetails class="h-full flex-1" />
    <WalletSidebar class="sticky pin min-h-full w-1/7 border-l border-theme-line-separator py-10 rounded-r-lg" />
  </div>
</template>

<script>
import { WalletSidebar, WalletDetails } from '@/components/Wallet'

export default {
  name: 'WalletShow',

  components: {
    WalletSidebar,
    WalletDetails
  }
}
</script>
