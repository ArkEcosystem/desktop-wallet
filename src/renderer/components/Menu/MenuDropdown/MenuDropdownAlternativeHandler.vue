<template>
  <button
    class="flex items-center"
  >
    <span class="rounded border border-theme-settings-border mr-2">
      <SvgIcon
        :class="{
          'rotate-vertical': isOpen
        }"
        name="arrow-dropdown"
        view-box="0 0 8 8"
        class="transition align-middle"
      />
    </span>
    <span class="font-semibold">
      {{ value || placeholder }}
    </span>
  </button>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'MenuDropdownAlternativeHandler',

  components: {
    SvgIcon
  },

  props: {
    value: {
      type: String,
      required: false,
      default: null
    },
    placeholder: {
      type: String,
      required: false,
      default: null
    },
    isOpen: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style scoped>
.rotate-vertical {
  transform: rotate(-180deg);
}
</style>
