<template>
  <div class="flex items-center w-full">
    <SvgIcon
      name="search"
      view-box="0 0 14 14"
      class="mr-2 text-theme-page-text-light"
    />

    <input
      ref="search"
      class="w-full"
      :placeholder="$t('PAGES.PLUGIN_MANAGER.SEARCH')"
      @keyup.esc="onEscKey"
      @input="update"
    >
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import debounce from 'lodash/debounce'

export default {
  name: 'PluginManagerSearchBar',

  components: {
    SvgIcon
  },

  data: () => ({
    query: null
  }),

  watch: {
    query () {
      this.emitSearch()
    }
  },

  methods: {
    update: debounce(function (event) {
      console.log('debounced')
      this.query = event.target.value
    }, 500),

    emitSearch () {
      if (this.query && this.query.length >= 3) {
        this.$emit('search', this.query)
      }
    },

    onEscKey () {
      this.query = null
      this.$refs.search.blur()
    }
  }
}
</script>
