<template>
  <ul class="MenuOptions list-reset flex flex-col rounded py-5">
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'MenuOptions'
}
</script>

<style scoped>
.MenuOptions {
  background-color: var(--theme-settings-background);
}

.MenuOptions >>> .MenuOptionsItem:last-child .MenuOptionsItem__container {
  border: none;
}
</style>
