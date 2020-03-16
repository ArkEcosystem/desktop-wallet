<template>
  <MenuNavigation
    :id="currentWallet.address"
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
      <template v-if="!isExpanded">
        <div
          v-tooltip="{
            content: $t('WALLET_SIDEBAR.FILTER')
          }"
          class="WalletSidebar__menu__button"
          :class="areFiltersActive ? 'WalletSidebar__menu__button--active' : ''"
          @click="toggleFilters"
        >
          <SvgIcon
            name="filter"
            view-box="0 0 13 20"
          />
        </div>
        <div
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
      </template>
      <template v-else-if="isExpanded">
        <div
          class="WalletSidebar__menu__button"
          :class="areFiltersActive ? 'WalletSidebar__menu__button--active' : ''"
          @click="toggleFilters"
        >
          <div class="flex items-center">
            <SvgIcon
              name="filter"
              view-box="0 0 13 20"
            />
            <span>
              {{ $t('WALLET_SIDEBAR.FILTER') }}
            </span>
          </div>
        </div>
        <div
          class="WalletSidebar__menu__button"
          @click="collapse"
        >
          <div class="flex items-center">
            <SvgIcon
              name="collapse"
              view-box="0 0 18 14"
            />
            <span>
              {{ $t('WALLET_SIDEBAR.HIDE') }}
            </span>
          </div>
        </div>
      </template>
    </div>

    <WalletSidebarFilters
      v-if="isFiltersVisible"
      :has-contacts="hasContactsOnly"
      :has-ledger="isLedgerConnected"
      :is-sidebar-expanded="isExpanded"
      :outside-click="true"
      :filters="filters"
      :search-query="searchQuery"
      :sort-order="sortOrder"
      @filter="applyFilters"
      @sort="applySortOrder"
      @search="applySearch"
      @close="closeFilters"
    />

    <!-- Placeholder wallet -->
    <MenuNavigationItem
      v-if="isExpanded && !isLoadingLedger && availableWallets.length === 0"
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
        <div class="font-semibold text-theme-page-text text-center">
          {{ $t('WALLET_SIDEBAR.LOADING_LEDGER') }}
        </div>
      </div>
    </MenuNavigationItem>

    <!-- List of actual wallets -->
    <TransitionGroup
      :class="{ 'opacity-0': isResizing }"
      class="WalletSidebar__container"
      name="WalletSidebar__container"
      tag="div"
    >
      <!-- This element is necessary for the transition group -->
      <div
        v-for="wallet in selectableWallets"
        :key="wallet.id"
      >
        <MenuNavigationItem
          :id="wallet.id"
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
    </TransitionGroup>
  </MenuNavigation>
</template>

<script>
import { uniqBy } from 'lodash'
import { sortByProps } from '@/utils'
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
    },
    showFilteredWallets: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data: () => ({
    hasBeenExpanded: false,
    isFiltersVisible: false,
    isResizing: false,
    searchQuery: ''
  }),

  computed: {
    areFiltersActive () {
      return !!this.searchQuery.length || Object.values(this.filters).some(value => !!value)
    },

    currentWallet () {
      return this.wallet_fromRoute || {}
    },

    hasContactsOnly () {
      return this.currentWallet && this.currentWallet.isContact && !this.currentWallet.isWatchOnly
    },

    isExpanded () {
      return this.showExpanded || this.hasBeenExpanded
    },

    isLedgerConnected () {
      return this.$store.getters['ledger/isConnected']
    },

    isLoadingLedger () {
      return this.$store.getters['ledger/isLoading'] && !this.ledgerWallets.length
    },

    wallets () {
      return this.hasContactsOnly
        ? this.$store.getters['wallet/contactsByProfileId'](this.session_profile.id)
        : this.$store.getters['wallet/byProfileId'](this.session_profile.id)
    },

    ledgerWallets () {
      return this.$store.getters['ledger/wallets']
    },

    /**
     * Wallets before filtering
     */
    availableWallets () {
      let wallets = this.wallets

      if (this.isLedgerConnected && !this.hasContactsOnly) {
        wallets = uniqBy([
          ...this.ledgerWallets,
          ...wallets
        ], 'address')
      }

      return wallets
    },

    selectableWallets () {
      const wallets = this.showFilteredWallets ? this.filterWallets(this.availableWallets) : this.availableWallets
      return this.sortWallets(wallets)
    },

    filters: {
      get () {
        return this.$store.getters['session/walletSidebarFilters'] || {}
      },
      set (filters) {
        this.$store.dispatch('session/setWalletSidebarFilters', filters)

        this.$store.dispatch('profile/update', {
          ...this.session_profile,
          walletSidebarFilters: filters
        })
      }
    },

    sortOrder: {
      get () {
        return this.$store.getters['session/walletSidebarSortParams'] ||
          { field: 'name', type: 'asc' }
      },
      set (sortParams) {
        this.$store.dispatch('session/setWalletSidebarSortParams', sortParams)

        this.$store.dispatch('profile/update', {
          ...this.session_profile,
          walletSidebarSortParams: sortParams
        })
      }
    }
  },

  watch: {
    wallets () {
      this.$refs.MenuNavigation.collectItems()
    }
  },

  async created () {
    this.$eventBus.on('ledger:disconnected', this.ledgerDisconnected)
  },

  beforeDestroy () {
    this.$eventBus.off('ledger:disconnected', this.ledgerDisconnected)
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
      if (!address) {
        throw new Error('Selecting an address is required')
      }

      this.$router.push({ name: 'wallet-show', params: { address } })
    },

    closeFilters (context) {
      // To not hide the filters when expanding or collapsing
      const wasToggleExpand = context.path.some(path => {
        if (path.className) {
          return path.className.toString().includes('WalletSidebar__menu__button')
        }
      })

      if (!wasToggleExpand) {
        this.isFiltersVisible = false
      }
    },

    toggleFilters () {
      this.isFiltersVisible = !this.isFiltersVisible
    },

    applyFilters (filters) {
      this.filters = filters
    },

    filterWallets (wallets) {
      let filtered = wallets

      if (this.filters.hideLedger) {
        filtered = filtered.filter(wallet => !wallet.isLedger)
      }
      if (this.filters.hideEmpty) {
        filtered = filtered.filter(wallet => wallet.balance > 0)
      }
      if (this.searchQuery) {
        filtered = filtered.filter(({ address, balance, name }) => {
          let match = [
            address,
            balance.toString()
          ].some(text => text.includes(this.searchQuery))

          if (!match) {
            const alternativeName = this.wallet_name(address)
            const names = alternativeName
              ? [name, alternativeName]
              : [name]

            const query = this.searchQuery.toLowerCase()
            match = names.some(name => name.toLowerCase().includes(query))
          }

          return match
        })
      }

      return filtered
    },

    applySearch (query) {
      this.searchQuery = query
    },

    applySortOrder (params) {
      this.sortOrder = params
    },

    sortWallets (wallets) {
      const { field, type } = this.sortOrder

      if (field === 'name') {
        wallets = this.wallet_sortByName(wallets)
      } else if (field === 'balance') {
        wallets = wallets.sort(sortByProps(['balance', 'name', 'address']))
      } else {
        throw new Error(`Sorting by "${field}" is not implemented`)
      }

      return type === 'asc' ? wallets : wallets.reverse()
    },

    ledgerDisconnected () {
      const hasCurrentWallet = this.currentWallet && this.currentWallet.address

      if (!hasCurrentWallet || this.currentWallet.isLedger) {
        if (this.$refs.MenuNavigation && this.$route.name === 'wallet-show') {
          if (this.selectableWallets.length) {
            this.$refs.MenuNavigation.switchToItem(this.selectableWallets[0].address)
          } else {
            this.$router.push({ name: 'wallets' })
          }
        }
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.WalletSidebar {
  transition: width 0.1s ease-out;
  @apply .overflow-y-auto
}
.WalletSidebar__menu {
  border-bottom: 0.08rem solid var(--theme-feature-item-alternative);
  @apply .sticky .z-10 .bg-theme-feature .pin-t
}
.WalletSidebar__menu__button {
  @apply .cursor-pointer .fill-current .text-theme-option-button-text .p-2 .my-6;
  transition: color 0.4s;
  align-self: center;
}
.WalletSidebar__menu__button:hover {
  @apply .text-theme-button-text;
}
.WalletSidebar__menu__button span {
  @apply .pl-3 .font-bold;
}
.WalletSidebar__menu__button--active {
  @apply .text-theme-feature-item-indicator;
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

.WalletSidebar__container {
  transition: opacity 0.5s;
}
.WalletSidebar__container-move {
  transition: transform 0.3s;
}
</style>
