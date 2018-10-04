<template>
  <!-- TODO do not show last separator line -->
  <ul
    class="ListDivided list-reset w-full"
  >
    <template v-if="items">
      <ListDividedItem
        v-for="(value, key) in items"
        :key="key"
        :label="key"
        :value="value"
      />
    </template>
    <template v-else>
      <slot />
    </template>
  </ul>
</template>

<script>
import ListDividedItem from './ListDividedItem'

export default {
  name: 'ListDivided',

  components: {
    ListDividedItem
  },

  provide () {
    return {
      isFloatingLabel: this.isFloatingLabel
    }
  },

  props: {
    isFloatingLabel: {
      type: Boolean,
      required: false,
      default: false
    },
    items: {
      type: Object,
      required: false,
      default: null
    }
  }
}
</script>

<style>
.ListDivided > .ListDividedItem:last-child {
  border-bottom-color: transparent
}
</style>
