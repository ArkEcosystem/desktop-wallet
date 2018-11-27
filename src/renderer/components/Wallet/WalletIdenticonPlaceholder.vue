<template>
  <div class="relative">
    <div
      :style="{
        height: `${size}px`,
        width: `${size}px`,
        backgroundImage: `url('${assets_loadImage(imagePath)}')`
      }"
      class="WalletIdenticonPlaceholder"
    />
  </div>
</template>

<script>
export default {
  name: 'WalletIdenticonPlaceholder',

  props: {
    size: {
      type: Number,
      required: true
    }
  },

  computed: {
    imagePath () {
      const theme = this.session_hasDarkTheme ? 'dark' : 'light'
      return `identicons/identicon-placeholder-${theme}.svg`
    }
  }
}
</script>

<style>
.WalletIdenticonPlaceholder {
  overflow: hidden;
  padding: 0px;
  margin: 0px;
  display: inline-block;
}
</style>
