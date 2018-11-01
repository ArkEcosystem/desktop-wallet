<template>
  <div class="bg-light-grey px-20 py-16 w-screen h-screen">
    <div
      :style="getBackgroundImage()"
      class="AppWelcome__background bg-no-repeat flex justify-center items-center rounded-lg bg-white w-full h-full relative">
      <div
        v-if="step == 1"
        :key="1"
        class="text-center m-8">
        <div class="flex justify-center items-center mb-8">
          <div class="AppWelcome__Logo">
            <img :src="assets_loadImage('ark-logo.png')">
          </div>
        </div>
        <span
          class="text-5xl"
          v-html="$t('INTRODUCTION.WELCOME.TITLE')"
        />
        <div class="mt-3">{{ $t('INTRODUCTION.WELCOME.SAFETY_MESSAGE') }}</div>
        <div class="mt-2">{{ $t('INTRODUCTION.WELCOME.FUNDS_WARNING') }}</div>
        <button
          class="blue-button mt-8"
          @click="start"
        >
          {{ $t('COMMON.START') }}
        </button>
      </div>

      <div
        v-else-if="step > 1"
        :key="2"
        class="flex w-full h-full"
      >

        <div class="absolute pin-t pin-l">
          <div class="AppWelcome__Logo__corner">
            <img :src="assets_loadImage('ark-logo.png')">
          </div>
        </div>

        <AppIntroScreen
          v-if="step == 2"
          :selection="1"
          :title="$t('INTRODUCTION.POWER.TITLE')"
          @next="next(3)"
        />

        <AppIntroScreen
          v-if="step == 3"
          :selection="2"
          :title="$t('INTRODUCTION.RESPONSIBILITY.TITLE')"
          @next="next(4)"
        />

        <AppIntroScreen
          v-if="step == 4"
          :is-last="true"
          :selection="3"
          :title="$t('INTRODUCTION.TURN.TITLE')"
          @done="done"
        />
      </div>
    </div>
    <AppFooter
      class="mt-4"
    />
  </div>
</template>

<script>
import { AppFooter, AppIntroScreen } from '@/components/App'

export default {
  name: 'AppWelcome',

  components: {
    AppFooter,
    AppIntroScreen
  },

  props: {
  },

  data: () => ({
    step: 1
  }),

  methods: {
    start () {
      this.step = 2
    },

    next (step) {
      this.step = step
    },

    done () {
      this.$emit('done')
    },

    getBackgroundImage () {
      return this.step === 1
        ? `background-image: url('${this.assets_loadImage('pages/background-welcome.png')}')`
        : `background-image: url('${this.assets_loadImage('pages/background-intro.png')}')`
    }
  }
}
</script>

<style>

.AppWelcome__Logo {
  box-shadow: 0 10px 15px rgba(228, 9, 90, 0.34);
  @apply .bg-red .w-24 .p-4 .rounded-lg
}

.AppWelcome__background {
  background-size: contain;
  background-position: left center;
}

.AppWelcome__Logo__corner {
  @apply .bg-red .w-18 .px-3 .py-4 .rounded-tl-lg .rounded-br-lg
}

</style>
