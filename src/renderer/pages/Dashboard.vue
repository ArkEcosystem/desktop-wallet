<template>
  <div class="Dashboard relative flex flex-row h-full w-full">
    <main class="bg-theme-feature rounded-lg mr-4 flex-1 w-3/4">
      <MarketChart
        v-if="isMarketEnabled"
        :is-active="isMarketEnabled"
        class="bg-grey-lightest pt-10 px-10 pb-4 rounded-t-lg"
      >
        <MarketChartHeader class="mb-5" />
      </MarketChart>
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
        :is-basic="false"
        class="Dashboard__wallets__list"
      />
    </div>
  </div>
</template>

<script>
import { MarketChart, MarketChartHeader } from '@/components/MarketChart'
import { WalletSidebar } from '@/components/Wallet'

export default {
  name: 'Dashboard',

  components: {
    MarketChart,
    MarketChartHeader,
    WalletSidebar
  },

  computed: {
    isMarketEnabled () {
      return this.$store.getters['session/currentNetwork'].market.enabled
    }
  }
}
</script>

<style lang="postcss">
.Dashboard__wallets__list .WalletSidebar__wallet__info {
  @apply .text-theme-page-text
}
</style>

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
</style>
