<template>
  <div class="WalletAll relative bg-theme-feature rounded-lg m-r-4 p-10">
    <h3>{{ $t('PAGES.WALLET_ALL.HEADER') }}</h3>

    <div class="WalletAll__grid mt-10 justify-center">
      <div class="WalletAll__grid__wallet flex flex-row w-full overflow-hidden">
        <!-- TODO default identicon -->
        <div
          :style="`backgroundImage: url('https://api.adorable.io/avatars/285/abott@adorable.png');`"
          :title="$t('PAGES.CONTACT_ALL.CREATE_WALLET')"
          class="contact-identicon-lg background-image flex cursor-pointer bg-contain opacity-50"
        />
        <div class="flex flex-col justify-center overflow-hidden pl-4">
          <router-link :to="{ name: 'wallet-new' }" >
            {{ $t('PAGES.WALLET_ALL.CREATE_WALLET') }}
          </router-link>
          <router-link :to="{ name: 'wallet-import' }" >
            {{ $t('PAGES.WALLET_ALL.IMPORT_WALLET') }}
          </router-link>
        </div>
      </div>

      <div
        v-for="wallet in selectableWallets"
        :key="wallet.id"
        class="WalletAll__grid__wallet flex flex-row w-full overflow-hidden"
      >
        <router-link
          :to="{ name: 'wallet-show', params: { address: wallet.id } }"
          class="flex flex-row"
        >
          <!-- TODO wallet identicon -->
          <div
            :style="`backgroundImage: url('https://api.adorable.io/avatars/285/abott@adorable.png')`"
            :title="wallet.name"
            class="wallet-identicon-lg background-image flex cursor-pointer bg-contain"
          />
        </router-link>

        <div class="flex flex-col justify-center overflow-hidden pl-4">
          <div class="WalletAll__grid__wallet__name font-semibold text-lg truncate block">
            {{ wallet.name }}
          </div>
          <span class="font-bold mt-2">
            {{ formatter_networkCurrency(wallet.balance, 2) }}
          </span>
          <div
            v-if="!wallet.isLedger"
            class="WalletAll__grid__wallet__select font-semibold flex text-xs cursor-pointer hover:underline hover:text-red text-theme-page-text-light mt-4"
            @click="openRemovalConfirmation(wallet)"
          >
            {{ $t('PAGES.WALLET_ALL.DELETE_WALLET') }}
          </div>
        </div>

      </div>
    </div>

    <WalletRemovalConfirmation
      v-if="walletToRemove"
      :wallet="walletToRemove"
      @cancel="hideRemovalConfirmation"
      @removed="hideRemovalConfirmation"
    />
  </div>
</template>

<script>
import { WalletRemovalConfirmation } from '@/components/Wallet'

export default {
  name: 'WalletAll',

  components: {
    WalletRemovalConfirmation
  },

  data: () => ({
    selectableWallets: [],
    walletToRemove: null
  }),

  computed: {
    wallets () {
      return this.$store.getters['wallet/byProfileId'](this.session_profile.id)
    }
  },

  async created () {
    this.selectableWallets = this.wallets

    if (this.$store.getters['ledger/isConnected']) {
      this.refreshLedgerWallets()
    }
    this.$eventBus.$on('ledger:wallets-updated', this.refreshLedgerWallets)
    this.$eventBus.$on('ledger:disconnected', this.ledgerDisconnected)
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
  @apply .p-4
}
.WalletAll__grid__wallet:hover .wallet-identicon-lg {
  transition: 0.5s;
  opacity: 0.5;
}
</style>
