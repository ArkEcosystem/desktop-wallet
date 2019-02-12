<template>
  <div
    class="pt-10 pb-6 px-10 flex flex-col rounded-lg w-full h-full pin-t pin-l fixed animated fadeIn lg:overflow-y-scroll"
  >
    <div
      class="flex w-full h-full pin-t pin-l"
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
          class="flex flex-col justify-center items-center h-full w-full animated fadeIn"
        >
          <div
            class="w-2/3 font-medium"
          >
            <i18n
              path="INTRODUCTION.WELCOME.TITLE"
              tag="div"
              class="font-bold font-xl mb-4"
            >
              <p
                place="app"
                class="font-black text-3xl"
              >
                {{ $t('COMMON.APP_NAME_SHORT') }}
              </p>
            </i18n>

            <p>
              {{ $t('INTRODUCTION.WELCOME.SAFETY_MESSAGE') }}
            </p>

            <p class="mt-2">
              {{ $t('INTRODUCTION.WELCOME.FUNDS_WARNING') }}
            </p>

            <div
              class="flex flex-row align-center justify-center mt-8"
            >
              <MenuDropdown
                :items="languages"
                :value="language"
                :position="['-50%', '0%']"
                class="AppIntro__1__languages flex align-center justify-center p-2 text-grey-dark"
                @select="selectLanguage"
              >
                <div
                  slot="item"
                  slot-scope="itemScope"
                  class="flex flex-row space-between"
                >
                  <img
                    :src="flagImage(itemScope.value)"
                    :title="itemScope.item"
                    class="AppIntro__1__languages__item__flag mr-2"
                  >
                  <span class="font-semibold">
                    {{ itemScope.item }}
                  </span>
                </div>

                <div
                  slot="handler"
                  slot-scope="handlerScope"
                >
                  <MenuDropdownHandler
                    :value="handlerScope.activeValue"
                    :item="handlerScope.item"
                    :placeholder="handlerScope.placeholder"
                    :prefix="handlerScope.prefix"
                    :icon-disabled="handlerScope.isOnlySelectedItem"
                  >
                    <img
                      :src="flagImage(handlerScope.value)"
                      :title="handlerScope.item"
                      class="AppIntro__1__languages__handler__flag mr-1"
                    >
                    {{ handlerScope.item }}
                  </MenuDropdownHandler>
                </div>
              </MenuDropdown>

              <ButtonGeneric
                :label="$t('COMMON.START')"
                class="ml-4"
                @click="moveTo(1)"
              />
            </div>
          </div>
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

    <AppFooter
      class="mt-4"
    />
  </div>
</template>

<script>
import { I18N } from '@config'
import AppFooter from '@/components/App/AppFooter'
import AppIntroScreen from '@/components/App/AppIntro/AppIntroScreen'
import { ButtonGeneric } from '@/components/Button'
import { MenuDropdown, MenuDropdownHandler } from '@/components/Menu'

export default {
  name: 'AppIntro',

  components: {
    AppFooter,
    AppIntroScreen,
    ButtonGeneric,
    MenuDropdown,
    MenuDropdownHandler
  },

  data: () => ({
    language: I18N.defaultLocale,
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
    flagImage (language) {
      return this.assets_loadImage(`flags/${language}.svg`)
    },

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
      this.language = language
      this.$store.dispatch('language', language)
    }
  }
}
</script>

<style lang="postcss" scoped>
.AppIntro__1 .AppIntroScreen__container__left {
  background-color: #c9292c;
}
.AppIntro__1__languages {
  @apply .border-2 .rounded
}
.AppIntro__1__languages__item__flag {
  height: 18px
}
.AppIntro__1__languages__handler__flag {
  height: 18px;
  margin-bottom: -2px;
}
</style>
