<template>
  <section
    v-if="hasChartData"
    :class="isExpanded ? 'bg-theme-chart-background pb-4' : 'bg-theme-feature'"
    class="MarketChartWrapper flex-column"
  >
    <slot />
    <div
      class="MarketChart"
      :class="{ 'collapsed': !isExpanded }"
    >
      <LineChart
        v-show="isReady"
        ref="chart"
        :chart-data="chartData"
        :options="options"
        :height="315"
        @ready="setReady"
      />
      <div
        v-if="!isReady"
        class="MarketChart__Loader__Container"
      >
        <Loader />
      </div>
    </div>
  </section>
</template>

<script>
import LineChart from '@/components/utils/LineChart'
import Loader from '@/components/utils/Loader'
import priceApi from '@/services/price-api'
import { dayjs } from '@/services/datetime'

export default {
  name: 'MarketChart',

  provide () {
    return {
      getPeriod: this.getPeriod,
      getIsExpanded: this.getIsExpanded
    }
  },

  components: {
    LineChart,
    Loader
  },

  props: {
    period: {
      type: String,
      required: true,
      default: 'day'
    },
    isExpanded: {
      type: Boolean,
      required: true,
      default: true
    }
  },

  data: () => ({
    hasChartData: true,
    isReady: false,
    chartData: {},
    options: {},
    gradient: null,
    lastCurrency: null,
    lastPriceApi: null
  }),

  computed: {
    colours () {
      const coloursByTheme = {
        dark: {
          lines: '#787fa3',
          ticks: '#787fa3'
        },
        light: {
          lines: '#9ea7bc',
          ticks: '#9ea7bc'
        }
      }

      let themeColour = coloursByTheme[this.theme]
      if (!themeColour) {
        let mode = 'light'
        const pluginTheme = this.pluginThemes[this.theme]
        if (pluginTheme) {
          mode = pluginTheme.darkMode ? 'dark' : 'light'
        }
        themeColour = coloursByTheme[mode]
      }

      return {
        ...themeColour,
        gradient: ['#666', '#528fe3', '#9c6dd8', '#e15362']
      }
    },

    pluginThemes () {
      return this.$store.getters['plugin/themes']
    },

    currency () {
      return this.$store.getters['session/currency']
    },

    priceApi () {
      return this.$store.getters['session/priceApi']
    },

    theme () {
      return this.$store.getters['session/theme']
    },

    ticker () {
      return this.session_network.market.ticker
    }
  },

  watch: {
    currency () {
      this.renderChart()
    },

    priceApi () {
      this.renderChart()
    },

    theme () {
      this.renderChart()
    },

    ticker () {
      this.renderChart()
    },

    period () {
      this.renderChart()
    },

    isExpanded (value, oldValue) {
      if (!oldValue && value) {
        this.renderChart()
      }
    }
  },

  mounted () {
    this.setLastCurrency()
  },

  activated () {
    // Only if it's not already rendered
    if ((this.isExpanded && !this.isReady) || this.lastCurrency !== this.currency || this.lastPriceApi !== this.priceApi) {
      this.renderChart()
    }
  },

  methods: {
    setReady () {
      this.isReady = true
    },

    setLastCurrency () {
      this.lastCurrency = this.currency
    },

    setLastPriceApi () {
      this.lastPriceApi = this.priceApi
    },

    async renderChart () {
      this.isReady = false

      if (!this._inactive) {
        this.setLastCurrency()
        this.setLastPriceApi()
      }

      await this.renderGradient()

      const response = await priceApi.historicalPriceFor(this.period, this.ticker, this.currency)
      if (!response) {
        this.hasChartData = false
      } else if (response.datasets) {
        this.hasChartData = true

        // Since BTC price could be very low :(, the linear scale could produce
        // imprecise values, such as converting 0.00001078 to 0, provoking that
        // the chart isn't displayed correctly
        const scaleCorrection = 1000
        const data = response.datasets.map(datum => datum * scaleCorrection)

        const themeGridLines = this.colours.lines
        const themeTicks = this.colours.ticks

        const fontConfig = {
          fontColor: themeTicks,
          fontSize: 14,
          fontStyle: 600
        }

        this.options = {
          showScale: true,
          responsive: true,
          maintainAspectRatio: false,
          elements: {
            line: {
              cubicInterpolationMode: 'monotone'
              // NOTE: to improve rendering time
              // tension: 0
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
                  color: themeGridLines,
                  display: true,
                  drawBorder: false
                },
                ticks: {
                  padding: 15,
                  ...fontConfig,
                  callback: (value, index) => {
                    if (index % 2 === 0) return

                    const formatConfig = { currency: this.currency }
                    const price = value / scaleCorrection

                    if (price < 1e-4) {
                      formatConfig.maximumFractionDigits = 8
                    } else if (price < 1e-2) {
                      formatConfig.maximumFractionDigits = 5
                    } else {
                      formatConfig.maximumFractionDigits = 3
                    }

                    return this.currency_format(price, formatConfig)
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
                  padding: 10,
                  ...fontConfig,
                  callback: (value, index, values) => {
                    if (this.period !== 'day' && index === values.length - 1) {
                      return this.$t('MARKET_CHART.TODAY')
                    } else if (this.period === 'week') {
                      const width = this.$el.clientWidth
                      if (width > 1200) {
                        return this.$t(`MARKET_CHART.WEEK.LONG.${value.toUpperCase()}`)
                      } else {
                        return this.$t(`MARKET_CHART.WEEK.SHORT.${value.toUpperCase()}`)
                      }
                    } else if (this.period === 'month') {
                      return value
                    }

                    return this.formatHour(value)
                  }
                }
              }
            ]
          },
          tooltips: {
            displayColors: false,
            intersect: false,
            mode: 'index',
            axis: 'x',
            callbacks: {
              label: (item) => {
                return this.currency_format(item.yLabel / scaleCorrection, { currency: this.currency })
              },
              title: (items, data) => {
                const { index } = items[0]
                const values = data.datasets[0].data
                let title = items[0].xLabel

                if (this.period === 'day') {
                  const midnight = data.labels.indexOf('00:00')
                  if (index < midnight) {
                    return this.$t('MARKET_CHART.YESTERDAY_AT', { hour: title })
                  }
                  return this.$t('MARKET_CHART.TODAY_AT', { hour: title })
                } else if (index === values.length - 1) {
                  return this.$t('MARKET_CHART.TODAY')
                } else if (this.period === 'week') {
                  return this.$t(`MARKET_CHART.WEEK.LONG.${title.toUpperCase()}`)
                } else {
                  const days = values.length
                  const today = dayjs()
                  today.date(values[days - 1])
                  title = today.subtract(days - index - 1, 'day')
                  return this.$d(title)
                }
              }
            }
          }
        }

        this.chartData = {
          labels: response.labels,
          datasets: [{
            // Do not show the points, but enable a big target for the tooltip
            pointHitRadius: 6,
            pointRadius: 0,
            borderWidth: 3,
            type: 'line',
            fill: false,
            borderColor: this.gradient || this.colours.gradient[0],
            data
          }]
        }
      }

      this.isReady = true
    },

    async renderGradient () {
      if (this.gradient) return

      await this.$nextTick

      const canvas = this.$refs.chart.getCanvas()
      const width = this.$el.clientWidth

      if (width === 0) return

      this.gradient = canvas.getContext('2d').createLinearGradient(0, 0, width, 0)
      this.gradient.addColorStop(0, this.colours.gradient[1])
      this.gradient.addColorStop(0.5, this.colours.gradient[2])
      this.gradient.addColorStop(1, this.colours.gradient[3])
    },

    getPeriod () {
      return this.period
    },

    getIsExpanded () {
      return this.isExpanded
    },

    /**
     * Returns the hour in the configured format (24h or 12h)
     * @param {String} HH:mm
     * @return {String}
     */
    formatHour (time) {
      if (this.session_profile.timeFormat !== '12h') {
        return time
      } else {
        let meridiem = 'PM'
        const [hours, minutes] = time.split(':')
        let hour = parseInt(hours)
        if (hour === 0) {
          hour = 12
        } else if (hour > 12) {
          hour -= 12
        } else {
          meridiem = 'AM'
        }
        return `${hour}:${minutes} ${meridiem}`
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.MarketChartWrapper {
  @apply .w-full .pt-10 .px-10 .rounded-t-lg;
  transition: background-color .3s ease-in-out;
}

.MarketChart {
  height: auto;
  max-height: 315px;
  overflow: hidden;
  transition: opacity .3s ease-in-out, max-height .3s ease-in-out;
}

.MarketChart.collapsed {
  max-height: 0;
  opacity: 0;
}

.MarketChart__Loader__Container {
  @apply .flex .items-center .justify-center;
  min-height: 315px;
}
</style>
