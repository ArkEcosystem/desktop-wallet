<template>
  <MenuNavigation
    ref="MenuNavigation"
    :id="activeWallet.address"
    :class="{
      'WalletSidebar--basic': isBasic,
      'WalletSidebar--full': !isBasic
    }"
    class="WalletSidebar justify-start"
    @input="onSelect"
  >
    <MenuNavigationItem
      v-for="wallet in selectableWallets"
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
          <span v-if="wallet.isContact">({{ $t('COMMON.CONTACT') }})</span>
          <span
            v-if="!isBasic"
            class="font-bold mt-2 text-xl"
          >
            {{ formatter_networkCurrency(wallet.balance) }}
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
    timerId: null,
    selectableWallets: []
  }),

  computed: {
    wallets () {
      const wallets = this.$store.getters['wallet/byProfileId'](this.session_profile.id)
      const contacts = this.$store.getters['wallet/contactsByProfileId'](this.session_profile.id)
      return [...wallets, ...contacts]
    },

    activeWallet () {
      return this.wallet_fromRoute || {}
    }
  },

  async created () {
    this.selectableWallets = this.wallets

    if (this.$store.getters['ledger/isConnected']) {
      this.refreshLedgerWallets()
    }
    this.$eventBus.$on('ledger:wallets-updated', this.refreshLedgerWallets)
    this.$eventBus.$on('ledger:disconnected', this.ledgerDisconnected)

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
    this.$eventBus.$off('ledgerWalletsUpdated', this.refreshLedgerWallets)
    this.$eventBus.$off('ledgerDisconnected', this.ledgerDisconnected)
  },

  methods: {
    onSelect (address) {
      this.$emit('select', address)
      this.$router.push({ name: 'wallet-show', params: { address } })
    },

    refreshLedgerWallets () {
      const ledgerWallets = this.$store.getters['ledger/wallets']
      this.selectableWallets = [...ledgerWallets, ...this.wallets]
    },

    ledgerDisconnected () {
      if (!this.activeWallet || !this.activeWallet.address || this.activeWallet.isLedger) {
        if (this.$refs.MenuNavigation && this.$route.name === 'wallet-show') {
          this.$refs.MenuNavigation.switchToId(this.wallets[0].address)
        }
      }
      this.selectableWallets = this.wallets
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
