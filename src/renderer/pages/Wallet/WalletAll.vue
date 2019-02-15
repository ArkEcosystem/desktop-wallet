<template>
  <div class="WalletAll">
    <div class="WalletAll__heading px-8 py-6 mb-3">
      <div class="flex flex-row items-center">
        <div class="hidden sm:block">
          <ProfileAvatar
            :profile="session_profile"
            letter-size="2xl"
            class="relative"
          >
            <span
              :class="{
                'bg-theme-feature-item-selected text-theme-feature-item-selected-text ': session_profile.avatar,
                'bg-theme-button text-theme-button-text': !session_profile.avatar
              }"
              class="WalletAll__avatar__sign"
              name="point"
              view-box="0 0 14 14"
            >
              {{ currentNetwork.symbol }}
            </span>
          </ProfileAvatar>
        </div>
        <div class="flex-col">
          <div>
            <h2 class="mb-2">
              {{ session_profile.name | truncate(20) }}
            </h2>
            <span class="font-semibold text-theme-page-text-light">
              {{ $t('PAGES.WALLET_ALL.TOTAL_BALANCE') }}
            </span>
          </div>
          <div>
            <span class="transition text-xl sm:text-2xl font-bold">
              {{ formatter_networkCurrency(totalBalance) }}
            </span>
            <span
              v-if="isMarketEnabled"
              class="WalletAll__balance__alternative text-sm font-bold text-theme-page-text-light ml-1"
            >
              {{ alternativeTotalBalance }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-row items-center">
        <div
          v-show="isLedgerConnected"
          v-tooltip="$t('PAGES.WALLET_ALL.CACHE_LEDGER_INFO')"
          class="WalletAll__ledger__cache flex flex-col items-center px-6"
        >
          <span>
            {{ $t('PAGES.WALLET_ALL.CACHE_LEDGER') }}
          </span>
          <ButtonSwitch
            ref="cache-ledger-switch"
            :is-active="sessionLedgerCache"
            class="mt-3"
            @change="setLedgerCache"
          />
        </div>
        <WalletButtonCreate class="pl-6 pr-6" />
        <WalletButtonImport class="pl-6" />
      </div>
    </div>

    <div class="flex flex-1 bg-theme-feature rounded-lg p-10 overflow-y-auto">
      <div class="block w-full">
        <div class="WalletAll__header">
          <h3 class="flex items-center">
            {{ $t('PAGES.WALLET_ALL.HEADER') }}
            <span
              v-if="isLedgerLoading"
              v-tooltip="{
                content: $t('PAGES.WALLET_ALL.LOADING_LEDGER'),
                placement: 'right'
              }"
              class="inline-flex items-center self-stretch ml-3 pr-2"
            >
              <SvgIcon
                class="rotate-360"
                name="update"
                view-box="0 0 16 14"
              />
            </span>
          </h3>

          <ButtonLayout
            :grid-layout="hasWalletGridLayout"
            @click="toggleWalletLayout()"
          />
        </div>

        <div
          v-if="isLoading"
          class="h-full flex items-center"
        >
          <div class="m-auto">
            <Loader />
          </div>
        </div>

        <div
          v-if="hasWalletGridLayout && !isLoading"
          class="WalletAll__grid mt-10"
        >
          <div
            v-if="isLedgerLoading"
            class="WalletAll__grid__wallet"
          >
            <Loader />
            <div class="text-center mt-4">
              {{ $t('PAGES.WALLET_ALL.LOADING_LEDGER') }}
            </div>
          </div>

          <div
            v-for="wallet in selectableWallets"
            :key="wallet.id"
            class="WalletAll__grid__wallet"
            @click="showWallet(wallet.id)"
          >
            <div class="WalletAll__grid__wallet__wrapper">
              <div class="flex flex-col">
                <div class="flex items-center">
                  <WalletIdenticon
                    :value="wallet.address"
                    :size="60"
                    class="identicon cursor-pointer"
                  />

                  <div class="flex flex-col justify-center overflow-hidden pl-4">
                    <div class="flex items-center">
                      <span
                        v-tooltip="{
                          content: !wallet.name && wallet_name(wallet.address) ? $t('COMMON.NETWORK_NAME') : '',
                          placement: 'right'
                        }"
                        class="WalletAll__grid__wallet__name font-semibold text-base truncate block pr-1 cursor-default"
                        @click.stop
                      >
                        {{ wallet.name || wallet_name(wallet.address) || wallet_truncate(wallet.address) }}
                      </span>
                      <span
                        v-if="wallet.isLedger"
                        class="ledger-badge"
                      >
                        {{ $t('COMMON.LEDGER') }}
                      </span>
                    </div>
                    <span
                      class="font-bold mt-2 text-lg cursor-default"
                      @click.stop
                    >
                      {{ formatter_networkCurrency(wallet.balance, 2) }}
                    </span>
                  </div>
                </div>

                <div class="flex flex-row w-full justify-end">
                  <button
                    v-if="!wallet.isLedger"
                    class="WalletAll__grid__wallet__select font-semibold flex text-xs cursor-pointer hover:underline hover:text-red text-theme-page-text-light mt-4"
                    @click.stop="openRemovalConfirmation(wallet)"
                  >
                    {{ $t('PAGES.WALLET_ALL.DELETE_WALLET') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else-if="!hasWalletGridLayout && !isLoading"
          class="WalletAll__tabular mt-10"
        >
          <WalletTable
            :has-pagination="false"
            :is-loading="false"
            :rows="selectableWallets"
            :show-voted-delegates="showVotedDelegates"
            :total-rows="selectableWallets.length"
            :sort-query="sortParams"
            :no-data-message="$t('TABLE.NO_WALLETS')"
            @remove-row="onRemoveWallet"
            @rename-row="onRenameWallet"
            @on-sort-change="onSortChange"
          />
        </div>
      </div>
    </div>

    <WalletRemovalConfirmation
      v-if="walletToRemove"
      :wallet="walletToRemove"
      @cancel="hideRemovalConfirmation"
      @removed="removeWallet(walletToRemove)"
    />

    <WalletRenameModal
      v-if="walletToRename"
      :wallet="walletToRename"
      @cancel="hideRenameModal"
      @renamed="onWalletRenamed"
    />
  </div>
</template>

<script>
import { clone, some, uniqBy } from 'lodash'
import { ButtonLayout, ButtonSwitch } from '@/components/Button'
import Loader from '@/components/utils/Loader'
import { ProfileAvatar } from '@/components/Profile'
import SvgIcon from '@/components/SvgIcon'
import { WalletIdenticon, WalletRemovalConfirmation, WalletRenameModal, WalletButtonCreate, WalletButtonImport } from '@/components/Wallet'
import WalletTable from '@/components/Wallet/WalletTable'

export default {
  name: 'WalletAll',

  components: {
    ButtonLayout,
    ButtonSwitch,
    Loader,
    ProfileAvatar,
    SvgIcon,
    WalletButtonCreate,
    WalletButtonImport,
    WalletIdenticon,
    WalletRemovalConfirmation,
    WalletRenameModal,
    WalletTable
  },

  data: () => ({
    selectableWallets: [],
    walletToRemove: null,
    walletToRename: null,
    isLoading: false
  }),

  computed: {
    alternativeCurrency () {
      return this.$store.getters['session/currency']
    },

    alternativeTotalBalance () {
      const balance = this.currency_subToUnit(this.totalBalance)
      return this.currency_format(balance * this.price, { currency: this.alternativeCurrency })
    },

    isMarketEnabled () {
      return this.currentNetwork.market.enabled
    },

    currentNetwork () {
      return this.session_network
    },

    totalBalance () {
      return this.$store.getters['profile/balanceWithLedger'](this.session_profile.id)
    },

    price () {
      return this.$store.getters['market/lastPrice']
    },

    wallets () {
      const wallets = this.$store.getters['wallet/byProfileId'](this.session_profile.id)
      return this.wallet_sortByName(wallets)
    },

    isLedgerLoading () {
      return this.$store.getters['ledger/isLoading'] && !this.$store.getters['ledger/wallets'].length
    },

    isLedgerConnected () {
      return this.$store.getters['ledger/isConnected']
    },

    hasWalletGridLayout () {
      return this.$store.getters['session/hasWalletGridLayout']
    },

    sessionLedgerCache: {
      get () {
        return this.$store.getters['session/ledgerCache']
      },
      set (enabled) {
        this.$store.dispatch('session/setLedgerCache', enabled)
        const profile = clone(this.session_profile)
        profile.ledgerCache = enabled
        this.$store.dispatch('profile/update', profile)
        if (enabled) {
          this.$store.dispatch('ledger/cacheWallets')
        } else {
          this.$store.dispatch('ledger/clearWalletCache')
        }
      }
    },

    walletLayout: {
      get () {
        return this.$store.getters['session/walletLayout']
      },
      set (layout) {
        this.$store.dispatch('session/setWalletLayout', layout)
        const profile = clone(this.session_profile)
        profile.walletLayout = layout
        this.$store.dispatch('profile/update', profile)
      }
    },

    sortParams: {
      get () {
        return this.$store.getters['session/walletSortParams']
      },
      set (params) {
        this.$store.dispatch('session/setWalletSortParams', params)
        const profile = clone(this.session_profile)
        profile.walletSortParams = params
        this.$store.dispatch('profile/update', profile)
      }
    },

    showVotedDelegates () {
      return some(this.selectableWallets, wallet => wallet.hasOwnProperty('votedDelegate'))
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$synchronizer.focus('wallets')
    })
  },

  async created () {
    this.isLoading = true

    this.selectableWallets = this.wallets

    if (this.$store.getters['ledger/isConnected']) {
      this.refreshLedgerWallets()
    }
    this.$eventBus.on('ledger:wallets-updated', this.refreshLedgerWallets)
    this.$eventBus.on('ledger:disconnected', this.ledgerDisconnected)

    this.isLoading = false
  },

  methods: {
    hideRemovalConfirmation () {
      this.walletToRemove = null
    },

    hideRenameModal () {
      this.walletToRename = null
    },

    async refreshLedgerWallets () {
      const ledgerWallets = this.$store.getters['ledger/wallets']
      this.selectableWallets = this.wallet_sortByName(uniqBy([
        ...ledgerWallets,
        ...this.wallets
      ], 'address'))
    },

    ledgerDisconnected () {
      this.selectableWallets = this.wallets
    },

    openRemovalConfirmation (wallet) {
      this.walletToRemove = wallet
    },

    openRenameModal (wallet) {
      this.walletToRename = wallet
    },

    removeWallet (wallet) {
      this.hideRemovalConfirmation()
      this.selectableWallets = this.selectableWallets.filter(w => {
        return w.id !== wallet.id
      })
    },

    toggleWalletLayout () {
      this.walletLayout = this.walletLayout === 'grid' ? 'tabular' : 'grid'
    },

    setLedgerCache (enabled) {
      this.sessionLedgerCache = enabled
    },

    onRemoveWallet (wallet) {
      this.openRemovalConfirmation(wallet)
    },

    onRenameWallet (wallet) {
      this.openRenameModal(wallet)
    },

    onWalletRenamed () {
      this.hideRenameModal()
      this.selectableWallets = this.wallets
    },

    onSortChange (sortParams) {
      this.sortParams = sortParams
    },

    showWallet (walletId) {
      this.$router.push({ name: 'wallet-show', params: { address: walletId } })
    }
  }
}
</script>

<style lang="postcss" scoped>
.WalletAll {
  @apply .flex .flex-col .overflow-y-hidden .rounded-lg;
}
.WalletAll__avatar__sign {
  @apply rounded-full w-8 h-8 flex justify-center items-center text-base absolute pin-b pin-r mr-3 -mb-1 border-2 border-theme-feature font-semibold select-none
}
.WalletAll__heading {
  @apply .flex .justify-between .items-center .bg-theme-feature .rounded-lg;
}
.WalletAll__heading .ProfileAvatar {
  @apply .flex .flex-row .justify-around
}
.WalletAll__heading .ProfileAvatar__image {
  height: calc(var(--profile-avatar-xl) * 0.60);
  width: calc(var(--profile-avatar-xl) * 0.66);
  @apply mr-2;
}
.WalletAll__heading .ProfileAvatar__letter {
  @apply mr-4
}

.WalletAll__ledger__cache {
  @apply .border-r .border-theme-feature-item-alternative
}
.WalletAll__header {
  @apply .flex .items-center .justify-between .h-8;
}
.WalletAll__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}
.WalletAll__grid__wallet {
  @apply py-3 relative cursor-pointer;
  transition: transform .2s ease-in-out;
}
.WalletAll__grid__wallet + .WalletAll__grid__wallet > .WalletAll__grid__wallet__wrapper  {
  @apply border-l
}
.WalletAll__grid__wallet:hover {
  @apply rounded-lg z-10;
  transform: scale(1.02);
  box-shadow: 0 5px 30px rgba(124,138,192,0.22);
}
.WalletAll__grid__wallet:not(:hover)::after {
  @apply block absolute pin-x pin-b mx-auto border-b border-theme-line-separator;
  content: " ";
  width: 95%;
}
.WalletAll__grid__wallet__wrapper {
  @apply px-5 py-2 border-theme-line-separator;
}
.WalletAll__grid__wallet__wrapper:hover {
  @apply border-transparent
}
.WalletAll__grid__wallet:hover .identicon {
  opacity: 1;
}
.WalletAll__grid__wallet__name {
  color: #037cff;
}
.WalletAll__grid__wallet .identicon {
  opacity: 0.5;
  transition: 0.5s;
}
</style>
