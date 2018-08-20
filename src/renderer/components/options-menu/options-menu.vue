<template>
  <ul class="options-menu theme-dark list-reset flex flex-col theme-dark bg-theme-feature rounded py-5">
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'OptionsMenu'
}
</script>

<style scoped>
.list-reset >>> .options-menu-item:last-child .options-menu-item-container {
  border: none
}
</style>
