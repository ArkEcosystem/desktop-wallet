<template>
  <button
    class="ButtonClose leading-none -m-2 rounded-lg"
    @click="emitClick"
  >
    <SvgIcon
      :class="iconClass"
      :name="iconName"
      class="ButtonClose__cross fill-current text-theme-feature"
      view-box="0 0 15 15"
    />
  </button>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'ButtonClose',

  components: {
    SvgIcon
  },

  props: {
    iconClass: {
      type: String,
      required: false,
      default: ''
    },
    iconName: {
      type: String,
      required: false,
      default: 'cross'
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
.ButtonClose {
  height: 35px;
  width: 35px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.2);
}
.ButtonClose:hover {
  background: rgba(0, 0, 0, 0.1);
}
</style>
