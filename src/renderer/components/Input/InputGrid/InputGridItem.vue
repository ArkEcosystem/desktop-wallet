<template>
  <div
    :style="imagePath ? `backgroundImage: url('${assets_loadImage(imagePath)}')` : ''"
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
      v-else-if="onlyLetter"
      :class="{
        'pt-5 pb-0': isForModal
      }"
      class="flex h-full flex-col items-center justify-between"
    >
      <span
        v-if="isForModal"
        class="font-semibold text-theme-button-text"
      >
        {{ title }}
      </span>
      <ButtonLetter
        :value="label"
        :size="isForModal ? null : '2xl'"
        :class="{
          'w-24 h-24 text-5xl': isForModal
        }"
        tag="div"
      />
    </div>
    <div
      v-else-if="component"
      :class="{
        'pt-5 pb-0': isForModal
      }"
      class="flex h-full flex-col items-center justify-between"
    >
      <Component :is="component" />
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
    component: {
      type: [Object, Function],
      required: false,
      default: () => {}
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
      // To avoid failing after removing the current and last profile
      return this.$store.getters['session/profile'] ? this.session_network : null
    },

    label () {
      const symbol = this.currentNetwork ? this.currentNetwork.symbol : null
      return this.textContent || symbol
    }
  }
}
</script>
