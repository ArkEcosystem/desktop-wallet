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
</style>
