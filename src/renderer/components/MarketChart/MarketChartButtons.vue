<template>
  <nav class="MarketChartButtons">
    <button
      v-for="(translation, period) in $options.periods"
      :key="period"
      :class="{
        'bg-red-light text-white': activePeriod === period
      }"
      class="MarketChartButtons__button mr-2 font-semibold px-3 py-1 text-theme-page-text-light rounded"
      @click="changePeriod(period)"
    >
      {{ $t(translation) }}
    </button>
  </nav>
</template>

<script>
export default {
  name: 'MarketChartButtons',

  periods: {
    'day': 'MARKET.DAY',
    'week': 'MARKET.WEEK',
    'month': 'MARKET.MONTH'
  },

  inject: ['changePeriod', 'getPeriod'],

  computed: {
    activePeriod () {
      return this.getPeriod()
    }
  }
}
</script>
