<template>
  <span
    v-tooltip="{
      content: tooltipContent,
      trigger: 'hover',
      hideOnTargetClick: false,
      ...(tooltipPlacement && { placement: tooltipPlacement })
    }"
    class="flex items-center"
  >
    <button
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
        name="update"
        :view-box="viewBox"
      />
    </button>
  </span>
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
    alternativeTitle: {
      type: String,
      required: false,
      default: ''
    },
    tooltipPlacement: {
      type: String,
      required: false,
      default: ''
    },
    viewBox: {
      type: String,
      required: false,
      default: '0 0 15 14'
    }
  },

  computed: {
    tooltipContent () {
      if (this.isRefreshing) {
        return this.alternativeTitle
      }

      return this.title
    }
  },

  methods: {
    emitClick () {
      this.$emit('click')
    }
  }
}
</script>
