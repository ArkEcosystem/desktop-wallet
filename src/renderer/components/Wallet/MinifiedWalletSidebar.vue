<template>
  <aside
    class="flex flex-col items-center"
  >
    <article
      v-for="wallet in wallets"
      :key="wallet.address"
      @click="selectWallet(wallet)"
    >
      {{ shortenAddress(wallet.address) }}
    </article>
  </aside>
</template>

<script>
export default {
  name: 'MinifiedWalletSidebar',
  props: {
    wallets: {
      type: Array,
      required: true
    }
  },
  methods: {
    selectWallet (wallet) {
      this.$emit('selectWallet', wallet)
    },
    shortenAddress (address) {
      return address.slice(0, 3) + '...' + address.slice(-3)
    }
  }
}
</script>
