<template>
  <div class="Navigation">
    <!-- Left Button -->
    <div
      class="Navigation__left"
      :class="leftButtonClass"
      @click="triggerPageAdvance('backward')"
    >
      <SvgIcon
        name="caret-left"
        view-box="0 0 12 12"
      />
    </div>

    <!-- Right Button -->
    <div
      class="Navigation__right"
      :class="rightButtonClass"
      @click="triggerPageAdvance('forward')"
    >
      <SvgIcon
        name="caret-right"
        view-box="0 0 12 12"
      />
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon/SvgIcon'

export default {
  name: 'Navigation',

  components: {
    SvgIcon
  },

  props: {
    leftButtonClass: {
      type: String,
      required: false,
      default: null
    },

    rightButtonClass: {
      type: String,
      required: false,
      default: null
    }
  },

  methods: {
    triggerPageAdvance (direction) {
      this.$emit('navigationclick', direction)
    }
  }
}
</script>

<style scoped>
.Navigation__left,
.Navigation__right {
  @apply .absolute .rounded .bg-theme-button .text-theme-button-text .flex .pin-y .my-auto .cursor-pointer .shadow;
  width: 35px;
  height: 35px;
}

.Navigation__left:hover,
.Navigation__right:hover {
  @apply .bg-theme-button-active;
}

.Navigation__left {
  @apply .pin-l;
  padding-right: 0.125rem;
}

.Navigation__right {
  @apply .pin-r;
}

.Navigation__left .SvgIcon,
.Navigation__right .SvgIcon {
  @apply .m-auto;
}
</style>
