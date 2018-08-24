<template>
  <div class="CollapsibleStepper">
    <slot />
  </div>
</template>

<script>
import { last } from 'lodash'

export default {
  name: 'CollapsibleStepper',

  props: {
    step: {
      type: [String, Number],
      required: true
    }
  },

  data: () => ({
    items: []
  }),

  watch: {
    step () {
      this.switchToStep(this.step)
    }
  },

  mounted () {
    this.collectItems()

    // The last item has a different style and text on the default footer
    const lastStep = last(this.items)
    if (lastStep) {
      lastStep.isLastItem = true
    }

    this.switchToStep(this.step)
  },

  methods: {
    collectItems () {
      this.items = this.$children.filter(child => {
        return child.$options.name === 'CollapsibleStepperItem'
      })
    },

    switchToStep (newStep) {
      this.items.forEach(item => item.toggle(item.step === newStep))
    }
  }
}
</script>
