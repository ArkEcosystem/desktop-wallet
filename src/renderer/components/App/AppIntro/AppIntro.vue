<template>
  <div
    class="p-10 flex justify-center items-center rounded-lg w-full h-full pin-t pin-l fixed animated fadeIn lg:overflow-y-scroll"
  >
    <AppIntroScreen
      v-if="step === 0"
      :show-back="false"
      :show-next="false"
      :show-skip="false"
      :show-logo="false"
      :image="stepImage"
      class="AppIntro__1"
    >
      <div
        slot="content"
      >
        <i18n
          path="INTRODUCTION.WELCOME.TITLE"
          tag="app"
        >
          <strong place="app">
            {{ $t('COMMON.APP_NAME_SHORT') }}
          </strong>
        </i18n>
        <p>
          {{ $t('INTRODUCTION.WELCOME.SAFETY_MESSAGE') }}
        </p>

        <p class="mt-4">
          {{ $t('INTRODUCTION.WELCOME.FUNDS_WARNING') }}
        </p>
      </div>

      <div slot="buttons">
        <InputLanguage
          :items="languages"
          :value="sessionLanguage"
          @select="selectLanguage"
        />

        <ButtonGeneric
          :label="$t('COMMON.START')"
          class="ml-4"
          @click="moveTo(1)"
        />
      </div>
    </AppIntroScreen>

    <AppIntroScreen
      v-if="step === 1"
      :image="stepImage"
      @back="moveTo(0)"
      @next="moveTo(2)"
      @skip="done"
    >
      <i18n
        slot="content"
        path="INTRODUCTION.PAGE_TITLE"
        tag="span"
      >
        <strong place="page">
          {{ $t('INTRODUCTION.POWER.TITLE') }}
        </strong>
      </i18n>
    </AppIntroScreen>

    <AppIntroScreen
      v-if="step === 2"
      :image="stepImage"
      @back="moveTo(1)"
      @next="moveTo(3)"
      @skip="done"
    >
      <i18n
        slot="content"
        path="INTRODUCTION.PAGE_TITLE"
        tag="span"
      >
        <strong place="page">
          {{ $t('INTRODUCTION.DUTY.TITLE') }}
        </strong>
      </i18n>
    </AppIntroScreen>

    <AppIntroScreen
      v-if="step === 3"
      :image="stepImage"
      @back="moveTo(2)"
      @next="moveTo(4)"
      @skip="done"
    >
      <i18n
        slot="content"
        path="INTRODUCTION.PAGE_TITLE"
        tag="span"
      >
        <strong place="page">
          {{ $t('INTRODUCTION.RESPONSIBILITY.TITLE') }}
        </strong>
      </i18n>
    </AppIntroScreen>

    <AppIntroScreen
      v-if="step === 4"
      :image="stepImage"
      @back="moveTo(3)"
      @next="done"
      @skip="done"
    >
      <i18n
        slot="content"
        path="INTRODUCTION.PAGE_TITLE"
        tag="span"
      >
        <strong place="page">
          {{ $t('INTRODUCTION.TURN.TITLE') }}
        </strong>
      </i18n>
    </AppIntroScreen>
  </div>
</template>

<script>
import { I18N } from '@config'
import AppIntroScreen from '@/components/App/AppIntro/AppIntroScreen'
import { ButtonGeneric } from '@/components/Button'
import { InputLanguage } from '@/components/Input'

export default {
  name: 'AppIntro',

  components: {
    AppIntroScreen,
    ButtonGeneric,
    InputLanguage
  },

  props: {
  },

  data: () => ({
    step: 0,
    stepImages: [
      'pages/intro/welcome.svg',
      'pages/intro/power.svg',
      'pages/intro/duty.svg',
      'pages/intro/responsibility.svg',
      'pages/intro/turn.svg'
    ]
  }),

  computed: {
    language () {
      return this.modified.language || this.profile.language
    },
    languages () {
      return I18N.enabledLocales.reduce((all, locale) => {
        all[locale] = this.$t(`LANGUAGES.${locale}`)
        return all
      }, {})
    },
    stepImage () {
      return this.stepImages[this.step]
    }
  },

  methods: {
    done () {
      this.$emit('done')
    },
    moveTo (step) {
      this.step = step
    },
    start () {
      this.step = 0
    },
    selectLanguage (language) {
      this.$store.dispatch('language', language)
    }
  }
}
</script>

<style lang="postcss" scoped>
.AppWelcome__Logo {
  box-shadow: 0 10px 15px rgba(228, 9, 90, 0.34);
  @apply .bg-red .w-24 .p-4 .rounded-lg
}

.AppWelcome__background {
  background-size: contain;
  background-position: top left;
  @apply .bg-no-repeat .w-full .h-full
}

.AppWelcome__Logo__corner {
  @apply .bg-red .w-18 .px-3 .py-4 .rounded-tl-lg .rounded-br-lg
}

.AppIntro__1 .AppIntroScreen__container__left {
  background-color: #c9292c;
}
</style>
