<template>
  <MenuNavigation
    :id="walletId"
    class="WalletSidebar py-10 rounded-r-lg justify-start"
    @input="emitSelect"
  >
    <MenuNavigationItem
      v-for="wallet in wallets"
      :id="wallet.id"
      :key="wallet.id"
      class="h-32"
    >
      <div
        slot-scope="{ isActive }"
        class="flex flex-col items-center justify-center text-inherit"
      >
        <img
          :src="assets_loadImage('pages/new-profile-avatar.svg')"
          width="50"
          class="mb-2"
        >
        <span
          :class="{
            'text-theme-page-text': isActive,
            'text-theme-page-text-light': !isActive
          }"
          class="font-semibold"
        >
          {{ wallet.address | truncateMiddle(6) }}
        </span>
      </div>
    </MenuNavigationItem>
  </MenuNavigation>
</template>

<script>
import { MenuNavigation, MenuNavigationItem } from '@/components/Menu'

export default {
  name: 'WalletSidebar',

  components: {
    MenuNavigation,
    MenuNavigationItem
  },

  props: {
    walletId: {
      type: String,
      required: false,
      default: null
    },
    wallets: {
      type: Array,
      required: true
    }
  },

  methods: {
    emitSelect (address) {
      this.$emit('select', this.wallets.find(w => w.address === address))
    }
  }
}
</script>
