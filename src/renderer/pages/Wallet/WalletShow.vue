<template>
  <div class="WalletShow relative flex h-full">
    <WalletDetails
      :wallet="selectedWallet"
      class="h-full flex-1"
    />
    <WalletSidebar
      :wallets="selectableWallets"
      class="sticky pin min-h-full w-1/7 border-l border-theme-line-separator"
      @select="onSelectWallet"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    ...mapGetters({
      curentProfileId: 'session/profileId',
      profileWallets: 'wallet/byProfileId'
    }),

    selectableWallets () {
      return this.profileWallets(this.currentProfileId)
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
