<template>
  <div
    v-tooltip="{
      content: $t('PAGES.PLUGIN_MANAGER.GRANTS'),
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
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'PluginManagerGrants',

  components: {
    SvgIcon
  }
}
</script>

<style lang="postcss" scoped>
.PluginManagerGrants {
  @apply flex items-center ml-1 w-4 h-4;
  color: #ffae10;
}
</style>
