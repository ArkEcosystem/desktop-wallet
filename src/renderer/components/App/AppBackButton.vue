<template>
  <div
    class="AppBackButton relative bg-theme-feature"
  >
    <button
      class="AppBackButton__icon flex items-center justify-center align-center font-bold w-full h-full cursor-pointer flex text-theme-feature-item-text"
      @click.capture.stop="historyBack"
    >
      <SvgIcon
        name="send"
        view-box="0 0 8 8"
      />
      <span
        class="text-bold text-lg ml-2"
      >
        Back
      </span>
    </button>
  </div>
</template>

<script>
import electron from 'electron'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'AppBackButton',

  components: {
    SvgIcon
  },

  methods: {
    historyBack () {
      const window = electron.remote.getCurrentWindow()
      window.webContents.goBack()
    }
  }
}
</script>

<style lang="postcss" scoped>
.AppBackButton {
  @apply .rounded-lg .py-2 .w-22 .mx-6
}
.AppBackButton button {
  transition: all .5s;
}
.AppBackButton:hover button {
  @apply .text-theme-page-text
}
.AppBackButton__icon > svg {
  transform: rotate(-135deg)
}
</style>
