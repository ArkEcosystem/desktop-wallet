<template>
  <button
    class="flex text-blue font-semibold items-center p-2 -ml-2"
    @click="emitClick"
  >
    <SvgIcon
      :name="`menu-${isOpen ? 'open' : 'closed'}`"
      view-box="0 0 17 17"
      class="mr-2"
    />
    <span>
      {{ $t('PAGES.PLUGIN_MANAGER.MENU') }}
    </span>
  </button>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'PluginManagerButtonMenu',

  components: {
    SvgIcon
  },

  props: {
    isOpen: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  methods: {
    emitClick () {
      this.$emit('click')
    }
  }
}
</script>
