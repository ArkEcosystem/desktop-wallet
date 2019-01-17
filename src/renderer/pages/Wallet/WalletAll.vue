<template>
  <div class="WalletAll rounded-lg flex flex-col overflow-y-hidden">
    <div class="WalletAll__balance bg-theme-feature rounded-lg flex p-10 mb-3">
      <div class="flex-1 flex flex-row justify-between">
        <div class="flex flex-row items-center">
          <div
            v-if="session_profile.avatar"
            :style="`backgroundImage: url('${assets_loadImage(session_profile.avatar)}')`"
            class="profile-avatar-xl background-image"
          />
          <ButtonLetter
            v-else
            :value="session_profile.name"
            size="2xl"
            class="mx-5"
          />
          <div class="flex-col">
            <div>
              <h1 class="mb-2">
                {{ session_profile.name | truncate(20) }}
              </h1>
              <h4>{{ $t('PAGES.WALLET_ALL.TOTAL_BALANCE') }}</h4>
            </div>
            <div>
              <h2>
                {{ formatter_networkCurrency(totalBalance) }}
                <span
                  v-if="isMarketEnabled"
                  class="WalletAll__balance__alternative text-sm text-bold text-theme-page-text-light ml-2"
                >
                  {{ alternativeTotalBalance }}
                </span>
              </h2>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-end pb-4 pr-8">
          <div
            v-show="isLedgerConnected"
            v-tooltip="$t('PAGES.WALLET_ALL.CACHE_LEDGER_INFO')"
            class="WalletAll__ledger__cache flex flex-col items-center px-6"
          >
            <span>{{ $t('PAGES.WALLET_ALL.CACHE_LEDGER') }}</span>
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
          class="WalletAll__grid mt-10 justify-center"
        >
          <div
            v-show="isLedgerLoading"
            class="WalletAll__grid__wallet flex flex-col justify-center w-full overflow-hidden bg-theme-feature lg:bg-transparent rounded-lg border-theme-wallet-overview-border border-b border-r mb-3"
          >
            <Loader />
            <div class="text-center mt-4">
              {{ $t('PAGES.WALLET_ALL.LOADING_LEDGER') }}
            </div>
          </div>

          <div
            v-for="wallet in selectableWallets"
            :key="wallet.id"
            class="WalletAll__grid__wallet w-full overflow-hidden bg-theme-feature lg:bg-transparent rounded-lg border-theme-wallet-overview-border border-b border-r mb-3"
          >
            <div class="flex flex-row items-center">
              <RouterLink
                :to="{ name: 'wallet-show', params: { address: wallet.id } }"
                class="flex flex-row"
              >
                <WalletIdenticon
                  :value="wallet.address"
                  :size="60"
                  class="identicon cursor-pointer"
                />
              </RouterLink>
              <div class="flex flex-col justify-center overflow-hidden pl-4">
                <div class="WalletAll__grid__wallet__name font-semibold text-base truncate block">
                  <RouterLink :to="{ name: 'wallet-show', params: { address: wallet.id } }">
                    {{ wallet_name(wallet.address) || wallet_truncate(wallet.address) }}
                  </RouterLink>
                </div>
                <span class="font-bold mt-2 text-lg">
                  {{ formatter_networkCurrency(wallet.balance, 2) }}
                </span>
              </div>
            </div>
            <div class="flex flex-row w-full justify-end">
              <button
                v-if="!wallet.isLedger"
                class="WalletAll__grid__wallet__select font-semibold flex text-xs cursor-pointer hover:underline hover:text-red text-theme-page-text-light mt-4"
                @click="openRemovalConfirmation(wallet)"
              >
                {{ $t('PAGES.WALLET_ALL.DELETE_WALLET') }}
              </button>
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
  </div>
</template>

<script>
import { clone, some, sortBy } from 'lodash'
import { ButtonLayout, ButtonLetter, ButtonSwitch } from '@/components/Button'
import Loader from '@/components/utils/Loader'
import { WalletIdenticon, WalletRemovalConfirmation, WalletButtonCreate, WalletButtonImport } from '@/components/Wallet'
import WalletTable from '@/components/Wallet/WalletTable'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'WalletAll',

  components: {
    ButtonLayout,
    ButtonLetter,
    ButtonSwitch,
    Loader,
    WalletIdenticon,
    WalletRemovalConfirmation,
    WalletButtonCreate,
    WalletButtonImport,
    WalletTable,
    SvgIcon
  },

  data: () => ({
    selectableWallets: [],
    walletToRemove: null,
    isLoading: false,
    sortParams: {
      field: 'balance',
      type: 'desc'
    }
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
      return this.session_network.market.enabled
    },

    totalBalance () {
      return this.$store.getters['profile/balanceWithLedger'](this.session_profile.id)
    },

    price () {
      return this.$store.getters['market/lastPrice']
    },

    wallets () {
      const wallets = this.$store.getters['wallet/byProfileId'](this.session_profile.id)
      return sortBy(wallets, ['name', 'address'])
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

    async refreshLedgerWallets () {
      const ledgerWallets = this.$store.getters['ledger/wallets']
      this.selectableWallets = [...ledgerWallets, ...this.wallets]
    },

    ledgerDisconnected () {
      this.selectableWallets = this.wallets
    },

    openRemovalConfirmation (wallet) {
      this.walletToRemove = wallet
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
    }
  }
}
</script>

<style lang="postcss" scoped>
.WalletAll__ledger__cache {
  @apply .border-r .border-theme-feature-item-alternative
}
.WalletAll__header {
  @apply .flex .items-center .justify-between .h-8;
}
.WalletAll__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, calc(var(--wallet-identicon-lg) * 3));
  grid-gap: 1rem;
}
.WalletAll__grid__wallet {
  @apply .p-6
}
.WalletAll__grid__wallet:hover .identicon {
  transition: 0.5s;
  opacity: 0.5;
}
.WalletAll__grid__wallet .identicon {
  transition: 0.5s;
}
@screen lg {
  .WalletAll__grid__wallet {
    @apply .p-4
  }
}
</style>
