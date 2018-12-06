<template>
  <button
    v-tooltip="{ content: title, trigger:'hover' }"
    :class="[
      withoutBackground ? 'hover:bg-transparent' : `py-2 px-4 rounded ${colorClass ? colorClass : 'bg-theme-button-light text-theme-button-light-text'}`
    ]"
    class="ButtonReload cursor-pointer flex items-center self-stretch"
    @click="emitClick"
  >
    <SvgIcon
      :class="[
        isRefreshing ? 'rotate-360' : '',
        textClass
      ]"
      class="mx-1"
      name="update"
      view-box="0 0 16 14"
    />
  </button>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'ButtonReload',

  components: {
    SvgIcon
  },

  props: {
    isRefreshing: {
      type: Boolean,
      required: false,
      default: false
    },
    colorClass: {
      type: String,
      required: false,
      default: ''
    },
    textClass: {
      type: String,
      required: false,
      default: 'text-grey-dark'
    },
    withoutBackground: {
      type: Boolean,
      required: false,
      default: false
    },
    title: {
      type: String,
      required: false,
      default: ''
    }
  },

  methods: {
    emitClick () {
      this.$emit('click')
    }
  }
}
</script>
