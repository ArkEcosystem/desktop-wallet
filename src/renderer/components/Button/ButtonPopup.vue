<template>
  <button
    class="mr-2 p-2 rounded-lg flex items-center justify-center"
    @click="toggle"
  >
    <SvgIcon
      v-if="icon"
      :name="icon"
      :view-box="viewBox"
      class="mr-1"
    />
    <span class="font-semibold">{{ label }}</span>
    <portal
      v-if="showPopup"
      to="modal"
    >
      <slot :toggle="toggle" />
    </portal>
  </button>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'ButtonPopup',

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
    showPopup: false
  }),

  methods: {
    toggle () {
      this.showPopup = !this.showPopup
    }
  }
}
</script>
