<template>
  <div>
    <ul
      :class="classes"
      class="MenuOptions relative bg-theme-settings list-reset flex rounded py-5"
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
    },

    singleColumn: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  computed: {
    classes () {
      const classes = [this.isHorizontal ? 'MenuOptions--horizontal' : 'MenuOptions--vertical']
      if (!this.isHorizontal) {
        classes.push(this.isSettings ? 'MenuOptions__settings--vertical' : 'MenuOptions__default--vertical')
      }
      if (this.singleColumn) {
        classes.push('flex-col')
      }

      return classes.join(' ')
    }
  }
}
</script>

<style lang="postcss">
.MenuOptions .MenuOptionsItem:last-child .MenuOptionsItem__container {
  border: none;
}

.MenuOptions__default--vertical:after {
  top: 86px;
}

.MenuOptions__settings--vertical:after {
  bottom: 230px;
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
