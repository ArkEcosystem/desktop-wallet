<template>
  <ul class="OptionsMenu list-reset flex flex-col rounded py-5">
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'OptionsMenu'
}
</script>

<style scoped>
.OptionsMenu {
  background-color: #343956;
}

.OptionsMenu >>> .OptionsMenuItem:last-child .OptionsMenuItem__container {
  border: none;
}
</style>
