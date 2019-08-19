<template>
  <nav class="MenuNavigation bg-theme-feature">
    <slot />
  </nav>
</template>

<script>
export default {
  name: 'MenuNavigation',

  provide () {
    return {
      switchToItem: this.switchToItem
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
    id (value) {
      if (this.activeId !== value) {
        this.activateItem(value)
      }
    }
  },

  mounted () {
    this.collectItems()

    if (this.activeId) {
      this.activateItem(this.activeId)
    }
  },

  methods: {
    collectItems () {
      this.items = this.collections_filterChildren('MenuNavigationItem') || []
    },

    activateItem (itemId) {
      this.items.forEach(item => item.toggle(item.id === itemId))
      this.activeId = itemId
    },

    switchToItem (itemId) {
      if (this.activeId !== itemId) {
        this.activateItem(itemId)
        this.$emit('input', this.activeId)
      }
    }
  }
}
</script>
