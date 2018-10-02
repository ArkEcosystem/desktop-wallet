<template>
  <span class="InputToggle">
    <InputToggleChoice
      v-for="(choice, index) in choices"
      :choice="choice"
      :selected-choice="selectedChoice"
      :key="index"
      :index="index"
      :length="choices.length"
      @select="emitSelect(choice)"
    />
  </span>
</template>

<script>
import InputToggleChoice from './InputToggleChoice'

export default {
  name: 'InputToggle',

  components: {
    InputToggleChoice
  },

  model: {
    prop: 'selectedChoice',
    event: 'choice-select'
  },

  props: {
    choices: {
      type: Array,
      required: true
    },

    selectedChoice: {
      type: String,
      required: true
    }
  },

  methods: {
    emitSelect (choice) {
      this.$emit('select', choice)
    }
  }
}
</script>
