<template>
  <button
    class="ButtonClose float-right leading-none -m-2 ml-4 rounded-lg"
    @click="emitClick"
  >
    <SvgIcon
      class="ButtonClose__cross fill-current text-white"
      name="cross"
      view-box="0 0 11 10" />
  </button>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'ButtonClose',

  components: {
    SvgIcon
  },

  methods: {
    emitClick () {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.ButtonClose {
  width: 35px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.2);
}

.ButtonClose:hover {
  background: rgba(0, 0, 0, 0.1);
}
</style>
