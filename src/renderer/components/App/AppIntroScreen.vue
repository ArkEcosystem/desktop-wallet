<template>
  <div class="flex items-center">
    <div
      :key="selection + 'image'"
      class="w-1/3 xl:w-1/2 flex items-center justify-center animated fadeIn"
    >
      <img
        :src="getStepImage()"
        class="h-full"
      >
    </div>
    <div class="flex flex-col w-3/4 xl:w-1/2 justify-center h-full relative pl-16 xl:pl-0">
      <div
        :key="selection + 'title'"
        class="text-5xl animated fadeIn"
      >
        <slot name="title" />
      </div>

      <div
        v-if="selection === 1"
        :key="1"
        class="w-3/4 animated fadeIn"
      >
        <div class="mt-3">
          {{ $t('INTRODUCTION.POWER.FINANCE') }}
        </div>
        <div class="AppIntroScreen__text_spacing">
          {{ $t('INTRODUCTION.POWER.BANKS') }}
        </div>
        <div class="AppIntroScreen__text_spacing">
          {{ $t('INTRODUCTION.POWER.CRYPTO') }}
        </div>
        <div class="AppIntroScreen__text_spacing">
          {{ $t('INTRODUCTION.POWER.RESPONSIBILITY') }}
        </div>
      </div>

      <div
        v-else-if="selection === 2"
        :key="2"
        class="w-3/4 animated fadeIn"
      >
        <div class="mt-3">
          {{ $t('INTRODUCTION.DUTY.INTRO') }}
        </div>
        <div class="AppIntroScreen__text_spacing">
          {{ $t('INTRODUCTION.DUTY.OWNER') }}
        </div>
        <i18n
          tag="div"
          class="AppIntroScreen__text_spacing"
          path="INTRODUCTION.DUTY.WARNING.INFO"
        >
          <div
            class="inline underline"
            place="warn"
          >
            {{ $t('INTRODUCTION.DUTY.WARNING.WARN') }}
          </div>
        </i18n>
        <div class="font-bold AppIntroScreen__text_spacing">
          {{ $t('INTRODUCTION.DUTY.SECURITY') }}
        </div>
      </div>

      <div
        v-else-if="selection === 3"
        :key="3"
        class="w-full animated fadeIn overflow-y-scroll pb-12 pr-4"
      >
        <i18n
          tag="div"
          class="AppIntroScreen__text_spacing"
          path="INTRODUCTION.RESPONSIBILITY.STORAGE.INFO"
        >
          <div
            class="inline font-bold"
            place="passphrase"
          >
            {{ $t('INTRODUCTION.RESPONSIBILITY.STORAGE.PASSPHRASE') }}
          </div>
          <div
            class="inline font-bold"
            place="encrypted"
          >
            {{ $t('INTRODUCTION.RESPONSIBILITY.STORAGE.ENCRYPTED') }}
          </div>
        </i18n>
        <div class="AppIntroScreen__text_spacing">
          {{ $t('INTRODUCTION.RESPONSIBILITY.BACKUP') }}
        </div>
        <div class="AppIntroScreen__text_spacing">
          {{ $t('INTRODUCTION.RESPONSIBILITY.PASSPHRASE') }}
        </div>
      </div>

      <div
        v-else
        :key="4"
        class="w-3/4 animated fadeIn"
      >
        <div class="mt-3">
          {{ $t('INTRODUCTION.TURN.WALLET') }}
        </div>
        <div class="AppIntroScreen__text_spacing">
          {{ $t('INTRODUCTION.TURN.SUPPORT') }}
        </div>
        <div class="AppIntroScreen__text_spacing">
          {{ $t('INTRODUCTION.TURN.CONCLUSION') }}
        </div>
      </div>

      <div class="flex items-center justify-start">
        <div class="dotstyle dotstyle-stroke absolute mb-10 pin-b pin-l pl-16 xl:pl-0">
          <ul>
            <li
              v-for="index in totalScreens"
              :key="index"
              :class="{ 'current' : index === selection }"
            >
              <span />
            </li>
          </ul>
        </div>
        <div class="absolute m-8 pin-b pin-r">
          <ButtonGeneric
            :disabled="isFirst"
            :label="$t('COMMON.BACK')"
            class="ml-4 mr-0"
            @click="emitBack"
          />
          <ButtonGeneric
            v-if="!isLast"
            :label="$t('COMMON.NEXT')"
            class="ml-4"
            @click="emitNext"
          />
          <ButtonGeneric
            v-else
            :label="$t('COMMON.FINISH')"
            class="ml-4"
            @click="emitDone"
          />
        </div>
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
    isFirst: {
      type: Boolean,
      required: false,
      default: false
    },
    isLast: {
      type: Boolean,
      required: false,
      default: false
    },
    selection: {
      type: Number,
      required: true
    },
    totalScreens: {
      type: Number,
      required: false,
      default: 4
    }
  },

  data () {
    return {
      stepImages: {
        1: 'pages/intro/power.png',
        2: 'pages/intro/duty.png',
        3: 'pages/intro/responsibility.png',
        4: 'pages/intro/turn.png'
      }
    }
  },

  methods: {
    emitBack () {
      this.$emit('back')
    },

    emitNext () {
      this.$emit('next')
    },

    emitDone () {
      this.$emit('done')
    },

    getStepImage () {
      const stepImage = this.stepImages[this.selection]
      return this.assets_loadImage(stepImage)
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
