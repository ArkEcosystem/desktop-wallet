<template>
  <div
    v-tooltip="{
      content: $t('PAGES.PLUGIN_MANAGER.OFFICIAL', { author }),
      placement: 'bottom'
    }"
    class="PluginManagerCheckmark"
  >
    <SvgIcon
      name="checkmark"
      view-box="0 0 6 6"
    />
  </div>
</template>

<script>
import { PLUGINS } from '@config'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'PluginManagerCheckmark',

  components: {
    SvgIcon
  },

  computed: {
    author () {
      return PLUGINS.officialAuthor
    }
  }
}
</script>

<style lang="postcss" scoped>
.PluginManagerCheckmark {
  @apply flex items-center justify-center text-white mr-1 rounded-full w-3 h-3 bg-blue
}
</style>
