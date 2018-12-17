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

  data: () => ({
    activeWallet: null
  }),

  computed: {
    ...mapGetters('wallet', ['secondaryButtonsVisible']),

    currentWallet () {
      return this.wallet_fromRoute
    },

    justifyClass () {
      return this.secondaryButtonsVisible ? 'justify-end' : 'justify-between'
    }
  },

  watch: {
    currentWallet () {
      if (this.activeWallet !== this.currentWallet.id) {
        this.resetHeading()
      }
    }
  },

  mounted () {
    this.resetHeading()
  },

  methods: {
    resetHeading () {
      this.activeWallet = this.currentWallet
      this.$store.dispatch('wallet/setSecondaryButtonsVisible', false)
    }
  }
}
</script>

<style>
.WalletHeading {
  background-image: -webkit-linear-gradient(30deg, var(--theme-transaction-detail-gradient1) 130px, var(--theme-transaction-detail-gradient2) 130px);
}
</style>
