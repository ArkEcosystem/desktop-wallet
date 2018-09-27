<template>
  <MenuNavigation
    :id="activeWallet.address"
    :class="{
      'WalletSidebar--basic': isBasic,
      'WalletSidebar--full': !isBasic
    }"
    class="WalletSidebar justify-start"
    @input="onSelect"
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
          src="https://api.adorable.io/avatars/285/abott@adorable.png"
          width="50"
        >
        <div
          :class="{
            'text-theme-page-text': isActive,
            'text-theme-page-text-light': !isActive
          }"
          class="WalletSidebar__wallet__info flex flex-col font-semibold"
        >
          <span>{{ wallet.name }}</span>
          <span
            v-if="!isBasic"
            class="font-bold mt-2 text-xl"
          >
            {{ currency_format(currency_subToUnit(wallet.balance), { currencyFrom: 'network' }) }}
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
    isBasic: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data: () => ({
    timerId: null
  }),

  computed: {
    profileId () {
      return this.$store.getters['session/profileId']
    },

    wallets () {
      return this.$store.getters['wallet/byProfileId'](this.profileId)
    },

    activeWallet () {
      return this.wallet_fromRoute || {}
    }
  },

  async created () {
    const refreshWallet = async wallet => {
      try {
        const walletData = await this.$client.fetchWallet(wallet.address)
        if (walletData) {
          const updatedWallet = { ...wallet, ...walletData }
          this.$store.dispatch('wallet/update', updatedWallet)
        }
      } catch (error) {
        console.error(error)
        // TODO the error could mean that the wallet isn't on the blockchain yet
        // this.$error(this.$t('COMMON.FAILED_FETCH', {
        //   name: 'wallet data',
        //   msg: error.message
        // }))
      }
    }

    this.timerId = await this.$store.dispatch('timer/subscribe', {
      callback: () => {
        this.wallets.forEach(refreshWallet)
      },
      interval: 'long',
      immediate: true
    })
  },

  beforeDestroy () {
    this.$store.dispatch('timer/unsubscribe', this.timerId)
  },

  methods: {
    onSelect (address) {
      this.$emit('select', address)
      this.$router.push({ name: 'wallet-show', params: { address } })
    }
  }
}
</script>

<style lang="postcss" scoped>
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
