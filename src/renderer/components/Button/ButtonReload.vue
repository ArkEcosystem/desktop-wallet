<template>
  <button
    v-tooltip="{
      content: title,
      trigger: 'hover',
      ...(tooltipPlacement && { placement: tooltipPlacement })
    }"
    :class="[
      withoutBackground ? 'hover:bg-transparent' : `py-2 px-4 rounded ${colorClass ? colorClass : 'bg-theme-button-light text-theme-button-light-text'}`
    ]"
    class="ButtonReload cursor-pointer inline-flex items-center self-stretch"
    :disabled="isRefreshing"
    @click="emitClick"
  >
    <span v-if="text.length && !isRefreshing">
      {{ text }}
    </span>
    <SvgIcon
      v-else
      :class="[
        isRefreshing ? 'rotate-360' : '',
        textClass
      ]"
      class="mx-1"
      name="reload"
      :view-box="viewBox"
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
    text: {
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
    },
    viewBox: {
      type: String,
      required: false,
      default: '0 0 15 14'
    },
    tooltipPlacement: {
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
