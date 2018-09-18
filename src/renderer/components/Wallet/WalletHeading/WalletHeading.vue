<template>
  <div class="flex px-12 py-8 justify-between w-full bg-theme-heading-background rounded-t-lg">
    <WalletHeadingInfo v-bind="wallet" />
    <WalletHeadingActions v-bind="wallet" />
  </div>
</template>

<script>
import WalletHeadingInfo from './WalletHeadingInfo.vue'
import WalletHeadingActions from './WalletHeadingActions.vue'

export default {
  name: 'WalletHeading',
  components: {
    WalletHeadingInfo,
    WalletHeadingActions
  },
  props: {
    wallet: {
      type: Object,
      required: true
    }
  }
}
</script>
