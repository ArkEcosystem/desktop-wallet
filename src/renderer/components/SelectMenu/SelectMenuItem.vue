<template>
  <li
    :class="[
      isActive ? 'SelectMenuItem--active bg-theme-feature-item-hover text-theme-feature-item-selected-text' : 'text-grey-dark hover:bg-theme-feature-item-alternative border-grey-light'
      ,'SelectMenuItem cursor-pointer bt-theme-feature']"
    @click.stop="emitClick">
    <div
      class="SelectMenuItem__container mx-8 py-4 px-5 border-b text-center transition">
      <slot>
        <span class="font-semibold">{{ value }}</span>
      </slot>
    </div>
  </li>
</template>

<script>
export default {
  name: 'SelectMenuItem',

  props: {
    value: {
      type: String,
      required: true
    },

    isActive: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  methods: {
    emitClick () {
      this.$emit('click', this.value)
    }
  }
}
</script>

<style scoped>
.SelectMenuItem:hover > .SelectMenuItem__container,
.SelectMenuItem--active .SelectMenuItem__container {
  border-color: transparent
}
</style>
