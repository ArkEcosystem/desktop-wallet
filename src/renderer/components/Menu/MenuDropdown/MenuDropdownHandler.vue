<template>
  <div
    :class="[
      value ? '' : 'text-theme-page-text-light hover:text-theme-page-text',
      'MenuDropdownHandler cursor-pointer transition flex justify-between items-center']"
    @click="emitClick">
    <span>
      <slot>
        <span v-if="prefix.length">{{ prefix }}</span>
        <span>{{ value || placeholder }}</span>
      </slot>
    </span>

    <span class="pl-2 pr-1">
      <SvgIcon
        name="arrow-dropdown"
        view-box="0 0 20 20" />
    </span>
  </div>
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

    prefix: {
      type: String,
      required: false,
      default: ''
    }
  },

  methods: {
    emitClick () {
      this.$emit('click')
    }
  }
}
</script>
