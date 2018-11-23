<template>
  <nav class="MarketChartHeader flex flex-row justify-between">
    <div class="text-lg font-semibold mt-1 text-theme-chart-price">
      <span v-if="price">
        {{ $t('MARKET_CHART_HEADER.PRICE') }}:
        <!-- TODO price in crypto and fiat instead of only in 1 currency -->
        {{ currency_format(price, { currency, currencyDisplay: 'code' }) }}
      </span>
    </div>

    <div>
      <button
        v-for="(translation, period) in $options.periods"
        :key="period"
        :class="{
          'bg-theme-button-special-choice text-white': activePeriod === period
        }"
        class="MarketChartHeader__button mr-2 font-semibold px-3 py-1 text-theme-page-text rounded"
        @click="changePeriod(period)"
      >
        {{ $t(translation) }}
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'MarketChartHeader',

  periods: {
    day: 'MARKET.DAY',
    week: 'MARKET.WEEK',
    month: 'MARKET.MONTH'
  },

  inject: ['changePeriod', 'getPeriod'],

  computed: {
    activePeriod () {
      return this.getPeriod()
    },
    currency () {
      return this.$store.getters['session/currency']
    },
    price () {
      return this.$store.getters['market/lastPrice']
    }
  }
}
</script>
