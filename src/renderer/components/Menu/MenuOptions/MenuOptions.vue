<template>
  <div>
    <ul
      :class="classes"
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
    },
    isSettings: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    classes () {
      var classes = this.isHorizontal ? 'MenuOptions--horizontal' : 'MenuOptions--vertical'
      if (!this.isHorizontal) {
        classes += ' '
        classes += this.isSettings ? 'MenuOptions__settings--vertical' : 'MenuOptions__default--vertical'
      }
      return classes
    }
  }
}
</script>

<style lang="postcss">
.MenuOptions .MenuOptionsItem:last-child .MenuOptionsItem__container {
  border: none;
}

.MenuOptions__default--vertical:after {
  top: 20px;
}

.MenuOptions__settings--vertical:after {
  top: 110px;
}

.MenuOptions--vertical:after {
  border-color: transparent;
  border-style: solid;
  border-right-color: config('colors.theme-settings');
  border-width: 10px;
  position: absolute;
  content: "";
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
