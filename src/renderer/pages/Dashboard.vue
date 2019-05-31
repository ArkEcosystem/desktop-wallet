<template>
  <div class="Dashboard relative flex flex-row h-full w-full">
    <main class="bg-theme-feature rounded-lg lg:mr-4 flex-1 w-full flex-col overflow-y-auto">
      <div
        v-if="!isChartShown && isMarketEnabled"
        class="pt-10 px-10 rounded-t-lg text-lg font-semibold text-theme-chart-price"
      >
        <MarketChartHeader
          class="mb-5"
          :is-chart-active="false"
          @toggle="toggleChart"
        />
      </div>

      <div
        v-if="isChartShown && isMarketEnabled"
        class="bg-theme-chart-background pt-10 px-10 pb-4 rounded-t-lg"
      >
        <MarketChart :is-active="isChartActive">
          <MarketChartHeader
            class="mb-5"
            :is-chart-active="true"
            @toggle="toggleChart"
          />
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
          class="Dashboard__wallets__button"
        />
        <WalletButtonImport
          :force-text="true"
          class="Dashboard__wallets__button"
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

  provide () {
    // The `MarketChartHeader` component would use these methods when wrapped by `MarketChart`
    return {
      changePeriod () {},
      getPeriod () {}
    }
  },

  data: () => ({
    isChartActive: false,
    isChartShown: false
  }),

  computed: {
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
    },
    isChartEnabledOnProfile () {
      return this.session_profile.isMarketChartEnabled
    }
  },

  watch: {
    isChartEnabledOnProfile (value) {
      if (!this._inactive) {
        this.isChartShown = value
      }
    },
    isChartShown (value) {
      if (!this._inactive) {
        // It's necessary to delay the rendering of the chart until updating the DOM
        // If not, the loader would run indefinitely
        this.$nextTick(() => {
          this.isChartActive = value
        })
      }
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
  },

  activated () {
    this.isChartShown = this.isChartEnabledOnProfile
  },

  methods: {
    toggleChart (value) {
      this.isChartShown = value
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
.Dashboard__wallets__button {
  @apply .mt-6 .mb-6 .w-1/2
}
</style>
