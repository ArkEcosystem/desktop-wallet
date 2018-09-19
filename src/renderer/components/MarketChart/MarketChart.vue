<template>
  <section class="MarketChart w-full">
    <slot />
    <LineChart
      ref="chart"
      :chart-data="chartData"
      :options="options"
      :height="315" />
  </section>
</template>

<script>
import LineChart from '@/components/utils/LineChart'
import cryptoCompare from '@/services/crypto-compare'
import store from '@/store'

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

  props: {
    isActive: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data: () => ({
    period: 'day',
    chartData: {},
    options: {},
    gradient: null
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
    },

    isActive (val) {
      if (!val) return // Render the chart when open the tab

      this.renderChart()
    }
  },

  mounted () {
    // avoid creating the gradient when the element is not built
    if (this.isActive) {
      this.renderChart()
    }
  },

  methods: {
    async renderChart () {
      // TODO: Add loading
      await this.renderGradient()

      const response = await cryptoCompare.historicByType(this.period, this.token, this.currency)

      this.options = {
        showScale: true,
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            tension: 0
          }
        },
        legend: {
          display: false
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 10,
            bottom: 10
          }
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                borderDash: [5, 5],
                display: true,
                drawBorder: false
              },
              ticks: {
                padding: 15,
                fontStyle: 600,
                callback: (value, index, values) => {
                  if (index % 2 === 0) return

                  return store.getters['market/formatPrice']({
                    value,
                    format: ({ symbol, value }) => `${symbol}${value}`
                  })
                }
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                display: false
              },
              ticks: {
                padding: 10
              }
            }
          ]
        }
      }

      this.chartData = {
        labels: response.labels,
        datasets: [{
          pointRadius: 0,
          borderWidth: 3,
          type: 'line',
          fill: false,
          borderColor: this.gradient || '#666',
          data: response.datasets
        }]
      }
    },

    async renderGradient () {
      if (this.gradient) return

      await this.$nextTick

      const canvas = this.$refs.chart.getCanvas()
      const width = this.$el.clientWidth

      if (width === 0) return

      this.gradient = canvas.getContext('2d').createLinearGradient(0, 0, width, 0)
      this.gradient.addColorStop(0, '#528fe3')
      this.gradient.addColorStop(0.5, '#9c6dd8')
      this.gradient.addColorStop(1, '#e15362')
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

<style scoped>
.MarketChart {
  min-height: 315px
}
</style>
