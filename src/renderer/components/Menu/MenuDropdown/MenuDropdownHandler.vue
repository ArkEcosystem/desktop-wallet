<template>
  <button
    :class="[
      value ? '' : 'text-theme-page-text-light hover:text-theme-page-text',
      'MenuDropdownHandler cursor-pointer transition flex justify-between items-center text-inherit']"
    @blur="emitBlur"
    @click="emitClick"
  >
    <span>
      <slot>
        <span v-if="prefix.length">
          {{ prefix }}
        </span>
        <span>{{ item || placeholder }}</span>
      </slot>
    </span>

    <span class="flex pl-2 pr-1">
      <SvgIcon
        :class="{ 'opacity-25': iconDisabled }"
        name="arrow-dropdown"
        view-box="0 0 10 10"
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
    /**
     * The value of the selected option
     */
    value: {
      type: String,
      required: false,
      default: null
    },

    /**
     * The visible text of the selected option
     */
    item: {
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
    }
  },

  methods: {
    emitBlur (event) {
      this.$emit('blur', event)
    },

    emitClick () {
      this.$emit('click')
    }
  }
}
</script>
