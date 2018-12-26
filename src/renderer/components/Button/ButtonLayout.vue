<template>
  <div class="flex items-center">
    <button
      class="flex border-none p-1 rounded mr-1"
      :disabled="gridLayout"
      @click="emitClick()"
    >
      <SvgIcon
        class="fill-current"
        name="grid"
        view-box="0 0 16 16"
      />
    </button>

    <button
      class="flex border-none p-1 rounded"
      :disabled="!gridLayout"
      @click="emitClick()"
    >
      <SvgIcon
        class="fill-current"
        name="tabular"
        view-box="0 0 16 16"
      />
    </button>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'ButtonGeneric',

  components: {
    SvgIcon
  },

  props: {
    gridLayout: {
      type: Boolean,
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
