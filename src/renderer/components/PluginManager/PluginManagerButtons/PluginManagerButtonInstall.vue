<template>
  <button
    class="PluginManagerButtonInstall justify-end"
  >
    <span class="PluginManagerButtonInstall__icon">
      <SvgIcon
        :name="source === 'file' ? 'save': 'open-external'"
        view-box="0 0 14 14"
        class="text-center"
      />
    </span>

    <span class="flex items-center h-10 px-4 whitespace-no-wrap">
      {{ $t(`PAGES.PLUGIN_MANAGER.INSTALL_${source.toUpperCase()}`) }}
    </span>
  </button>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'PluginManagerButtonInstall',

  components: {
    SvgIcon
  },

  props: {
    source: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="postcss" scoped>
.PluginManagerButtonInstall {
  transition: all .1s ease-in;
  @apply .flex .items-center .font-semibold .bg-theme-button .rounded .cursor-pointer .text-theme-button-text .ml-4;
}
.PluginManagerButtonInstall:hover {
  @apply .bg-blue .text-white;
}
.PluginManagerButtonInstall__icon {
  transition: all .1s ease-in;
  @apply .flex .items-center .justify-center .h-10 .w-10 .rounded-l .bg-theme-button-inner-box;
}
.PluginManagerButtonInstall:hover .PluginManagerButtonInstall__icon {
  background-color: #0169f4;
  @apply .text-white;
}
</style>
