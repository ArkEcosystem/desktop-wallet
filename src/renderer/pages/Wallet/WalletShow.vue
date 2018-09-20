<template>
  <div class="WalletShow relative flex h-full">
    <WalletDetails
      :wallet="selectedWallet"
      class="h-full flex-1"
    />
    <MinifiedWalletSidebar
      :wallets="selectableWallets"
      class="sticky pin min-h-full w-1/6 border-l border-theme-line-separator"
      @selectWallet="onSelectWallet"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MinifiedWalletSidebar from '@/components/Wallet/MinifiedWalletSidebar.vue'
import WalletDetails from '@/components/Wallet/WalletDetails.vue'

export default {
  name: 'WalletShow',

  components: {
    MinifiedWalletSidebar,
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
