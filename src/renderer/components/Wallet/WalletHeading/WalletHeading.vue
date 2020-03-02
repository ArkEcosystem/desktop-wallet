<template>
  <div
    :class="justifyClass"
    class="WalletHeading flex px-10 py-8 w-full bg-theme-heading-background rounded-t-lg lg:rounded-tr-none h-40 overflow-hidden"
  >
    <WalletHeadingInfo
      v-if="!secondaryButtonsVisible"
      ref="heading"
    />
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
    activeWalletAddress: null
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
      if (this.activeWalletAddress !== this.currentWallet.address) {
        this.resetHeading()
      }
    }
  },

  async created () {
    this.$eventBus.on('ledger:disconnected', this.refreshWallet)
  },

  beforeDestroy () {
    this.$eventBus.off('ledger:disconnected', this.refreshWallet)
  },

  mounted () {
    this.resetHeading()
  },

  methods: {
    resetHeading () {
      this.activeWalletAddress = this.currentWallet.address
      this.$store.dispatch('wallet/setSecondaryButtonsVisible', false)
      this.refreshWallet()
    },

    refreshWallet () {
      this.$nextTick(() => {
        this.$refs.heading.refreshWallet()
      })
    }
  }
}
</script>

<style>
.WalletHeading {
  background-image: -webkit-linear-gradient(30deg, var(--theme-transaction-detail-gradient1) 130px, var(--theme-transaction-detail-gradient2) 130px);
}
</style>
