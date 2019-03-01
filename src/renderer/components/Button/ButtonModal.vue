<template>
  <button
    class="flex items-center justify-center"
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
    }
  },

  data: () => ({
    isOpen: false
  }),

  methods: {
    toggle () {
      this.isOpen = !this.isOpen
    }
  }
}
</script>
