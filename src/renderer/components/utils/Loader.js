import { PulseLoader } from 'vue-spinner/dist/vue-spinner.min'
import tailwindConfig from '@tailwind'

export default {
  functional: true,

  props: {
    color: {
      type: String,
      required: false,
      default: tailwindConfig.colors['blue-dark']
    },
    size: {
      type: String,
      required: false
    }
  },

  render: (h, ctx) => h(PulseLoader, {
    props: {
      color: ctx.props.color,
      size: ctx.props.size
    }
  })
}
