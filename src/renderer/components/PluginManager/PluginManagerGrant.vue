<template>
  <div
    v-tooltip="{
      content: $t('PAGES.PLUGIN_MANAGER.OFFICIAL', { author }),
      placement: 'bottom'
    }"
    class="PluginManagerGrant"
  >
    <SvgIcon
      name="ark-grant"
      view-box="0 0 16 16"
    />
  </div>
</template>

<script>
import { PLUGINS } from '@config'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'PluginManagerGrant',

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
.PluginManagerGrant {
  @apply flex items-center ml-1 w-4 h-4;
  color: #ffae10;
}
</style>
