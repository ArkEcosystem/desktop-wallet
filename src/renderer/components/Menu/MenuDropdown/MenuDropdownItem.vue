<template>
  <li
    :class="
      isActive
        ? 'MenuDropdownItem--active bg-theme-feature-item-hover text-theme-feature-item-selected-text'
        : 'text-grey-dark hover:bg-theme-feature-item-alternative border-grey-light'
    "
    class="MenuDropdownItem cursor-pointer bt-theme-feature"
    @click.stop="emitClick"
  >
    <div
      class="MenuDropdownItem__container mx-8 py-4 px-5 border-b text-center transition">
      <slot>
        <span class="font-semibold">{{ value }}</span>
      </slot>
    </div>
  </li>
</template>

<script>
export default {
  name: 'MenuDropdownItem',

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
.MenuDropdownItem:hover > .MenuDropdownItem__container,
.MenuDropdownItem--active .MenuDropdownItem__container {
  border-color: transparent;
}
</style>
