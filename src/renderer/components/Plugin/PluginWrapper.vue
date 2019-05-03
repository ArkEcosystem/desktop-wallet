<script>
import { Wormhole } from 'portal-vue'
export default {
  name: 'PluginWrapper',

  mounted () {
    const footerSlot = this.$slots.footer
    if (footerSlot) {
      this.$nextTick(() => {
        Wormhole.open({
          to: 'plugin-footer',
          from: 'plugin-wrapper',
          passengers: footerSlot
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
