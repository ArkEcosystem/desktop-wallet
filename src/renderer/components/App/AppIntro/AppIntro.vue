<template>
  <div
    class="AppIntro pt-10 pb-6 px-10 flex flex-col rounded-lg w-full h-full .top-0 .left-0 fixed animated fadeIn lg:overflow-y-scroll"
  >
    <div
      class="flex w-full h-full top-0 left-0"
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
          class="w-2/3 font-medium"
        >
          <i18n
            path="INTRODUCTION.WELCOME.TITLE"
            tag="div"
            class="font-bold mb-4"
          >
            <p
              place="APP"
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
              :position="['-10%', '0%']"
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
              class="AppIntro__1__start-button ml-4"
              @click="moveTo(1)"
            />
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
        <div
          slot="content"
          class="font-medium px-16 pt-16 m4-8"
        >
          <div class="font-black text-3xl mb-5">
            {{ $t('INTRODUCTION.POWER.TITLE') }}
          </div>
          <p class="mb-5">
            {{ $t('INTRODUCTION.POWER.FINANCE') }}
          </p>
          <p class="mb-5">
            {{ $t('INTRODUCTION.POWER.BANKS') }}
          </p>
          <p class="mb-5">
            {{ $t('INTRODUCTION.POWER.CRYPTO') }}
          </p>
          <p class="mb-5">
            {{ $t('INTRODUCTION.POWER.RESPONSIBILITY') }}
          </p>
        </div>
      </AppIntroScreen>

      <AppIntroScreen
        v-if="step === 2"
        :image="stepImage"
        @back="moveTo(1)"
        @next="moveTo(3)"
        @skip="done"
      >
        <div
          slot="content"
          class="font-medium px-16 pt-16 m4-8"
        >
          <div class="font-black text-3xl mb-5">
            {{ $t('INTRODUCTION.DUTY.TITLE') }}
          </div>
          <p class="mb-5">
            {{ $t('INTRODUCTION.DUTY.CONTROL') }}
          </p>
          <i18n
            path="INTRODUCTION.DUTY.WARNING.ACCOUNT"
            tag="p"
            class="mb-5"
          >
            <span
              v-t="'INTRODUCTION.DUTY.WARNING.CANNOT_RESTORE'"
              place="CANNOT_RESTORE"
              class="underline"
            />
          </i18n>
          <p class="mb-5 font-bold">
            {{ $t('INTRODUCTION.DUTY.SECURITY') }}
          </p>
        </div>
      </AppIntroScreen>

      <AppIntroScreen
        v-if="step === 3"
        :image="stepImage"
        @back="moveTo(2)"
        @next="moveTo(4)"
        @skip="done"
      >
        <div
          slot="content"
          class="font-medium px-16 pt-16 m4-8"
        >
          <div class="font-black text-3xl mb-5">
            {{ $t('INTRODUCTION.RESPONSIBILITY.TITLE') }}
          </div>
          <i18n
            path="INTRODUCTION.RESPONSIBILITY.STORAGE.EXPLANATION"
            tag="p"
            class="mb-5"
          >
            <span
              v-t="'INTRODUCTION.RESPONSIBILITY.STORAGE.PASSPHRASE'"
              place="PASSPHRASE"
              class="font-bold"
            />
            <span
              v-t="'INTRODUCTION.RESPONSIBILITY.STORAGE.ENCRYPTED'"
              place="ENCRYPTED"
              class="underline"
            />
            <span
              v-t="'INTRODUCTION.RESPONSIBILITY.STORAGE.NEED'"
              place="NEED"
              class="font-bold"
            />
          </i18n>
          <p class="mb-5 font-bold">
            {{ $t('INTRODUCTION.RESPONSIBILITY.BACKUP.ALWAYS') }}
          </p>
          <p class="mb-5">
            {{ $t('INTRODUCTION.RESPONSIBILITY.BACKUP.OPTIONS') }}
          </p>
          <p class="mb-5">
            {{ $t('INTRODUCTION.RESPONSIBILITY.REMEMBER') }}
          </p>
        </div>
      </AppIntroScreen>

      <AppIntroScreen
        v-if="step === 4"
        :image="stepImage"
        @back="moveTo(3)"
        @next="done"
        @skip="done"
      >
        <div
          slot="content"
          class="font-medium px-16 pt-16 m4-8"
        >
          <div class="font-black text-3xl mb-5">
            {{ $t('INTRODUCTION.TURN.TITLE') }}
          </div>
          <p class="mb-5">
            {{ $t('INTRODUCTION.TURN.KNOWLEDGE') }}
          </p>
          <p class="mb-5">
            {{ $t('INTRODUCTION.TURN.SUPPORT') }}
          </p>
          <p class="mb-5">
            {{ $t('INTRODUCTION.TURN.CONCLUSION') }}
          </p>
        </div>
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
      this.$store.dispatch('session/setLanguage', language)
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
.AppIntro__1__languages .MenuDropdownItem__container {
  @apply .pl-0
}
.AppIntro__1__languages__item__flag {
  height: 18px
}
.AppIntro__1__languages__handler__flag {
  height: 18px;
  margin-bottom: -2px;
}
</style>
