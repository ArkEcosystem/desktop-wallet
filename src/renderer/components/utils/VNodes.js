export default {
  functional: true,

  props: {
    vnodes: {
      type: [Array, Object],
      required: true
    }
  },

  render: (h, ctx) => ctx.props.vnodes
}
