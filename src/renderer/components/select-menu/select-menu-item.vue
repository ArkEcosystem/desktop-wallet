<template>
  <li
    :class="[
      isActive ? 'active bg-theme-feature-item-hover text-theme-feature-item-selected-text' : 'text-grey-dark hover:bg-theme-feature-item-hover-alternative border-grey-light'
      ,'select-menu-item cursor-pointer bt-theme-feature']"
    @click.stop="$emit('click', value)">
    <div
      class="select-menu-item-container mx-8 py-4 px-5 border-b text-center transition">
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
  }
}
</script>

<style scoped>
.select-menu-item:hover > .select-menu-item-container,
.select-menu-item.active .select-menu-item-container {
  border-color: transparent
}
</style>
