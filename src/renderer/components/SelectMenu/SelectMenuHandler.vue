<template>
  <div
    :class="[
      value ? '' : 'text-theme-page-text-light hover:text-theme-page-text',
      'SelectMenuHandler cursor-pointer transition flex items-center']"
    @click="emitClick">
    <span class="w-5/6">
      <slot>
        <span class="font-semibold">{{ value || placeholder }}</span>
      </slot>
    </span>

    <span class="w-1/6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
        class="fill-current w-4 h-4 align-middle">
        <g>
          <polygon points="128,192 256,320 384,192" />
        </g>
      </svg>
    </span>
  </div>
</template>

<script>
export default {
  name: 'SelectMenuHandler',

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
