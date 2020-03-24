<template>
  <div
    v-tooltip="{
      content: $t('PAGES.PLUGIN_MANAGER.GRANTS', { author }),
      placement: 'bottom'
    }"
    class="PluginManagerGrants"
  >
    <SvgIcon
      name="ark-grants"
      view-box="0 0 16 16"
    />
  </div>
</template>

<script>
import { PLUGINS } from '@config'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'PluginManagerGrants',

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
.PluginManagerGrants {
  @apply flex items-center ml-1 w-4 h-4;
  color: #ffae10;
}
</style>
