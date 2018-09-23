<template>
  <MenuNavigation
    :id="walletId"
    :class="{
      'WalletSidebar--basic': isBasic,
      'WalletSidebar--full': !isBasic
    }"
    class="WalletSidebar justify-start"
    @input="emitSelect"
  >
    <MenuNavigationItem
      v-for="wallet in wallets"
      :id="wallet.id"
      :key="wallet.id"
      class="WalletSidebar__wallet"
    >
      <div
        slot-scope="{ isActive }"
        class="WalletSidebar__wallet__wrapper transition flex items-center w-full mx-6 py-6"
      >
        <img
          :src="assets_loadImage('pages/new-profile-avatar.svg')"
          width="50"
        >
        <div
          :class="{
            'text-theme-page-text': isActive,
            'text-theme-page-text-light': !isActive
          }"
          class="WalletSidebar__wallet__info flex flex-col font-semibold"
        >
          <span>{{ wallet.address | truncateMiddle(addressLength) }}</span>
          <span
            v-if="!isBasic"
            class="font-bold mt-2 text-xl"
          >
            <!-- FIXME localize + currency + filter -->
            {{ $n(wallet.balance, 'currency') }}
            <!-- TODO display a +/- n ARK on recent transactions -->
          </span>
        </div>
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
    },
    isBasic: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  computed: {
    addressLength () {
      return this.isBasic ? 6 : 12
    }
  },

  methods: {
    emitSelect (address) {
      this.$emit('select', this.wallets.find(w => w.address === address))
    }
  }
}
</script>

<style scoped>
.WalletSidebar--full .WalletSidebar__wallet >>> .MenuNavigationItem__border {
  @apply .hidden
}
.WalletSidebar--full .WalletSidebar__wallet__wrapper {
  @apply .border-b .border-theme-feature-item-alternative
}
.WalletSidebar--full .WalletSidebar__wallet img {
  @apply .mr-3
}

.WalletSidebar--basic .WalletSidebar__wallet__wrapper {
  @apply .flex-col .justify-center
}
.WalletSidebar--basic .WalletSidebar__wallet img {
  @apply .mb-3
}
</style>
