<script>
import { Wormhole } from 'portal-vue'

export default {
  name: 'PluginWrapper',

  mounted () {
    const footerSlot = this.$scopedSlots && this.$scopedSlots.footer

    if (footerSlot) {
      this.$nextTick(() => {
        Wormhole.open({
          to: 'footer',
          from: 'my-plugin',
          passengers: footerSlot()
        })
      })
    }
  },

  render (h) {
    const defaultSlot = this.$scopedSlots && this.$scopedSlots.default

    return defaultSlot
      ? h('div', defaultSlot())
      : h()
  }
}
</script>
