<template>
  <footer class="flex justify-center mt-1 mb-3">
    <a
      :title="text"
      class="cursor-pointer text-blue-lighter"
      @click="openExternal(url)"
    >{{ text }}</a>
  </footer>
</template>

<script>
export default {
  data: () => ({
    text: 'Made with ♥ ARK',
    url: 'https://ark.io'
  }),

  methods: {
    openExternal (url) {
      require('electron').shell.openExternal(url)
    }
  }
}
</script>
