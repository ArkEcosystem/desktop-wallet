<template>
  <div class="Slider-navigation">
    <!-- Left Button -->
    <div
      class="Slider-navigation__left"
      @click.prevent="triggerPageAdvance('backward')"
    >
      <SvgIcon
        name="caret-left"
        view-box="0 0 12 12"
      />
    </div>

    <!-- Right Button -->
    <div
      class="Slider-navigation__right"
      @click.prevent="triggerPageAdvance('forward')"
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

  methods: {
    triggerPageAdvance (direction) {
      this.$emit('navigationclick', direction)
    }
  }
}
</script>

<style scoped>
.Slider-navigation__left,
.Slider-navigation__right {
  @apply .absolute .rounded .bg-theme-button .text-theme-button-text .flex .pin-y .my-auto .cursor-pointer .shadow;
  width: 35px;
  height: 35px;
}

.Slider-navigation__left:hover,
.Slider-navigation__right:hover {
  @apply .bg-theme-button-active;
}

.Slider-navigation__left {
  @apply .pin-l .-ml-2;
  padding-right: 0.125rem;
}

.Slider-navigation__right {
  @apply .pin-r .-mr-2;
}

.Slider-navigation__left .SvgIcon,
.Slider-navigation__right .SvgIcon {
  @apply .m-auto;
}
</style>
