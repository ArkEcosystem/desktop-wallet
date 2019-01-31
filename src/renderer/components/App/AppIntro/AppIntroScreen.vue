<template>
  <div class="flex flex-row w-full h-full">
    <div class="w-1/2 flex items-center justify-center animated fadeIn rounded-lg">
      <img
        :src="assets_loadImage(image)"
        class="h-full"
      >
    </div>

    <div class="w-1/2 flex flex-col justify-center h-full w-full pl-10 bg-theme-feature rounded-lg">
      <div
        class="text-5xl animated fadeIn"
      >
        <slot name="content" />
      </div>

      <slot name="buttons">
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

.AppIntroScreen__text_spacing {
  @apply .mt-6
}

.dotstyle ul {
  display: inline-block;
  list-style: none;
  @apply .relative .m-0 .p-0
}

.dotstyle li {
  float: left;
  width: 12px;
  height: 12px;
  @apply .relative .block .mx-3
}

.dotstyle li span {
  @apply .bg-grey-light .w-full .h-full .absolute .rounded-full
}

.dotstyle-stroke li.current span {
  box-shadow: inset 0 0 0 3px #037cff;
  @apply .bg-transparent
}
</style>
