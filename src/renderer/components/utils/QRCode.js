import QRious from 'qrious'

export default {
  props: {
    value: {
      type: String,
      required: true
    },
    options: {
      type: Object
    }
  },

  watch: {
    value () {
      this.generate()
    },

    options () {
      this.generate()
    }
  },

  mounted () {
    this.generate()
  },

  render (h) {
    return h('canvas', this.$slots.default)
  },

  methods: {
    generate () {
      const qr = new QRious(Object.assign({
        element: this.$el,
        value: this.value
      }, this.options))

      return qr
    }
  }
}
