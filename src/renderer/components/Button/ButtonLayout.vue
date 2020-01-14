<template>
  <div class="flex items-center">
    <button
      class="ButtonLayout flex mr-1"
      :disabled="gridLayout"
      @click="emitClick()"
    >
      <SvgIcon
        class="fill-current"
        name="grid"
        view-box="0 0 16 16"
      />
    </button>

    <button
      class="ButtonLayout flex"
      :disabled="!gridLayout"
      @click="emitClick()"
    >
      <SvgIcon
        class="fill-current"
        name="tabular"
        view-box="0 0 16 16"
      />
    </button>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'ButtonLayout',

  components: {
    SvgIcon
  },

  props: {
    gridLayout: {
      type: Boolean,
      required: true
    }
  },

  methods: {
    emitClick () {
      this.$emit('click')
    }
  }
}
</script>

<style>
.ButtonLayout {
  @apply text-theme-option-button-text border-none p-2 rounded;
  transition: all 0.4s;
}
.ButtonLayout:hover {
  @apply bg-theme-button;
  opacity: 0.5;
}
.ButtonLayout:disabled {
  @apply bg-theme-button
}
</style>
