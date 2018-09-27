<template>
  <div class="WalletHeading flex px-10 py-8 justify-between w-full bg-theme-heading-background rounded-tl-lg">
    <WalletHeadingInfo />
    <WalletHeadingActions />
  </div>
</template>

<script>
import WalletHeadingInfo from './WalletHeadingInfo'
import WalletHeadingActions from './WalletHeadingActions'

export default {
  name: 'WalletHeading',

  components: {
    WalletHeadingInfo,
    WalletHeadingActions
  }
}
</script>
