<template>
  <div
    class="PluginLogo"
    :style="{ height: `${size}px`, width: `${size}px` }"
  >
    <img
      v-if="plugin.logo"
      :src="`data:image/png;base64,${plugin.logo}`"
    >

    <PluginIdenticon
      v-else
      :value="plugin.id"
      :size="size"
      shape="square"
      :show-network-symbol="false"
    />
  </div>
</template>

<script>
import PluginIdenticon from '@/components/PluginManager/PluginIdenticon'

export default {
  name: 'PluginLogo',

  components: {
    PluginIdenticon
  },

  props: {
    plugin: {
      type: Object,
      required: true
    },
    size: {
      type: Number,
      required: false,
      default: 80
    }
  }
}
</script>

<style lang="postcss" scoped>
.PluginLogo {
  @apply rounded-lg overflow-hidden;
}
</style>
