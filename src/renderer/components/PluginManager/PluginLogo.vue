<template>
  <div
    class="PluginLogo__wrapper"
    :class="isModal ? 'border-theme-modal' : 'border-theme-table-row-hover'"
  >
    <div
      class="PluginLogo object-contain"
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
  },

  computed: {
    isModal () {
      return this.size > 80
    }
  }
}
</script>

<style lang="postcss" scoped>
.PluginLogo__wrapper {
  @apply rounded-lg overflow-hidden border;
}

.PluginLogo {
  @apply flex items-center;
}
</style>
