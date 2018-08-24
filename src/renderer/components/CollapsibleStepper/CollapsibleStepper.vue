<template>
  <div class="CollapsibleStepper">
    <slot />
  </div>
</template>

<script>
import { last, first } from 'lodash'

export default {
  name: 'CollapsibleStepper',

  props: {
    value: {
      type: [String, Number],
      required: false,
      default: null
    }
  },

  data: () => ({
    inputValue: null,
    steps: []
  }),

  watch: {
    inputValue (val) {
      this.steps.forEach(step => step.toggle(val))
    },

    value () {
      this.$nextTick(() => (this.inputValue = this.value))
    }
  },

  mounted () {
    this.setSteps()
    const firstStep = first(this.steps)
    const lastStep = last(this.steps)

    if (lastStep) {
      lastStep.isLastItem = true
    }

    const step = firstStep ? firstStep.step : 1

    this.inputValue = this.value || step
  },

  methods: {
    setSteps () {
      this.steps = this.$children.filter(child => child.$options.name === 'StepperItem')
    }
  }
}
</script>
