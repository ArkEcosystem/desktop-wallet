<template>
  <div
    class="PluginLogo"
    :style="{ height: `${size}px`, width: `${size}px` }"
  >
    <img
      v-if="plugin.logo"
      class="PluginLogo__image"
      :src="`data:image/png;base64,${plugin.logo}`"
    >

    <PluginIdenticon
      v-else
      :value="plugin.id"
      :size="size"
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

.PluginLogo__image {
  @apply w-full h-full;
  object-fit: cover;
}
</style>
