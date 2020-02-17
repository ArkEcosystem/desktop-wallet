<template>
  <button
    :class="[classes, 'flex items-center justify-center']"
    @click.stop="toggle"
  >
    <SvgIcon
      v-if="icon"
      :name="icon"
      :view-box="viewBox"
      class="mr-1"
    />
    <span class="font-semibold">
      {{ label }}
    </span>
    <slot
      :toggle="toggle"
      :is-open="isOpen"
    />
  </button>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'ButtonModal',

  components: {
    SvgIcon
  },

  props: {
    classes: {
      type: String,
      required: false,
      default: null
    },

    icon: {
      type: String,
      required: false,
      default: null
    },

    viewBox: {
      type: String,
      required: false,
      default: '0 0 20 20'
    },

    label: {
      type: String,
      required: true
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => ({
    isOpen: false
  }),

  methods: {
    emitToggle () {
      this.$emit('toggle', this.isOpen)
    },

    toggle () {
      if (this.disabled) {
        return
      }

      this.isOpen = !this.isOpen
      this.emitToggle()
    }
  }
}
</script>
