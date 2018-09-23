<template>
  <div class="Dashboard relative flex flex-row h-full w-full">
    <main class="bg-theme-feature rounded-lg mr-4 flex-1">
      Chart
    </main>

    <div class="Dashboard__wallets relative bg-theme-feature rounded-lg w-1/4 flex flex-col">
      <div class="flex flex-row text-theme-feature-item-alternative-text">
        <router-link
          :to="{ name: 'wallet-new' }"
          class="Dashboard__wallets__create hover:bg-theme-button-text hover:text-theme-feature hover:no-underline rounded-tl-lg"
        >
          <span>
            {{ $t('PAGES.DASHBOARD.CREATE_WALLET') }}
          </span>
        </router-link>

        <router-link
          :to="{ name: 'wallet-import' }"
          class="Dashboard__wallets__import hover:bg-theme-button-text hover:text-theme-feature hover:no-underline rounded-tr-lg"
        >
          <span>
            {{ $t('PAGES.DASHBOARD.IMPORT_WALLET') }}
          </span>
        </router-link>
      </div>

      <WalletSidebar
        :wallets="wallets"
        :is-basic="false"
        class="Dashboard__wallets__list"
        @select="redirect"
      />
    </div>
  </div>
</template>

<script>
import { merge } from 'lodash'
import { WalletSidebar } from '@/components/Wallet'

export default {
  name: 'Dashboard',

  components: {
    WalletSidebar
  },

  computed: {
    profileId () {
      return this.$store.getters['session/profileId']
    },

    wallets () {
      return this.$store.getters['wallet/byProfileId'](this.profileId)
    }
  },

  created () {
    const refreshWallet = async wallet => {
      try {
        const walletData = await this.$client.fetchWallet(wallet.address)
        if (walletData) {
          const updatedWallet = merge({}, wallet, walletData)
          this.$store.dispatch('wallet/update', updatedWallet)
        }
      } catch (error) {
        console.error(error)
        // TODO the error could mean that the wallet isn't on the blockchain yet
        // this.$error(this.$t('COMMON.FAILED_FETCH', {
        //   name: 'wallet data',
        //   msg: error.message
        // }))
      }
    }

    this.$store.dispatch('timer/listen', {
      callback: () => {
        this.wallets.forEach(refreshWallet)
      },
      interval: 'long',
      immediate: true
    })
  },

  methods: {
    redirect (wallet) {
      this.$router.push({ name: 'wallet-show', params: { address: wallet.address } })
    }
  }
}
</script>

<style lang="postcss" scoped>
.Dashboard__wallets__create,
.Dashboard__wallets__import {
  @apply .w-1/2 .appearance-none .font-semibold .pt-12 .pb-4 .flex .justify-center .items-center
}
.Dashboard__wallets__create > span,
.Dashboard__wallets__import > span {
  @apply .py-2 .w-full .text-center
}

.Dashboard__wallets__create > span {
  border-right: 0.04rem solid var(--theme-feature-item-alternative);
}
.Dashboard__wallets__import > span {
  border-left: 0.04rem solid var(--theme-feature-item-alternative);
}
.Dashboard__wallets__create:hover > span {
  border-right: 0px;
}
.Dashboard__wallets__import:hover > span {
  border-left: 0px;
}

.Dashboard__wallets__list {
  border-top: 0.08rem solid var(--theme-feature-item-alternative);
}
.Dashboard__wallets__list >>> .WalletSidebar__wallet__info {
  @apply .text-theme-page-text
}
</style>
