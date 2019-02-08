<template>
  <MenuNavigation
    :id="activeWallet.address"
    ref="MenuNavigation"
    :class="{
      'WalletSidebar--collapsed': !isExpanded,
      'WalletSidebar--expanded': isExpanded
    }"
    class="WalletSidebar justify-start pt-0"
    @input="onSelect"
  >
    <div
      v-if="showMenu"
      class="WalletSidebar__menu flex flex-row px-4 pt-4 justify-around"
    >
      <div
        v-if="!isExpanded"
        v-tooltip="{
          content: $t('WALLET_SIDEBAR.FILTER')
        }"
        class="WalletSidebar__menu__button"
        @click="toggleFilters"
      >
        <SvgIcon
          name="filter"
          view-box="0 0 13 20"
        />
      </div>
      <div
        v-if="!isExpanded"
        v-tooltip="{
          content: $t('WALLET_SIDEBAR.EXPAND')
        }"
        class="WalletSidebar__menu__button"
        @click="expand"
      >
        <SvgIcon
          name="expand"
          view-box="0 0 18 14"
        />
      </div>
      <div
        v-if="isExpanded"
        class="WalletSidebar__menu__button"
        @click="toggleFilters"
      >
        <div class="flex items-center">
          <SvgIcon
            name="filter"
            view-box="0 0 13 20"
          />
          <span v-if="isExpanded">
            {{ $t('WALLET_SIDEBAR.FILTER') }}
          </span>
        </div>
      </div>
      <div
        v-if="isExpanded"
        class="WalletSidebar__menu__button"
        @click="collapse"
      >
        <div class="flex items-center">
          <SvgIcon
            name="collapse"
            view-box="0 0 18 14"
          />
          <span v-if="isExpanded">
            {{ $t('WALLET_SIDEBAR.HIDE') }}
          </span>
        </div>
      </div>
    </div>

    <WalletSidebarFilters
      v-if="isFiltersVisible"
      :has-contacts="hasContactsOnly"
      :has-ledger="isLedgerConnected"
      :is-sidebar-expanded="isExpanded"
      :outside-click="true"
    />

    <!-- Placeholder wallet -->
    <MenuNavigationItem
      v-if="isExpanded && !isLoadingLedger && selectableWallets.length === 0"
      id="placeholder"
      :is-disabled="true"
      class="WalletSidebar__wallet opacity-37.5 select-none"
    >
      <div
        class="WalletSidebar__wallet__wrapper flex flex-row transition items-center w-full mx-6 py-6 truncate"
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
          <span class="font-bold mt-2 text-xl">
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
    <div
      :class="{ 'opacity-0': isResizing }"
      class="WalletSidebar__container"
    >
      <MenuNavigationItem
        v-for="wallet in selectableWallets"
        :id="wallet.id"
        :key="wallet.id"
        class="WalletSidebar__wallet"
      >
        <div
          slot-scope="{ isActive }"
          :class="{ 'flex flex-row': isExpanded }"
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
              'pt-2': !isExpanded,
              'pl-2': isExpanded
            }"
            class="WalletSidebar__wallet__info flex flex-col font-semibold overflow-hidden"
          >
            <span
              class="flex items-center"
              :class="{ 'justify-center': !isExpanded }"
            >
              <span class="block truncate">
                {{ wallet_name(wallet.address) || wallet_truncate(wallet.address, !isExpanded ? 6 : (wallet.isLedger ? 12 : 24)) }}
              </span>
              <span
                v-if="wallet.isLedger"
                v-tooltip="!isExpanded ? $t('COMMON.LEDGER_WALLET') : ''"
                :class="{ 'w-5': !isExpanded }"
                class="ledger-badge"
              >
                {{ !isExpanded ? $t('COMMON.LEDGER').charAt(0) : $t('COMMON.LEDGER') }}
              </span>
            </span>
            <span
              v-if="isExpanded"
              class="font-bold mt-2 text-xl"
            >
              {{ formatter_networkCurrency(wallet.balance, 2) }}
              <!-- TODO display a +/- n ARK on recent transactions -->
            </span>
          </div>
        </div>
      </MenuNavigationItem>
    </div>
  </MenuNavigation>
</template>

<script>
import { uniqBy } from 'lodash'
import Loader from '@/components/utils/Loader'
import { MenuNavigation, MenuNavigationItem } from '@/components/Menu'
import { WalletIdenticon, WalletIdenticonPlaceholder } from '../'
import SvgIcon from '@/components/SvgIcon'
import WalletSidebarFilters from './WalletSidebarFilters'

export default {
  name: 'WalletSidebar',

  components: {
    Loader,
    MenuNavigation,
    MenuNavigationItem,
    SvgIcon,
    WalletIdenticon,
    WalletIdenticonPlaceholder,
    WalletSidebarFilters
  },

  props: {
    showExpanded: {
      type: Boolean,
      required: false,
      default: false
    },
    showMenu: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data: () => ({
    hasBeenExpanded: false,
    isFiltersVisible: false,
    isResizing: false,
    selectableWallets: []
  }),

  computed: {
    hasContactsOnly () {
      return this.currentWallet && this.currentWallet.isContact && !this.currentWallet.isWatchOnly
    },

    wallets () {
      return this.hasContactsOnly
        ? this.$store.getters['wallet/contactsByProfileId'](this.session_profile.id)
        : this.$store.getters['wallet/byProfileId'](this.session_profile.id)
    },

    activeWallet () {
      return this.wallet_fromRoute || {}
    },

    currentWallet () {
      return this.wallet_fromRoute
    },

    isExpanded () {
      return this.showExpanded || this.hasBeenExpanded
    },

    isLedgerConnected () {
      return this.$store.getters['ledger/isConnected']
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
    this.refreshWallets()

    this.$eventBus.on('ledger:wallets-updated', this.refreshLedgerWallets)
    this.$eventBus.on('ledger:disconnected', this.ledgerDisconnected)
    this.$eventBus.on('wallet:wallet-updated', this.refreshWallets)
  },

  beforeDestroy () {
    this.$eventBus.off('ledger:wallets-updated', this.refreshLedgerWallets)
    this.$eventBus.off('ledger:disconnected', this.ledgerDisconnected)
    this.$eventBus.off('wallet:wallet-updated', this.refreshWallets)
  },

  methods: {
    collapse () {
      this.toggleExpanded(false)
    },

    expand () {
      this.toggleExpanded(true)
    },

    toggleExpanded (toExpand) {
      this.isResizing = true
      setTimeout(() => {
        setTimeout(() => (this.isResizing = false), 125)

        this.hasBeenExpanded = toExpand
        this.$emit(toExpand ? 'expanded' : 'collapsed')
      }, 75)
    },

    onSelect (address) {
      this.$router.push({ name: 'wallet-show', params: { address } })
      this.$emit('select', address)
    },

    toggleFilters () {
      this.isFiltersVisible = !this.isFiltersVisible
    },

    refreshLedgerWallets () {
      const ledgerWallets = !this.hasContactsOnly
        ? this.$store.getters['ledger/wallets']
        : []

      this.selectableWallets = this.wallet_sortByName(uniqBy([
        ...ledgerWallets,
        ...this.wallets
      ], 'address'))
    },

    refreshWallets () {
      if (this.isLedgerConnected) {
        this.refreshLedgerWallets()
      } else {
        this.selectableWallets = this.wallet_sortByName(this.wallets)
      }
    },

    ledgerDisconnected () {
      this.refreshWallets()

      if (!this.activeWallet || !this.activeWallet.address || this.activeWallet.isLedger) {
        if (this.$refs.MenuNavigation && this.$route.name === 'wallet-show') {
          if (this.selectableWallets.length) {
            this.$refs.MenuNavigation.switchToId(this.selectableWallets[0].address)
          } else {
            this.$router.push({ name: 'wallets' })
          }
        }
      }
    }
  }
}
</script>

<style lang="postcss">
.WalletSidebar--expanded .WalletSidebar__wallet .MenuNavigationItem__border {
  @apply .hidden
}
</style>

<style lang="postcss" scoped>
.WalletSidebar {
  transition: width 0.1s ease-out;
  @apply .overflow-y-auto
}
.WalletSidebar__container {
  transition: opacity 0.1s;
}
.WalletSidebar__menu {
  border-bottom: 0.08rem solid var(--theme-feature-item-alternative);
  @apply .sticky .z-10 .bg-theme-feature .pin-t
}
.WalletSidebar__menu__button {
  @apply .cursor-pointer .fill-current .text-theme-option-button-text .py-2 .my-6;
  transition: color 0.4s;
  align-self: center;
}
.WalletSidebar__menu__button:hover {
  @apply .text-theme-button-text;
}
.WalletSidebar__menu__button span {
  @apply .pl-3 .font-bold;
}
.WalletSidebar__menu__separator__line {
  border-right: 0.08rem solid var(--theme-feature-item-alternative);
  @apply .h-12 .my-4
}

.WalletSidebar--expanded .WalletSidebar__wallet__wrapper {
  @apply .border-b .border-theme-feature-item-alternative .text-left
}
.WalletSidebar--expanded .WalletSidebar__wallet__identicon {
  @apply .mr-2
}

.WalletSidebar--collapsed .WalletSidebar__wallet__wrapper {
  @apply .flex-col .justify-center .border-b .border-theme-feature
}
.WalletSidebar--collapsed .WalletSidebar__wallet__identicon {
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
