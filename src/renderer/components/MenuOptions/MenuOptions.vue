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
  background-color: #343956;
}

.MenuOptions >>> .MenuOptionsItem:last-child .MenuOptionsItem__container {
  border: none;
}
</style>
