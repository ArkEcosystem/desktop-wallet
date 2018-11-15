<template>
  <div class="flex items-center">
    <div class="w-1/2 flex items-center justify-center">
      <img
        :src="getStepImage()"
        class="h-full"
      >
    </div>
    <div class="flex flex-col w-1/2 justify-center">
      <div class="text-5xl">
        <slot name="title" />
      </div>

      <div
        v-if="selection === 1"
        class="w-3/4"
      >
        <div class="mt-3">{{ $t('INTRODUCTION.POWER.FINANCE') }}</div>
        <div class="mt-2">{{ $t('INTRODUCTION.POWER.BANKS') }}</div>
        <div class="mt-2">{{ $t('INTRODUCTION.POWER.CRYPTO') }}</div>
        <div class="mt-2">{{ $t('INTRODUCTION.POWER.RESPONSIBILITY') }}</div>
      </div>

      <div
        v-else-if="selection === 2"
        class="w-3/4"
      >
        <div class="mt-3">{{ $t('INTRODUCTION.RESPONSIBILITY.STORAGE') }}</div>
        <i18n
          tag="div"
          class="mt-2"
          path="INTRODUCTION.RESPONSIBILITY.WARNING.INFO"
        >
          <strong place="warn">{{ $t('INTRODUCTION.RESPONSIBILITY.WARNING.WARN') }}</strong>
        </i18n>
        <i18n
          tag="div"
          class="mt-2"
          path="INTRODUCTION.RESPONSIBILITY.PASSPHRASE"
        >
          <strong place="not">{{ $t('COMMON.NOT') }}</strong>
          <strong place="will">{{ $t('COMMON.WILL') }}</strong>
        </i18n>
        <div class="mt-2">{{ $t('INTRODUCTION.RESPONSIBILITY.BACKUP') }}</div>
      </div>

      <div
        v-else
        class="w-3/4"
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
      default: 3
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
      if (this.selection === 1) {
        return this.assets_loadImage('pages/power-intro.png')
      }
      if (this.selection === 2) {
        return this.assets_loadImage('pages/responsibility-intro.png')
      }
      return this.assets_loadImage('pages/turn-intro.png')
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
