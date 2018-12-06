<template>
  <footer class="AppFooter flex justify-center mt-1">
    <a
      :title="text"
      class="cursor-pointer text-theme-footer-text"
      @click="electron_openExternal(url)"
    >
      {{ text }}
    </a>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',

  data: () => ({
    text: '',
    url: 'https://phantom.org'
  }),

  created () {
    this.text = this.$t('APP_FOOTER.TEXT')
  }
}
</script>
