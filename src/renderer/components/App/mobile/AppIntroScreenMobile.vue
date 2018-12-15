<template>
  <div class="flex flex-col items-center">
    <div
      :key="selection + 'image'"
      class="animated fadeIn px-12 pt-24 overflow-y-scroll md:h-full"
    >
      <div class="flex pt-16 md:pt-0 md:justify-center">
        <img
          :src="getStepImage()"
          class="h-100 mr-6 hidden md:block"
        >
        <div
          :key="selection + 'title'"
          class="text-5xl animated fadeIn self-end mb-6 md:mb-16"
        >
          <slot name="title" />
        </div>
      </div>

      <div class="flex flex-col justify-center">
        <div
          v-if="selection === 1"
          :key="1"
          class="animated fadeIn"
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
          class="animated fadeIn"
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
          class="animated fadeIn"
        >
          <div class="mt-3">
            {{ $t('INTRODUCTION.RESPONSIBILITY.STORAGE') }}
          </div>
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
          class="animated fadeIn"
        >
          <div class="mt-3">
            {{ $t('INTRODUCTION.TURN.WALLET') }}
          </div>
          <div class="AppIntroScreen__text_spacing">
            {{ $t('INTRODUCTION.TURN.HARDWARE_WALLET') }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between pt-6 self-start md:self-end">
        <div class="dotstyle dotstyle-stroke mb-10 hidden md:block">
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
        <div class="m-8">
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
</template>

<script>
import { ButtonGeneric } from '@/components/Button'

export default {
  name: 'AppIntroScreenMobile',

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
