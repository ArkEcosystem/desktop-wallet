<template>
  <MenuNavigation
    :id="activeWallet.address"
    ref="MenuNavigation"
    :class="{
      'WalletSidebar--slim': isSlim,
      'WalletSidebar--full': !isSlim
    }"
    class="WalletSidebar justify-start pt-0 overflow-y-auto"
    @input="onSelect"
  >
    <!-- Placeholder wallet -->
    <MenuNavigationItem
      v-if="selectableWallets.length === 0 && !isSlim"
      id="placeholder"
      :is-disabled="true"
      class="WalletSidebar__wallet opacity-37.5 select-none"
    >
      <div
        :class="{ 'flex flex-row': !isSlim }"
        class="WalletSidebar__wallet__wrapper transition items-center w-full mx-6 py-6 truncate"
      >
        <WalletIdenticonPlaceholder
          :size="50"
          class="WalletSidebar__wallet__identicon flex-no-shrink"
        />
        <div
          class="WalletSidebar__wallet__info flex flex-col font-semibold text-theme-page-text-light overflow-hidden pl-2"
        >
          <span class="block truncate">
            {{ $t('PAGES.DASHBOARD.ADD_WALLET') }}
          </span>
          <span
            v-if="!isSlim"
            class="font-bold mt-2 text-xl"
          >
            {{ formatter_networkCurrency(0, 2) }}
          </span>
        </div>
        <img
          title="arrow"
          :src="assets_loadImage('arrows/arrow-confirmation.svg')"
          class="WalletIdenticon__placeholder__arrow ml-4"
        >
      </div>
    </MenuNavigationItem>

    <!-- Placeholder Loading Ledger Widget -->
    <MenuNavigationItem
      v-if="isLoadingLedger"
      id="isLoadingLedger"
      :is-disabled="true"
      class="WalletSidebar__wallet__ledger-loader select-none"
    >
      <div
        class="WalletSidebar__wallet__wrapper transition text-sm w-full mx-2 py-6 truncate"
      >
        <Loader />
        <div class="font-semibold text-theme-page-text">
          {{ $t('WALLET_SIDEBAR.LOADING_LEDGER') }}
        </div>
      </div>
    </MenuNavigationItem>

    <!-- List of actual wallets -->
    <MenuNavigationItem
      v-for="wallet in selectableWallets"
      :id="wallet.id"
      :key="wallet.id"
      class="WalletSidebar__wallet"
    >
      <div
        slot-scope="{ isActive }"
        :class="{ 'flex flex-row': !isSlim }"
        class="WalletSidebar__wallet__wrapper transition items-center w-full mx-6 py-6 truncate"
      >
        <WalletIdenticon
          :size="50"
          :value="wallet.address"
          class="WalletSidebar__wallet__identicon flex-no-shrink"
        />
        <div
          :class="{
            'text-theme-page-text': isActive,
            'text-theme-page-text-light': !isActive,
            'pt-2': isSlim,
            'pl-2': !isSlim
          }"
          class="WalletSidebar__wallet__info flex flex-col font-semibold overflow-hidden"
        >
          <span class="block truncate">
            {{ wallet_name(wallet.address) || wallet_truncate(wallet.address, isSlim ? 6 : 24) }}
          </span>
          <span
            v-if="!isSlim"
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
import Loader from '@/components/utils/Loader'
import { MenuNavigation, MenuNavigationItem } from '@/components/Menu'
import { sortByProp } from '@/components/utils/Sorting'
import { WalletIdenticon, WalletIdenticonPlaceholder } from '../'

export default {
  name: 'WalletSidebar',

  components: {
    Loader,
    MenuNavigation,
    MenuNavigationItem,
    WalletIdenticon,
    WalletIdenticonPlaceholder
  },

  props: {
    isSlim: {
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
      if (this.currentWallet && this.currentWallet.isContact && !this.currentWallet.isWatchOnly) {
        const contacts = this.$store.getters['wallet/contactsByProfileId'](this.session_profile.id)
        const prop = 'name'
        return contacts.slice().sort(sortByProp(prop))
      }

      const prop = 'name'
      return this.$store.getters['wallet/byProfileId'](this.session_profile.id).slice().sort(sortByProp(prop))
    },

    activeWallet () {
      return this.wallet_fromRoute || {}
    },

    currentWallet () {
      return this.wallet_fromRoute
    },

    isLoadingLedger () {
      return this.$store.getters['ledger/isLoading'] && !this.$store.getters['ledger/wallets'].length
    }
  },

  watch: {
    wallets () {
      this.$refs.MenuNavigation.collectItems()
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
          if (this.wallets.length) {
            this.$refs.MenuNavigation.switchToId(this.wallets[0].address)
          } else {
            this.$router.push({ name: 'wallets' })
          }
        }
      }
      this.selectableWallets = this.wallets
    }
  }
}
</script>

<style lang="postcss">
.WalletSidebar--full .WalletSidebar__wallet .MenuNavigationItem__border {
  @apply .hidden
}
</style>

<style lang="postcss" scoped>
.WalletSidebar--full .WalletSidebar__wallet__wrapper {
  @apply .border-b .border-theme-feature-item-alternative .text-left
}
.WalletSidebar--full .WalletSidebar__wallet__identicon {
  @apply .mr-2
}

.WalletSidebar--slim .WalletSidebar__wallet__wrapper {
  @apply .flex-col .justify-center
}
.WalletSidebar--slim .WalletSidebar__wallet__identicon {
  @apply .mb-2
}

.WalletIdenticon__placeholder {
  filter: opacity(20%)
}
.WalletIdenticon__placeholder__arrow {
  width: 40px;
  height: 40px;
  transform: scaleY(-1) scaleX(-1)
}

</style>
