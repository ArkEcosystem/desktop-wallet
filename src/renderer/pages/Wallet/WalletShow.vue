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
      selectedWallet: {}
    }
  },

  computed: {
    selectableWallets () {
      return this.profileWallets()(this.profileId())
    }
  },

  mounted () {
    this.selectedWallet = this.selectableWallets[0]
  },

  methods: {
    onSelectWallet (wallet) {
      this.selectedWallet = wallet
    },

    ...mapGetters({
      profileWallets: 'wallet/byProfileId',
      profileId: 'session/profileId'
    })
  }
}
</script>
