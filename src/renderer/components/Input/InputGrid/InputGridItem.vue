<template>
  <div
    :style="imagePath ? `backgroundImage: url('${assets_loadImage(imagePath)}')` : ''"
    :title="title"
    :class="{ 'InputGridItem--selected': isSelected }"
    class="InputGridItem relative bg-cover bg-no-repeat bg-center rounded-full w-16 h-16 cursor-pointer transition text-center hover:opacity-75"
  >
    <span class="InputGridItem__text">
      {{ textContent }}
    </span>
    <span
      v-if="isSelected"
      class="InputGridItem__check rounded-full p-1 flex items-center justify-center absolute pin-b pin-r w-6 h-6 bg-green border-2 border-theme-feature text-white"
    >
      <SvgIcon
        name="checkmark"
        view-box="0 0 10 9"
      />
    </span>
  </div>
</template>

<script>
import { SvgIcon } from '@/components/SvgIcon'

export default {
  name: 'InputGridItem',

  components: {
    SvgIcon
  },

  props: {
    imagePath: {
      // TODO without boolean?
      type: [String, Boolean],
      default: null
    },
    textContent: {
      type: String,
      default: null
    },
    isSelected: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
}
</script>
