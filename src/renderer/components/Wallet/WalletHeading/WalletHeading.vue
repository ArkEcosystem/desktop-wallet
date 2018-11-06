<template>
  <div
    :class="justifyClass"
    class="WalletHeading flex px-10 py-8 w-full bg-theme-heading-background rounded-tl-lg h-40"
  >
    <WalletHeadingInfo v-if="!secondaryButtonsVisible" />
    <WalletHeadingActions />
  </div>
</template>

<script>
import WalletHeadingInfo from './WalletHeadingInfo'
import WalletHeadingActions from './WalletHeadingActions'
import { mapGetters } from 'vuex'

export default {
  name: 'WalletHeading',

  components: {
    WalletHeadingInfo,
    WalletHeadingActions
  },

  computed: {
    ...mapGetters('wallet', ['secondaryButtonsVisible']),

    justifyClass () {
      return this.secondaryButtonsVisible ? 'justify-end' : 'justify-between'
    }
  },

  mounted () {
    this.$store.dispatch('wallet/setSecondaryButtonsVisible', false)
  }
}
</script>
