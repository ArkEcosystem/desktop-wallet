<template>
  <li
    class="MenuOptionsItem text-theme-settings-text cursor-pointer"
    @click="emitClick"
  >
    <div
      :class="$slots['controls'] ? 'border-dashed' : 'border-solid'"
      class="MenuOptionsItem__container transition flex items-center justify-between mx-10 py-5 border-b border-theme-settings-border"
    >
      <div class="select-none">
        <slot name="title">
          <span :class="$slots['controls'] ? 'text-grey-light' : ''" >{{ title }}</span>
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

  methods: {
    emitClick () {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.MenuOptionsItem:hover {
  background-color: #3a4060;
  color: #b3bbe8;
}
.MenuOptionsItem:hover > .MenuOptionsItem__container {
  border-color: transparent;
}
</style>
