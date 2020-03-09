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
    this.$on('chart:render', () => {
      this.$emit('ready')
    })
    this.render()
  },

  watch: {
    options () {
      this.destroy()
      this.render()
    }
  },

  methods: {
    getCanvas () {
      return this.$refs.canvas
    },

    destroy () {
      this.$data._chart.destroy()
    },

    render () {
      this.renderChart(this.chartData, this.options)
    },

    update () {
      this.$data._chart.update()
    }
  }
}
