<template>
  <nav class="MarketChartHeader flex flex-row justify-between">
    <div class="text-lg font-semibold mt-1 text-theme-chart-price">
      <span v-if="price">
        {{ $t('MARKET_CHART_HEADER.PRICE', { currency: ticker }) }}:
        <!-- TODO price in crypto and fiat instead of only in 1 currency -->
        {{ currency_format(price, { currency, currencyDisplay: 'code' }) }}
      </span>
    </div>

    <div v-if="isChartActive">
      <button
        v-for="(translation, period) in $options.periods"
        :key="period"
        :class="{
          'bg-theme-button-special-choice text-white': activePeriod === period
        }"
        class="MarketChartHeader__button mr-2 font-semibold px-3 py-1 text-theme-page-text rounded"
        :disabled="activePeriod === period"
        @click="changePeriod(period)"
      >
        {{ $t(translation) }}
      </button>
    </div>

    <div class="mt-1">
      <span class="text-lg font-semibold mr-4 mt-4">
        {{ $t('MARKET_CHART_HEADER.SHOW_CHART') }}
      </span>

      <div class="MarketChartHeader__show-button float-right">
        <ButtonSwitch
          :is-active="isChartActive"
          background-color="var(--theme-settings-switch)"
          @change="emitToggle"
        />
      </div>
    </div>
  </nav>
</template>

<script>
import { ButtonSwitch } from '@/components/Button'

export default {
  name: 'MarketChartHeader',

  periods: {
    day: 'MARKET.DAY',
    week: 'MARKET.WEEK',
    month: 'MARKET.MONTH'
  },

  inject: ['changePeriod', 'getPeriod'],

  components: {
    ButtonSwitch
  },

  props: {
    isChartActive: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  computed: {
    activePeriod () {
      return this.getPeriod()
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

  methods: {
    emitToggle (value) {
      this.$emit('toggle', value)
    }
  }
}
</script>

<style scoped>
.MarketChartHeader__button {
  transition: all 0.3s;
}
.MarketChartHeader__button:disabled {
  color: white;
}
.MarketChartHeader__button:hover {
  @apply bg-theme-button-special-choice text-white;
  opacity: 0.5;
}
.MarketChartHeader__show-button {
  margin-top: -0.125rem;
}
</style>
