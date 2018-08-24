<template>
  <li
    class="OptionsMenuItem cursor-pointer"
    @click="emitClick">
    <div
      :class="$slots['controls'] ? 'border-dashed' : 'border-solid'"
      class="OptionsMenuItem__container transition flex items-center justify-between mx-10 py-5 border-b">
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
  },

  methods: {
    emitClick () {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.OptionsMenuItem {
  color: #a6add5
}
.OptionsMenuItem:hover {
  background-color: #3a4060;
  color: #b3bbe8
}
.OptionsMenuItem:hover > .OptionsMenuItem__container {
  border-color: transparent
}
.OptionsMenuItem__container {
  border-color: #474d71
}
</style>
