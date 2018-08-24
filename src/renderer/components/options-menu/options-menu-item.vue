<template>
  <li
    class="options-menu-item cursor-pointer"
    @click="$emit('click')">
    <div
      :class="$slots['controls'] ? 'border-dashed' : 'border-solid'"
      class="options-menu-item-container transition flex items-center justify-between mx-10 py-5 border-b">
      <div>
        <slot name="title">
          <span
            :class="$slots['controls'] ? 'text-grey-light' : ''">{{ title }}</span>
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
  name: 'OptionsMenuItem',

  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.options-menu-item {
  color: #a6add5
}
.options-menu-item:hover {
  background-color: #3a4060;
  color: #b3bbe8
}
.options-menu-item:hover > .options-menu-item-container {
  border-color: transparent
}
.options-menu-item-container {
  border-color: #474d71
}
</style>
