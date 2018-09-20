<template>
  <aside
    class="flex flex-col items-center bg-theme-feature"
  >
    <article
      v-for="wallet in wallets"
      :key="wallet.address"
      @click="emitSelect(wallet)"
    >
      <span class="font-semibold">{{ wallet.address | truncateMiddle(6) }}</span>
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
    emitSelect (wallet) {
      this.$emit('select', wallet)
    }
  }
}
</script>
