<template>
  <div class="WalletAll relative lg:bg-theme-feature rounded-lg m-r-4 p-10">
    <h3>{{ $t('PAGES.WALLET_ALL.HEADER') }}</h3>

    <div class="WalletAll__grid mt-10 justify-center">
      <div class="WalletAll__grid__wallet w-full overflow-hidden bg-theme-feature lg:bg-transparent rounded-lg border-theme-wallet-overview-border border-b border-r">
        <div class="flex flex-row items-center">
          <WalletIdenticonPlaceholder
            :size="60"
            value="default"
            class="identicon opacity-50"
          />
          <div class="flex flex-col justify-center overflow-hidden pl-4 font-semibold">
            <router-link :to="{ name: 'wallet-new' }">
              {{ $t('PAGES.WALLET_ALL.CREATE_WALLET') }}
            </router-link>
            <router-link :to="{ name: 'wallet-import' }">
              {{ $t('PAGES.WALLET_ALL.IMPORT_WALLET') }}
            </router-link>
          </div>
        </div>
      </div>

      <div
        v-show="isLedgerLoading"
        class="WalletAll__grid__wallet w-full overflow-hidden bg-theme-feature lg:bg-transparent rounded-lg border-theme-wallet-overview-border border-b border-r"
      >
        <Loader />
        <div class="text-center mt-4">{{ $t('PAGES.WALLET_ALL.LOADING_LEDGER') }}</div>
      </div>

      <div
        v-for="wallet in selectableWallets"
        :key="wallet.id"
        class="WalletAll__grid__wallet w-full overflow-hidden bg-theme-feature lg:bg-transparent rounded-lg border-theme-wallet-overview-border border-b border-r"
      >
        <div class="flex flex-row items-center">
          <router-link
            :to="{ name: 'wallet-show', params: { address: wallet.id } }"
            class="flex flex-row"
          >
            <WalletIdenticon
              :value="wallet.address"
              :size="60"
              class="identicon cursor-pointer"
            />
          </router-link>

          <div class="flex flex-col justify-center overflow-hidden pl-4">
            <div class="WalletAll__grid__wallet__name font-semibold text-base truncate block">
              <router-link :to="{ name: 'wallet-show', params: { address: wallet.id } }">
                {{ wallet_name(wallet.address) || wallet_truncate(wallet.address) }}
              </router-link>
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
import { WalletIdenticon, WalletIdenticonPlaceholder, WalletRemovalConfirmation } from '@/components/Wallet'
import { sortByProp } from '@/components/utils/Sorting'

export default {
  name: 'WalletAll',

  components: {
    Loader,
    WalletIdenticon,
    WalletIdenticonPlaceholder,
    WalletRemovalConfirmation
  },

  data: () => ({
    selectableWallets: [],
    walletToRemove: null
  }),

  computed: {
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
