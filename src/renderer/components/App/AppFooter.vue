<template>
  <footer class="AppFooter flex justify-center mt-1">
    <a
      :title="text"
      class="cursor-pointer text-theme-footer-text"
      @click="electron_openExternal(url)"
    >{{ text }}</a>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',

  data: () => ({
    text: 'Made with ♥ by Ark',
    url: 'https://ark.io'
  })
}
</script>
