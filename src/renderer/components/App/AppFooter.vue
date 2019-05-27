<template>
  <footer class="AppFooter flex justify-center mt-1">
    <PortalTarget name="plugin-footer">
      <a
        :title="text"
        class="cursor-pointer text-theme-footer-text"
        @click="electron_openExternal(url)"
      >
        {{ text }}
      </a>
    </PortalTarget>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',

  data: () => ({
    text: '',
    url: 'https://ark.io'
  }),

  created () {
    this.text = this.$t('APP_FOOTER.TEXT')
  }
}
</script>
