import { PulseLoader } from 'vue-spinner/dist/vue-spinner.min'

export default {
  functional: true,

  props: {
    color: {
      type: String,
      required: false
    }
  },

  render: (h, ctx) => h(PulseLoader, {
    props: {
      color: ctx.props.color
    }
  })
}
