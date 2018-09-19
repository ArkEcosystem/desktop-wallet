import Chart from 'chart.js'
import { Line, mixins } from 'vue-chartjs'
import tailwindConfig from '@tailwind'

Chart.defaults.global.defaultFontFamily = tailwindConfig.fonts.sans.join(',')
// TODO: Add theme colors

export default {
  extends: Line,

  mixins: [mixins.reactiveProp],

  props: {
    chartData: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },

  mounted () {
    this.renderChart(this.chartData, this.options)
  },

  methods: {
    getCanvas () {
      return this.$refs.canvas
    },

    update () {
      this.$data._chart.update()
    }
  }
}
