<template>
  <button
    :class="[
      value ? '' : 'text-theme-page-text-light hover:text-theme-page-text',
      'MenuDropdownHandler cursor-pointer transition flex justify-between items-center text-inherit']"
    @click="emitClick"
    @blur="onBlur"
  >
    <span>
      <slot>
        <span v-if="prefix.length">
          {{ prefix }}
        </span>
        <span>{{ value || placeholder }}</span>
      </slot>
    </span>

    <span class="flex pl-2 pr-1 rotate-vertical">
      <SvgIcon
        :class="{ 'opacity-25': iconDisabled }"
        name="arrow-dropdown"
        view-box="0 0 20 20"
        transform="rotate(180)"
      />
    </span>
  </button>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'MenuDropdownHandler',

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
      default: 'Select'
    },

    iconDisabled: {
      type: Boolean,
      required: false,
      default: false
    },

    prefix: {
      type: String,
      required: false,
      default: ''
    },

    onBlur: {
      type: Function,
      required: false,
      default: () => {}
    }
  },

  methods: {
    emitClick () {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.rotate-vertical {
  transform: rotate(-180deg);
}
</style>
