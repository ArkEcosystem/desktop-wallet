<template>
  <div class="WalletAll rounded-lg flex flex-col overflow-y-hidden">
    <div class="WalletAll__balance bg-theme-feature rounded-lg flex p-10 mb-4">
      <div class="flex-1 flex flex-row justify-between">
        <div class="flex flex-row items-end">
          <div
            :style="`backgroundImage: url('${assets_loadImage(session_profile.avatar)}')`"
            class="profile-avatar-xl background-image"
          />
          <div class="flex-col">
            <div>
              <h1 class="mb-2">
                {{ session_profile.name }}
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
          <div class="WalletAll__balance__create flex flex-col items-center pr-6">
            <RouterLink :to="{ name: 'wallet-new' }">
              <span class="rounded-full bg-theme-button h-8 w-8 mb-3 flex items-center justify-center">
                <SvgIcon
                  name="plus"
                  class="text-center"
                  view-box="0 0 9 9"
                />
              </span>
            </RouterLink>
            <RouterLink
              :to="{ name: 'wallet-new' }"
              class="font-bold"
            >
              {{ $t('PAGES.WALLET_ALL.CREATE_WALLET') }}
            </RouterLink>
          </div>
          <div class="WalletAll__balance__import flex flex-col items-center pl-6">
            <RouterLink :to="{ name: 'wallet-import' }">
              <span class="rounded-full bg-theme-button h-8 w-8 mb-3 flex items-center justify-center">
                <SvgIcon
                  name="arrow-import"
                  class="text-center"
                  view-box="0 0 7 10"
                />
              </span>
            </RouterLink>
            <RouterLink
              :to="{ name: 'wallet-import' }"
              class="font-bold"
            >
              {{ $t('PAGES.WALLET_ALL.IMPORT_WALLET') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-1 lg:bg-theme-feature rounded-lg p-10 overflow-y-auto">
      <div class="block w-full">
        <h3>{{ $t('PAGES.WALLET_ALL.HEADER') }}</h3>

        <div class="WalletAll__grid mt-10 justify-center">
          <div
            v-show="isLedgerLoading"
            class="WalletAll__grid__wallet w-full overflow-hidden bg-theme-feature lg:bg-transparent rounded-lg border-theme-wallet-overview-border border-b border-r"
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
import { without } from 'lodash'
import Loader from '@/components/utils/Loader'
import SvgIcon from '@/components/SvgIcon'
import { WalletIdenticon, WalletRemovalConfirmation } from '@/components/Wallet'
import { sortByProp } from '@/components/utils/Sorting'

export default {
  name: 'WalletAll',

  components: {
    Loader,
    SvgIcon,
    WalletIdenticon,
    WalletRemovalConfirmation
  },

  data: () => ({
    selectableWallets: [],
    walletToRemove: null
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
      const prop = 'name'
      return wallets.slice().sort(sortByProp(prop))
    },

    isLedgerLoading () {
      return this.$store.getters['ledger/isLoading'] && !this.$store.getters['ledger/wallets'].length
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$synchronizer.focus('wallets')
    })
  },

  async created () {
    this.selectableWallets = this.wallets

    if (this.$store.getters['ledger/isConnected']) {
      this.refreshLedgerWallets()
    }
    this.$eventBus.on('ledger:wallets-updated', this.refreshLedgerWallets)
    this.$eventBus.on('ledger:disconnected', this.ledgerDisconnected)
  },

  methods: {
    hideRemovalConfirmation () {
      this.walletToRemove = null
    },

    refreshLedgerWallets () {
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
      this.selectableWallets = without(this.selectableWallets, wallet)
    }
  }
}
</script>

<style lang="postcss" scoped>
.WalletAll__balance__create {
  @apply .border-r .border-theme-feature-item-alternative
}
.WalletAll__balance__create > a > .rounded-full,
.WalletAll__balance__import > a > .rounded-full {
  @apply .cursor-pointer .fill-current .text-theme-option-button-text;
  transition: opacity 0.4s;
}
.WalletAll__balance__create > a > .rounded-full:hover,
.WalletAll__balance__import > a > .rounded-full:hover {
  opacity: 0.5;
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
@screen lg {
  .WalletAll__grid__wallet {
    @apply .p-4
  }
}
</style>
