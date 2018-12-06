<template>
  <svg
    v-bind="styles"
    :viewBox="viewBox"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    class="SvgIcon fill-current"
  >
    <use :xlink:href="'#' + name" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',

  props: {
    name: {
      type: String,
      required: true
    },
    viewBox: {
      type: [Array, String],
      required: false,
      default: '0 0 50 50'
    }
  },

  computed: {
    styles () {
      const size = Array.isArray(this.viewBox) ? this.viewBox : this.viewBox.split(' ')
      const [x, y, width, height] = size.map(i => i + 'px')

      return { x, y, width, height }
    }
  }
}
</script>
