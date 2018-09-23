<template>
  <div class="WalletShow relative flex h-full">
    <WalletDetails
      :wallet="selectedWallet"
      class="h-full flex-1"
    />
    <WalletSidebar
      :wallet-id="selectedWallet.id"
      :wallets="selectableWallets"
      class="sticky pin min-h-full w-1/7 border-l border-theme-line-separator py-10 rounded-r-lg"
      @select="onSelectWallet"
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

  data () {
    return {
      selectedWallet: {},
      updatedWallet: {}
    }
  },

  computed: {
    profileId () {
      return this.$store.getters['session/profileId']
    },

    selectableWallets () {
      return this.$store.getters['wallet/byProfileId'](this.profileId)
    }
  },

  created () {
    const address = this.$route.params.address
    this.selectedWallet = this.$store.getters['wallet/byAddress'](address)
  },

  methods: {
    onSelectWallet (wallet) {
      this.selectedWallet = wallet
    }
  }
}
</script>
