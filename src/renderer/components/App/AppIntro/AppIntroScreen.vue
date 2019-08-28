<template>
  <div class="AppIntroScreen flex flex-row w-full h-full">
    <div class="AppIntroScreen__container__left flex-1 animated fadeIn rounded-lg hidden lg:block">
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

    <div class="AppIntroScreen__container__right flex-1 flex-col align-center justify-center h-full w-full lg:ml-4 bg-theme-feature rounded-lg">
      <div
        class="flex flex-col items-center h-full w-full animated fadeIn font-medium"
        :class="showFooter ? 'justify-between' : 'justify-center'"
      >
        <div
          :class="contentClasses"
          class="relative"
        >
          <div
            v-if="showGradient"
            class="AppIntroScreen--gradient-top"
          />

          <slot name="content" />

          <div
            v-if="showGradient"
            class="AppIntroScreen--gradient-bottom"
          />
        </div>

        <slot
          v-if="showFooter"
          name="buttons"
        >
          <div class="flex flex-row w-full justify-between px-16 pb-16 pt-8">
            <div class="">
              <ButtonGeneric
                v-if="showBack"
                :label="$t('COMMON.BACK')"
                class="AppIntroScreen__container__right__back mr-0"
                @click="emitBack"
              />
              <ButtonGeneric
                v-if="showNext"
                :label="$t('COMMON.NEXT')"
                class="AppIntroScreen__container__right__next ml-2"
                @click="emitNext"
              />
            </div>
            <div class="">
              <ButtonGeneric
                v-if="showSkip"
                :label="$t('COMMON.SKIP')"
                class="AppIntroScreen__container__right__skip"
                @click="emitSkip"
              />
            </div>
          </div>
        </slot>
      </div>
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
    },
    showGradient: {
      type: Boolean,
      required: false,
      default: true
    },
    contentClasses: {
      type: String,
      required: false,
      default: 'font-medium px-16 mt-10 overflow-y-auto'
    }
  },

  computed: {
    showFooter () {
      return this.showBack || this.showNext || this.showSkip
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
  @apply .absolute .flex .justify-center .h-18 .w-18 .px-3 .py-4 .rounded-tl-lg .rounded-br-lg
}

.AppIntroScreen__container__right__skip {
  @apply .bg-transparent
}

.AppIntroScreen--gradient-top {
  background: linear-gradient(
    to top,
    var(--theme-intro-gradient-1),
    var(--theme-intro-gradient-2) 100%
  );
  z-index: 1;
  @apply .sticky .pin-t .pin-x .h-6;
}

.AppIntroScreen--gradient-bottom {
  background: linear-gradient(
    to bottom,
    var(--theme-intro-gradient-1),
    var(--theme-intro-gradient-2) 100%
  );
  z-index: 1;
  @apply .sticky .pin-b .pin-x .h-6;
}
</style>
