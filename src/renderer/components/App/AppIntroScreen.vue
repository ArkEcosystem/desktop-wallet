<template>
  <div class="flex items-center">
    <div
      :key="selection + 'image'"
      class="w-1/2 flex items-center justify-center animated fadeIn"
    >
      <img
        :src="getStepImage()"
        class="h-full"
      >
    </div>
    <div class="flex flex-col w-1/2 justify-center">
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
        <div class="mt-3">{{ $t('INTRODUCTION.POWER.FINANCE') }}</div>
        <div class="mt-2">{{ $t('INTRODUCTION.POWER.BANKS') }}</div>
        <div class="mt-2">{{ $t('INTRODUCTION.POWER.CRYPTO') }}</div>
        <div class="mt-2">{{ $t('INTRODUCTION.POWER.RESPONSIBILITY') }}</div>
      </div>

      <div
        v-else-if="selection === 2"
        :key="2"
        class="w-3/4 animated fadeIn"
      >
        <div class="mt-3">{{ $t('INTRODUCTION.DUTY.INTRO') }}</div>
        <div class="mt-3">{{ $t('INTRODUCTION.DUTY.OWNER') }}</div>
        <i18n
          tag="div"
          class="mt-2"
          path="INTRODUCTION.DUTY.WARNING.INFO"
        >
          <div
            class="inline underline"
            place="warn"
          >
            {{ $t('INTRODUCTION.DUTY.WARNING.WARN') }}
          </div>
        </i18n>
        <div class="font-bold mt-3">{{ $t('INTRODUCTION.DUTY.SECURITY') }}</div>
      </div>

      <div
        v-else-if="selection === 3"
        :key="3"
        class="w-3/4 animated fadeIn"
      >
        <div class="mt-3">{{ $t('INTRODUCTION.RESPONSIBILITY.STORAGE') }}</div>
        <div class="mt-3">{{ $t('INTRODUCTION.RESPONSIBILITY.BACKUP') }}</div>
        <div class="mt-2">{{ $t('INTRODUCTION.RESPONSIBILITY.PASSPHRASE') }}</div>
      </div>

      <div
        v-else
        :key="4"
        class="w-3/4 animated fadeIn"
      >
        <div class="mt-3">{{ $t('INTRODUCTION.TURN.WALLET') }}</div>
        <div class="mt-2">{{ $t('INTRODUCTION.TURN.HARDWARE_WALLET') }}</div>
      </div>

      <div class="flex items-center justify-start mt-8">
        <div class="dotstyle dotstyle-stroke">
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
