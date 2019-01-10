<template>
  <div
    :style="imagePath ? `backgroundImage: url('${assets_loadImage(imagePath)}')` : ''"
    :title="title"
    :class="{ 'InputGridItem--selected': isSelected }"
    class="InputGridItem relative bg-cover bg-no-repeat bg-center rounded-full w-16 h-16 cursor-pointer transition text-center hover:opacity-75"
  >
    <span
      v-if="textContent && !onlyLetter"
      class="InputGridItem__text"
    >
      {{ textContent }}
    </span>
    <div
      v-if="onlyLetter"
      :class="{
        'py-3': isForModal
      }"
      class="flex h-full flex-col items-center justify-between"
    >
      <ButtonLetter
        :value="label"
        :size="!isForModal ? '2xl' : null"
        :class="{
          'w-24 h-24 text-5xl': isForModal
        }"
        tag="div"
      />
      <span
        v-if="isForModal"
        class="font-semibold text-theme-page-text"
      >
        {{ title }}
      </span>
    </div>
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
import { ButtonLetter } from '@/components/Button'
import { SvgIcon } from '@/components/SvgIcon'

export default {
  name: 'InputGridItem',

  components: {
    ButtonLetter,
    SvgIcon
  },

  props: {
    imagePath: {
      type: [String, Boolean],
      required: false,
      default: null
    },
    textContent: {
      type: String,
      default: null
    },
    onlyLetter: {
      type: Boolean,
      required: false,
      default: false
    },
    isForModal: {
      type: Boolean,
      required: false,
      default: true
    },
    isSelected: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: null
    }
  },

  computed: {
    currentNetwork () {
      return this.session_network
    },

    label () {
      const symbol = this.currentNetwork ? this.currentNetwork.symbol : null
      return this.textContent || symbol
    }
  }
}
</script>
