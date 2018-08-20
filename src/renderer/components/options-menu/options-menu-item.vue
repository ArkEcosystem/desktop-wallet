<template>
  <li
    class="options-menu-item cursor-pointer text-theme-feature-item-text hover:bg-theme-feature-item-hover hover:text-theme-feature-item-hover-text">
    <div
      :class="[
        $slots['controls'] ? 'border-dashed' : 'border-solid',
        'options-menu-item-container transition flex items-center justify-between mx-10 py-5 border-b']">
      <div>
        <slot name="title">
          <span
            :class="$slots['controls'] ? 'text-grey-light' : ''">{{ title }}</span>
        </slot>
      </div>

      <div class="text-">
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
.options-menu-item-container {
  border-color: #474d71
}
.options-menu-item:hover > .options-menu-item-container {
  border-color: transparent
}
</style>
