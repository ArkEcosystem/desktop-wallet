<template>
  <li class="SearchFilterItem flex flex-col">
    <span
      v-if="label"
      class="text-grey-dark text-sm display-block mb-1"
    >
      {{ label }}
    </span>
    <slot />
  </li>
</template>

<script>
export default {
  name: 'SearchFilterItem',

  props: {
    label: {
      type: String,
      required: false,
      default: null
    }
  }
}
</script>

<style lang="postcss" scoped>
.SearchFilterItem {
  @apply .px-5 .border-l .border-theme-settings-border
}
</style>
