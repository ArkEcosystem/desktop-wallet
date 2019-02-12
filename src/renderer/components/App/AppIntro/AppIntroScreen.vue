<template>
  <div class="flex flex-row w-full h-full">
    <div class="AppIntroScreen__container__left flex-1 animated fadeIn rounded-lg">
      <div
        v-if="showLogo"
        class="AppIntroScreen__container__left__logo"
      >
        <img
          :src="assets_loadImage('ark-logo.png')"
          class="h-full"
        >
      </div>
      <div
        :class="showLogo ? 'h-3/5 w-3/5 flex ' : 'h-full w-full'"
        class="h-full w-full flex items-center justify-center"
      >
        <img
          :class="showLogo ? 'h-3/5 w-3/5' : 'h-full w-full'"
          :src="assets_loadImage(image)"
        >
      </div>
    </div>

    <div class="AppIntroScreen__container__right flex-1 flex-col align-center justify-center h-full w-full ml-4 bg-theme-feature rounded-lg">
      <slot name="content" />

      <slot
        v-if="showBack || showNext || showSkip"
        name="buttons"
      >
        <div class="flex items-center justify-start">
          <div class="absolute m-8 pin-b pin-r">
            <ButtonGeneric
              v-if="showBack"
              :label="$t('COMMON.BACK')"
              class="ml-4 mr-0"
              @click="emitBack"
            />
            <ButtonGeneric
              v-if="showNext"
              :label="$t('COMMON.NEXT')"
              class="ml-4"
              @click="emitNext"
            />
            <ButtonGeneric
              v-if="showSkip"
              :label="$t('COMMON.SKIP')"
              class="ml-4"
              @click="emitSkip"
            />
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import { ButtonGeneric } from '@/components/Button'

export default {
  name: 'AppIntroScreen',

  components: {
    ButtonGeneric
  },

  props: {
    showBack: {
      type: Boolean,
      required: false,
      default: true
    },
    showLogo: {
      type: Boolean,
      required: false,
      default: true
    },
    showNext: {
      type: Boolean,
      required: false,
      default: true
    },
    showSkip: {
      type: Boolean,
      required: false,
      default: true
    },
    image: {
      type: String,
      required: true
    }
  },

  methods: {
    emitBack () {
      this.$emit('back')
    },

    emitNext () {
      this.$emit('next')
    },

    emitSkip () {
      this.$emit('skip')
    }
  }
}
</script>

<style lang="postcss" scoped>
.AppIntroScreen__image {
  background-size: contain;
  background-position: center center;
}

.AppIntroScreen__container__left {
  background-color: #2d2f38;
}

.AppIntroScreen__container__left__logo {
  background-color: #c9292c;
  @apply .absolute .h-18 .w-18 .px-3 .py-4 .rounded-tl-lg .rounded-br-lg
}
</style>
