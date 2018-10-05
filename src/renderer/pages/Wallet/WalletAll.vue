<template>
  <div class="WalletAll relative bg-theme-feature rounded-lg m-r-4 p-10">
    <h3>{{ $t('PAGES.WALLET_ALL.HEADER') }}</h3>

    <div class="WalletAll__grid mt-10">
      <div class="WalletAll__grid__wallet flex flex-row w-full">
        <div class="w-full font-semibold flex flex-col text-xl justify-around items-center" >
          <router-link :to="{ name: 'wallet-new' }" >
            {{ $t('PAGES.WALLET_ALL.CREATE_WALLET') }}
          </router-link>

          <router-link :to="{ name: 'wallet-import' }" >
            {{ $t('PAGES.WALLET_ALL.IMPORT_WALLET') }}
          </router-link>
        </div>
      </div>

      <div
        v-for="wallet in wallets"
        :key="wallet.id"
        class="WalletAll__grid__wallet flex flex-row w-full"
      >
        <router-link :to="{ name: 'wallet-show', params: { address: wallet.id } }">
          <div
            :style="`backgroundImage: url('https://api.adorable.io/avatars/285/abott@adorable.png')`"
            :title="wallet.name"
            class="wallet-identicon-xl background-image flex cursor-pointer"
          />
        </router-link>

        <div class="flex flex-col">
          <div class="WalletAll__grid__wallet__name font-semibold flex text-lg pl-4 mt-8">
            {{ wallet.name }}
          </div>

          <router-link
            :to="{ name: 'wallet-show', params: { address: wallet.id } }"
            class="WalletAll__grid__wallet__edition-link font-semibold flex text-xs pl-4 mt-2 mb-6"
          >
            {{ $t('PAGES.WALLET_ALL.SHOW_WALLET') }}
          </router-link>

          <div
            class="WalletAll__grid__wallet__select font-semibold flex text-xs cursor-pointer pl-4 hover:underline hover:text-red"
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
    walletToRemove: null
  }),

  computed: {
    wallets () {
      return this.$store.getters['wallet/byProfileId'](this.session_profile.id)
    }
  },

  methods: {
    hideRemovalConfirmation () {
      this.walletToRemove = null
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
  grid-template-columns: repeat(auto-fill, calc(var(--wallet-identicon-xl) * 2));
  grid-gap: 1rem;
}
.WalletAll__grid__wallet {
  @apply .p-4
}
.WalletAll__grid__wallet:hover .wallet-identicon-xl {
  transition: 0.5s;
  opacity: 0.5;
}
.WalletAll__grid__wallet__name {
  width: var(--wallet-identicon-xl);
}
</style>
