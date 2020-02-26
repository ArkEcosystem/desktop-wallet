<template>
  <button
    class="ButtonIconGeneric blue-button"
    :class="isSmall ? 'blue-small-button' : 'blue-button'"
    :disabled="disabled"
    @click="emitClick"
  >
    <SvgIcon
      :name="icon"
      :view-box="viewBox"
    />
  </button>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'ButtonIconGeneric',

  components: {
    SvgIcon
  },

  props: {
    icon: {
      type: String,
      required: true
    },
    viewBox: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    isSmall: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  methods: {
    emitClick () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="postcss" scoped>
.ButtonIconGeneric {
  @apply flex items-center px-6
}
</style>
