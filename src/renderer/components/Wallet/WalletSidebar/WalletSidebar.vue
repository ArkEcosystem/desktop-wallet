<template>
  <MenuNavigation
    :id="activeWallet.address"
    ref="MenuNavigation"
    :class="{
      'WalletSidebar--collapsed': !isExpanded,
      'WalletSidebar--expanded': isExpanded
    }"
    class="WalletSidebar justify-start pt-0 overflow-y-auto"
    @input="onSelect"
  >
    <div
      v-if="showMenu"
      class="WalletSidebar__menu flex flex-row m-4 justify-around"
    >
      <div class="WalletSidebar__menu__button">
        <SvgIcon
          name="filter"
          view-box="0 0 13 20"
        />
      </div>
      <div class="WalletSidebar__menu__separator">
        <div class="WalletSidebar__menu__separator__line" />
      </div>
      <div
        v-if="!isExpanded"
        class="WalletSidebar__menu__button"
      >
        <SvgIcon
          name="expand"
          view-box="0 0 18 14"
        />
      </div>
      <div
        v-if="isExpanded"
        class="WalletSidebar__menu__button"
      >
        <SvgIcon
          name="collapse"
          view-box="0 0 18 14"
        />
      </div>
    </div>
    <!--  -->
    <!-- <div -->
    <!--   v-if="showMenu" -->
    <!--   class="flex flex-col m-4" -->
    <!-- > -->
    <!--   <p>Filter by balance</p> -->
    <!--   <p>Hide Ledger wallets</p> -->
    <!-- </div> -->
    <!--  -->
    <!-- <div -->
    <!--   v-if="showMenu" -->
    <!--   class="flex flex-col m-4" -->
    <!-- > -->
    <!--   <div>Sort by address</div> -->
    <!--   <p>Sort by name</p> -->
    <!--   <p>Sort by balance</p> -->
    <!-- </div> -->

    <!-- Placeholder wallet -->
    <MenuNavigationItem
      v-if="isExpanded && selectableWallets.length === 0"
      id="placeholder"
      :is-disabled="true"
      class="WalletSidebar__wallet opacity-37.5 select-none"
    >
      <div
        :class="{ 'flex flex-row': isExpanded }"
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
            v-if="isExpanded"
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
          <span class="block truncate">
            {{ wallet_name(wallet.address) || wallet_truncate(wallet.address, isExpanded ? 24 : 6) }}
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
  </MenuNavigation>
</template>

<script>
import Loader from '@/components/utils/Loader'
import { MenuNavigation, MenuNavigationItem } from '@/components/Menu'
import { sortByProp } from '@/components/utils/Sorting'
import { WalletIdenticon, WalletIdenticonPlaceholder } from '../'
// import { InputText } from '@/components/Input'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'WalletSidebar',

  components: {
    // InputText,
    Loader,
    MenuNavigation,
    MenuNavigationItem,
    SvgIcon,
    WalletIdenticon,
    WalletIdenticonPlaceholder
  },

  props: {
    isExpanded: {
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
    selectableWallets: []
  }),

  computed: {
    wallets () {
      const wallets = this.currentWallet && this.currentWallet.isContact && !this.currentWallet.isWatchOnly
        ? this.$store.getters['wallet/contactsByProfileId'](this.session_profile.id)
        : this.$store.getters['wallet/byProfileId'](this.session_profile.id)

      const prop = 'name'
      return wallets.slice().sort(sortByProp(prop))
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
.WalletSidebar--expanded .WalletSidebar__wallet .MenuNavigationItem__border {
  @apply .hidden
}
</style>

<style lang="postcss" scoped>
.WalletSidebar__menu {
  border-bottom: 0.08rem solid var(--theme-feature-item-alternative);
}
.WalletSidebar__menu__button {
  @apply .cursor-pointer .fill-current .text-theme-option-button-text .py-2 .my-6;
  transition: opacity 0.4s;
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
  @apply .flex-col .justify-center
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
