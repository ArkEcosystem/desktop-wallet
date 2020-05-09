<template>
  <div class="CollapseAccordion">
    <slot />
  </div>
</template>

<script>
import { isEmpty } from '@/utils'

export default {
  name: 'CollapseAccordion',

  model: {
    prop: 'id',
    event: 'input'
  },

  provide () {
    return {
      collapseClick: this.collapseClick
    }
  },

  props: {
    id: {
      type: [String, Number],
      required: false,
      default: null
    },
    items: {
      type: Array,
      required: false,
      default: () => this.collections_filterChildren('Collapse') || []
    }
  },

  data: vm => ({
    inputId: vm.id
  }),

  watch: {
    id (val) {
      this.$nextTick(() => (this.inputId = val))
    },

    inputId () {
      this.toggleCollapse()
    },

    items () {
      this.toggleCollapse()
    }
  },

  mounted () {
    if (isEmpty(this.items)) return

    this.toggleCollapse()
  },

  methods: {
    // Called by the child
    collapseClick (id) {
      this.$nextTick(() => (this.inputId = id))
    },

    toggleCollapse () {
      this.items.forEach(item => {
        item.collapse(this.inputId)
      })
      this.$emit('input', this.inputId)
    }
  }
}
</script>
