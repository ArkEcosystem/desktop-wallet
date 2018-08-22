<template>
  <ul class="options-menu list-reset flex flex-col rounded py-5">
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'OptionsMenu'
}
</script>

<style scoped>
.options-menu {
  background-color: #343956;
}

.list-reset >>> .options-menu-item:last-child .options-menu-item-container {
  border: none
}
</style>
