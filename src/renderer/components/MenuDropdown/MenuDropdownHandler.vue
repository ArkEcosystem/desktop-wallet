<template>
  <div
    :class="[
      value ? '' : 'text-theme-page-text-light hover:text-theme-page-text',
      'MenuDropdownHandler cursor-pointer transition flex justify-between items-center']"
    @click="emitClick">
    <span>
      <slot>
        <span>{{ value || placeholder }}</span>
      </slot>
    </span>

    <span class="pl-2 pr-1">
      <svg
        viewBox="0 0 512 512"
        class="fill-current w-4 h-4 align-middle"
      >
        <polygon points="128,192 256,320 384,192" />
      </svg>
    </span>
  </div>
</template>

<script>
export default {
  name: 'MenuDropdownHandler',

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
    }
  },

  methods: {
    emitClick () {
      this.$emit('click')
    }
  }
}
</script>
