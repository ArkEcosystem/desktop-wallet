<template>
  <div>
    <ul
      :class="isHorizontal ? 'MenuOptions--horizontal' : 'MenuOptions--vertical'"
      class="MenuOptions relative bg-theme-settings list-reset flex flex-col rounded py-5"
    >
      <slot />
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MenuOptions',

  props: {
    isHorizontal: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="postcss">
.MenuOptions .MenuOptionsItem:last-child .MenuOptionsItem__container {
  border: none;
}

.MenuOptions--vertical:after {
  border-color: transparent;
  border-style: solid;
  border-right-color: config('colors.theme-settings');
  border-width: 10px;
  position: absolute;
  content: "";
  top: 20px;
  left: -20px;
  width: 20px;
  height: 0;
  pointer-events: none;
}

.MenuOptions--horizontal:after {
  border-color: transparent;
  border-style: solid;
  border-bottom-color: config('colors.theme-settings');
  border-width: 10px;
  position: absolute;
  content: "";
  top: -20px;
  right: 20px;
  width: 20px;
  height: 0;
  pointer-events: none;
}
</style>
