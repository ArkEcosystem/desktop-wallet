<template>
  <footer class="AppFooter flex justify-center mt-1">
    <a
      :title="text"
      class="cursor-pointer text-blue-lighter"
      @click="electron_openExternal(url)"
    >{{ text }}</a>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',

  data: () => ({
    text: 'Made with ♥ ARK',
    url: 'https://ark.io'
  })
}
</script>
