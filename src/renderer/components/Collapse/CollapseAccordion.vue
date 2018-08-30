<template>
  <div class="CollapseAccordion">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'CollapseAccordion',

  model: {
    prop: 'id',
    event: 'input'
  },

  provide () {
    return {
      toggleCollapse: this.toggleCollapse
    }
  },

  props: {
    id: {
      type: [String, Number],
      required: false,
      default: null
    }
  },

  data: vm => ({
    inputId: vm.id,
    items: []
  }),

  watch: {
    id (val) {
      this.inputId = val
    }
  },

  mounted () {
    this.items = this.collections_filterChilds('Collapse') || []
    this.toggleCollapse(this.inputId)
  },

  methods: {
    // Called by the child
    toggleCollapse (id) {
      let isOpen

      this.items.forEach(item => {
        // Return a boolean when the id matches
        // To check if the item was opened or closed
        const result = item.collapse(id)
        if (result) {
          isOpen = result
        }
      })

      this.inputId = isOpen ? id : null
      this.$emit('input', this.inputId)
    }
  }
}
</script>
