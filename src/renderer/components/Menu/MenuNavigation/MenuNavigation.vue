<template>
  <nav class="MenuNavigation bg-theme-feature flex flex-col">
    <slot />
  </nav>
</template>

<script>
export default {
  name: 'MenuNavigation',

  provide () {
    return {
      switchToId: this.switchToId
    }
  },

  model: {
    prop: 'id',
    event: 'input'
  },

  props: {
    id: {
      type: [Number, String],
      required: false,
      default: null
    }
  },

  data: vm => ({
    items: [],
    activeId: vm.id
  }),

  watch: {
    id (val) {
      this.switchToId(val)
    }
  },

  mounted () {
    this.items = this.collectItems()
  },

  methods: {
    collectItems () {
      return this.collections_filterChilds('MenuNavigationItem') || []
    },

    switchToId (id) {
      this.items.forEach(item => item.toggle(item.id === id))
      this.activeId = id
      this.$emit('input', this.activeId)
    }
  }
}
</script>
