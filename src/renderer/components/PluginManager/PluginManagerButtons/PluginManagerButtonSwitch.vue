<template>
  <button
    :class="{
      'PluginManagerButtonSwitch--active': inputIsActive
    }"
    :disabled="isDisabled"
    class="PluginManagerButtonSwitch"
    type="button"
    @click="toggle"
  >
    <span class="mr-4 text-theme-page-text">
      {{ label }}
    </span>
    <span class="PluginManagerButtonSwitch__line">
      <span
        :class="{
          'bg-theme-option-button-text': !inputIsActive,
          'bg-blue': inputIsActive
        }"
        class="PluginManagerButtonSwitch__circle transition"
      />
    </span>
  </button>
</template>

<script>
export default {
  name: 'PluginManagerButtonSwitch',

  model: {
    prop: 'isActive',
    event: 'change'
  },

  props: {
    isActive: {
      type: Boolean,
      required: false,
      default: false
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    labels: {
      type: Object,
      required: false,
      default: () => ({
        active: 'PAGES.PLUGIN_MANAGER.ENABLED',
        inactive: 'PAGES.PLUGIN_MANAGER.DISABLED'
      })
    }
  },

  data: vm => ({
    inputIsActive: vm.isActive
  }),

  computed: {
    model: {
      get () {
        return this.inputIsActive
      },
      set (value) {
        this.inputIsActive = value
        this.$emit('change', value)
      }
    },

    label () {
      return this.inputIsActive ? this.$t(this.labels.active) : this.$t(this.labels.inactive)
    }
  },

  watch: {
    isActive (isActive) {
      this.inputIsActive = isActive
    }
  },

  methods: {
    toggle () {
      if (this.isDisabled) {
        return
      }

      this.model = !this.model
    }
  }
}
</script>

<style scoped>
.PluginManagerButtonSwitch {
  min-width: 10rem;
  @apply flex items-center justify-between px-6 py-4 rounded appearance-none border border-theme-button cursor-pointer bg-transparent
}
.PluginManagerButtonSwitch .PluginManagerButtonSwitch__line {
  @apply relative w-8 h-1 rounded-full relative bg-theme-switch-button
}
.PluginManagerButtonSwitch .PluginManagerButtonSwitch__circle {
  transform: translateX(-100%);
  top: 50%;
  @apply absolute rounded-full w-4 h-4 -mt-2
}
.PluginManagerButtonSwitch--active .PluginManagerButtonSwitch__circle {
  transform: translateX(0%)
}
</style>
