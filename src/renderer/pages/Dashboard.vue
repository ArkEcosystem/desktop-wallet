<template>
  <div class="Dashboard relative flex flex-row h-full w-full">
    <main class="bg-theme-feature rounded-lg lg:mr-4 flex-1 w-full flex-col overflow-y-auto">
      <div
        v-if="!isChartEnabled && isMarketEnabled"
        class="pt-10 px-10 rounded-t-lg text-lg font-semibold mt-1 text-theme-chart-price"
      >
        <span v-if="price">
          {{ $t('MARKET_CHART_HEADER.PRICE', { currency: ticker }) }}:
          <!-- TODO price in crypto and fiat instead of only in 1 currency -->
          {{ currency_format(price, { currency, currencyDisplay: 'code' }) }}
        </span>
      </div>

      <div
        v-if="isChartEnabled && isMarketEnabled"
        class="bg-theme-chart-background pt-10 px-10 pb-4 rounded-t-lg"
      >
        <MarketChart :is-active="isMarketEnabled">
          <MarketChartHeader class="mb-5" />
        </MarketChart>
      </div>

      <div class="p-10">
        <h3 class="flex items-center">
          {{ $t('PAGES.DASHBOARD.LAST_TRANSACTIONS') }}
        </h3>

        <div class="Dashboard__transactions">
          <DashboardTransactions />
        </div>
      </div>
    </main>

    <div class="Dashboard__wallets relative bg-theme-feature rounded-lg w-88 overflow-y-auto hidden lg:block">
      <div class="flex flex-row text-theme-feature-item-alternative-text mt-2">
        <WalletButtonCreate
          :force-text="true"
          class="mt-6 mb-6 w-1/2"
        />
        <WalletButtonImport
          :force-text="true"
          class="mt-6 mb-6 w-1/2"
        />
      </div>
      <WalletSidebar
        :show-expanded="true"
        :show-menu="false"
        :show-filtered-wallets="false"
        class="Dashboard__wallets__list flex flex-col"
      />
    </div>
  </div>
</template>

<script>
import { DashboardTransactions } from '@/components/Dashboard'
import { MarketChart, MarketChartHeader } from '@/components/MarketChart'
import { WalletSidebar, WalletButtonCreate, WalletButtonImport } from '@/components/Wallet'
import store from '@/store'

export default {
  name: 'Dashboard',

  components: {
    DashboardTransactions,
    MarketChart,
    MarketChartHeader,
    WalletSidebar,
    WalletButtonCreate,
    WalletButtonImport
  },

  computed: {
    isChartEnabled () {
      return this.$store.getters['session/isMarketChartEnabled']
    },
    isMarketEnabled () {
      return this.session_network && this.session_network.market && this.session_network.market.enabled
    },
    currency () {
      return this.$store.getters['session/currency']
    },
    price () {
      return this.$store.getters['market/lastPrice']
    },
    ticker () {
      return this.session_network.market.ticker
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
          vm.$synchronizer.trigger('wallets')
          vm.$synchronizer.focus('wallets', 'market')
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
.Dashboard__transactions {
  @apply .mt-10;
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
