import { Line, mixins } from 'vue-chartjs'

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
    this.$once('chart:render', () => {
      this.$emit('ready')
    })
    this.render()
  },

  watch: {
    options (newOptions) {
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
