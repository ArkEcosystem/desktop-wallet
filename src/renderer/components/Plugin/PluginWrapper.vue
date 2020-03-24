<script>
import { Wormhole } from 'portal-vue'
export default {
  name: 'PluginWrapper',

  computed: {
    footerSlot () {
      return this.$slots.footer
    }
  },

  mounted () {
    if (this.footerSlot) {
      this.$nextTick(() => {
        Wormhole.open({
          to: 'plugin-footer',
          from: 'plugin-wrapper',
          passengers: this.footerSlot
        })
      })
    }
  },

  beforeDestroy () {
    if (this.footerSlot) {
      this.$nextTick(() => {
        Wormhole.close({
          to: 'plugin-footer',
          from: 'plugin-wrapper'
        })
      })
    }
  },

  render (h) {
    const children = this.$slots.default
    return children
      ? h('div', children)
      : h()
  }
}
</script>
