<template>
  <MenuNavigation
    ref="MenuNavigation"
    :id="activeWallet.address"
    :class="{
      'WalletSidebar--basic': isBasic,
      'WalletSidebar--full': !isBasic
    }"
    class="WalletSidebar justify-start overflow-y-auto"
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
        class="WalletSidebar__wallet__wrapper transition flex items-center w-full mx-6 py-6 overflow-hidden"
      >
        <WalletIdenticon
          :size="50"
          :value="wallet.address"
          class="WalletSidebar__wallet__identicon"
        />
        <div
          :class="{
            'text-theme-page-text': isActive,
            'text-theme-page-text-light': !isActive
          }"
          class="WalletSidebar__wallet__info flex flex-col font-semibold overflow-hidden pt-2"
        >
          <span class="truncate block">{{ trimName(wallet.name) }}</span>
          <span
            v-if="!isBasic"
            class="font-bold mt-2 text-xl"
          >
            {{ formatter_networkCurrency(wallet.balance, 2) }}
            <!-- TODO display a +/- n ARK on recent transactions -->
          </span>
        </div>
      </div>
    </MenuNavigationItem>
  </MenuNavigation>
</template>

<script>
import { MenuNavigation, MenuNavigationItem } from '@/components/Menu'
import WalletService from '@/services/wallet'
import { sortByProp } from '@/components/utils/Sorting'
import { WalletIdenticon } from '../'

export default {
  name: 'WalletSidebar',

  components: {
    WalletIdenticon,
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
    selectableWallets: []
  }),

  computed: {
    wallets () {
      const prop = 'name'
      return this.$store.getters['wallet/byProfileId'](this.session_profile.id).slice().sort(sortByProp(prop))
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
    this.$eventBus.on('ledger:wallets-updated', this.refreshLedgerWallets)
    this.$eventBus.on('ledger:disconnected', this.ledgerDisconnected)
  },

  beforeDestroy () {
    this.$eventBus.off('ledger:wallets-updated', this.refreshLedgerWallets)
    this.$eventBus.off('ledger:disconnected', this.ledgerDisconnected)
  },

  methods: {
    onSelect (address) {
      this.$router.push({ name: 'wallet-show', params: { address } })
      this.$emit('select', address)
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
    },

    isAddress (value) {
      return WalletService.validateAddress(value, this.session_network.version)
    },

    trimName (name) {
      // If it's an address, use truncate middle
      if (this.isAddress(name)) {
        return this.wallet_truncate(name)
      }

      // Else it's a name, simply use ellipses at the end (is handled by a class)
      return name
    }
  }
}
</script>

<style lang="postcss" scoped>
.WalletSidebar--full .WalletSidebar__wallet /deep/ .MenuNavigationItem__border {
  @apply .hidden
}
.WalletSidebar--full .WalletSidebar__wallet__wrapper {
  @apply .border-b .border-theme-feature-item-alternative
}
.WalletSidebar--full .WalletSidebar__wallet__identicon {
  @apply .mr-2
}

.WalletSidebar--basic .WalletSidebar__wallet__wrapper {
  @apply .flex-col .justify-center
}
.WalletSidebar--basic .WalletSidebar__wallet__identicon {
  @apply .mb-2
}
</style>
