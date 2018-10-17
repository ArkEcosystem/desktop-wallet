<template>
  <ul class="MenuOptions bg-theme-settings list-reset flex flex-col rounded py-5">
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'MenuOptions'
}
</script>

<style>
.MenuOptions .MenuOptionsItem:last-child .MenuOptionsItem__container {
  border: none;
}
</style>
