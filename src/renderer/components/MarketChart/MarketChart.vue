<template>
  <section class="MarketChart w-full">
    <slot />
    <LineChart
      :chart-data="chartData"
      :options="options"
      :height="315" />
  </section>
</template>

<script>
import LineChart from '@/components/utils/LineChart'
import cryptoCompare from '@/services/crypto-compare'

export default {
  name: 'MarketChart',

  provide () {
    return {
      changePeriod: this.changePeriod,
      getPeriod: this.getPeriod
    }
  },

  components: {
    LineChart
  },

  data: () => ({
    period: 'day',
    chartData: {},
    options: {
      showScale: true,
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      layout: {
        padding: {
          left: 50,
          right: 50,
          top: 0,
          bottom: 50
        }
      }
    }
  }),

  computed: {
    currency () {
      return this.$store.getters['session/currency']
    },

    token () {
      return this.$store.getters['session/currentNetwork'].token
    }
  },

  watch: {
    currency () {
      this.renderChart()
    },

    token () {
      this.renderChart()
    },

    period () {
      this.renderChart()
    }
  },

  mounted () {
    this.renderChart()
  },

  methods: {
    async renderChart () {
      const response = await cryptoCompare.historicByType(this.period, this.token, this.currency)
      this.chartData = {
        labels: response.labels,
        datasets: [{
          type: 'line',
          fill: false,
          data: response.datasets
        }]
      }
    },

    changePeriod (period) {
      this.period = period

      this.renderChart()
    },

    getPeriod () {
      return this.period
    }
  }
}
</script>
