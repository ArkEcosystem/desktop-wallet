<template>
  <div class="Dashboard relative flex flex-row h-full w-full">
    <main class="bg-theme-feature rounded-lg lg:mr-4 flex-1 w-full flex-col overflow-y-auto">
      <div
        v-if="isMarketEnabled"
        class="bg-theme-chart-background pt-10 px-10 pb-4 rounded-t-lg"
      >
        <MarketChart :is-active="isMarketEnabled">
          <MarketChartHeader class="mb-5" />
        </MarketChart>
      </div>

      <div class="p-10">
        <div class="text-lg font-semibold mb-4">
          {{ $t('PAGES.DASHBOARD.LAST_TRANSACTIONS') }}
        </div>
        <DashboardTransactions />
      </div>
    </main>

    <div class="Dashboard__wallets relative bg-theme-feature rounded-lg w-88 overflow-y-auto hidden lg:block">
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
        :is-slim="false"
        class="Dashboard__wallets__list flex flex-col"
      />
    </div>
  </div>
</template>

<script>
import { DashboardTransactions } from '@/components/Dashboard'
import { MarketChart, MarketChartHeader } from '@/components/MarketChart'
import { WalletSidebar } from '@/components/Wallet'
import store from '@/store'

export default {
  name: 'Dashboard',

  components: {
    DashboardTransactions,
    MarketChart,
    MarketChartHeader,
    WalletSidebar
  },

  computed: {
    isMarketEnabled () {
      return this.session_network && this.session_network.market && this.session_network.market.enabled
    }
  },

  /**
   * Redirect to the profile creation page unless there is at least 1 profile
   */
  beforeRouteEnter (to, from, next) {
    const chooseNext = async () => {
      const profiles = await store.getters['profile/all']

      if (to.name === 'profile-new') {
        next()
      } else if (profiles.length > 0) {
        next(async vm => {
          vm.$synchronizer.focus('wallets', 'contacts', 'market')
        })
      } else {
        next({ name: 'profile-new' })
      }
    }

    store._IS_READY
      ? chooseNext()
      : store._vm.$root.$on('vuex-persist:ready', chooseNext)
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
  @apply .w-1/2 .appearance-none .font-semibold .pt-8 .pb-4 .flex .justify-center .items-center
}
.Dashboard__wallets__create > span,
.Dashboard__wallets__import > span {
  @apply .pt-3 .pb-2 .w-full .text-center
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
.Dashboard__wallets__list .WalletSidebar__wallet__ledger-loader .WalletSidebar__wallet__wrapper {
  @apply mx-6 text-base text-center;
}
.Dashboard__wallets__list .WalletSidebar__wallet__ledger-loader .v-spinner {
  @apply mr-3;
}
</style>
