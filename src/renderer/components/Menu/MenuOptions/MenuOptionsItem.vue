<template>
  <li
    class="MenuOptionsItem text-theme-settings-text cursor-pointer"
    @click="emitClick"
  >
    <div
      :class="hasControls ? 'border-dashed' : 'border-solid'"
      class="MenuOptionsItem__container transition flex items-center justify-between mx-10 py-5 border-b border-theme-settings-border"
    >
      <div class="select-none">
        <slot name="title">
          <span :class="hasControls ? 'text-theme-settings-control-title' : ''">
            {{ title }}
          </span>
        </slot>
      </div>

      <div>
        <slot name="controls" />
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'MenuOptionsItem',

  props: {
    title: {
      type: String,
      required: true
    }
  },

  computed: {
    hasControls () {
      return !!this.$slots.controls
    }
  },

  methods: {
    emitClick () {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.MenuOptionsItem:hover {
  background-color: var(--theme-settings-hover);
  color: var(--theme-settings-text-hover);
}
.MenuOptionsItem:hover > .MenuOptionsItem__container {
  border-color: transparent;
}
</style>
