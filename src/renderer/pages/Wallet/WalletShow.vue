<template>
  <div
    id="wrapper"
    class="flex"
  >
    <WalletDetails
      :wallet="selectedWallet"
    />
    <MinifiedWalletSidebar
      :wallets="selectableWallets"
      class="w-1/5"
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

<style scoped>
.WalletShow >>> .MenuTab {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
