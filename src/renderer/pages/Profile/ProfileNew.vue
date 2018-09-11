<template>
  <div class="ProfileNew relative bg-theme-feature rounded-lg m-r-4">
    <main class="flex flex-row h-full">

      <div
        :style="`background-image: url('${assets_loadImage('pages/background-1920.png')}')`"
        class="ProfileNew__instructions w-2/3 background-image"
      >
        <div class="mt-16 mx-16">
          <h3 class="mb-2">{{ $t(`PAGES.PROFILE_NEW.STEP${step}.INSTRUCTIONS.HEADER`) }}</h3>
          <p>
            {{ $t(`PAGES.PROFILE_NEW.STEP${step}.INSTRUCTIONS.TEXT`) }}
          </p>
        </div>
      </div>

      <div class="w-1/3 p-10">
        <MenuStep
          v-model="step"
        >

          <MenuStepItem
            :step="1"
            :is-next-enabled="!$v.step1.$invalid"
            title="Profile"
            @next="moveTo(2)"
          >

            <!-- NOTE wraps the content, but doesn't modify the stepper -->
            <div class="flex flex-col">

              <!-- TODO check duplicate here -->
              <InputText
                v-model="schema.name"
                :label="$t('PAGES.PROFILE_NEW.STEP1.NAME')"
                :is-invalid="$v.schema.name.$dirty && $v.schema.name.$invalid"
                class="mb-5"
                name="name"
              />

              <div class="flex mb-5">
                <InputSelect
                  :items="languages"
                  :value="language"
                  name="language"
                  label="Language"
                  class="flex-1 mr-2"
                  @input="selectLanguage"
                />

                <InputSelect
                  :items="currencies"
                  :value="schema.currency"
                  name="currency"
                  label="Currency"
                  class="flex-1"
                  @input="selectCurrency"
                />
              </div>

              <div>
                <h5 class="mb-2">Avatar</h5>

                <SelectionAvatar
                  :max-visible-items="2"
                  :selected="schema.avatar"
                  @select="selectAvatar"
                />
              </div>

            </div>

          </MenuStepItem>

          <MenuStepItem
            :step="2"
            :is-back-visible="true"
            :is-next-enabled="!$v.step2.$invalid"
            :is-disabled="step < 2"
            title="Network"
            @back="moveTo(1)"
            @next="moveTo(3)"
          >

            <div class="flex flex-col h-full w-full justify-around py-2">
              <SelectionNetwork
                :max-visible-items="2"
                :selected="schema.network"
                @select="selectNetwork"
              />
            </div>

          </MenuStepItem>

          <MenuStepItem
            :step="3"
            :is-back-visible="true"
            :is-next-enabled="!$v.schema.$invalid"
            :is-disabled="step < 3"
            title="Appearance"
            @back="moveTo(2)"
            @next="create"
          >

            <div class="flex flex-col h-full w-full justify-around">
              <h5 class="mb-2">Select wallet theme:</h5>

              <SelectionTheme
                :max-visible-items="2"
                :selected="theme"
                class="mb-5"
                @select="selectTheme"
              />

              <h5 class="mb-2">Select background:</h5>

              <SelectionBackground
                :max-visible-items="2"
                :selected="background"
                @select="selectBackground"
              />
            </div>

          </MenuStepItem>

        </MenuStep>
      </div>
    </main>
  </div>
</template>

<script>
import { I18N, NETWORKS, MARKET } from '@config'
import Profile from '@/models/profile'
import { MenuStep, MenuStepItem } from '@/components/Menu'
import { InputSelect, InputText } from '@/components/Input'
import { SelectionAvatar, SelectionBackground, SelectionNetwork, SelectionTheme } from '@/components/Selection'

export default {
  name: 'ProfileNew',

  components: {
    SelectionAvatar,
    SelectionBackground,
    SelectionNetwork,
    SelectionTheme,
    MenuStep,
    MenuStepItem,
    InputSelect,
    InputText
  },

  schema: Profile.schema,

  data: () => ({
    step: 1
  }),

  computed: {
    background: {
      get () {
        return this.$store.getters['session/background']
      },
      set (background) {
        this.selectBackground(background)
      }
    },
    language: {
      get () {
        return this.$store.getters['session/language']
      },
      set (language) {
        this.selectLanguage(language)
      }
    },
    theme: {
      get () {
        return this.$store.getters['session/theme']
      },
      set (theme) {
        this.selectTheme(theme)
      }
    },
    currencies () {
      return MARKET.currencies
    },
    languages () {
      return I18N.enabledLocales.reduce((all, locale) => {
        all[locale] = this.$i18n.t(`LANGUAGES.${locale}`)
        return all
      }, {})
    },
    networks () {
      return NETWORKS.map(network => network.id)
    }
  },

  created () {
    // Use the default language TODO waiting to store
    // this.selectLanguage(this.language)
  },

  methods: {
    async create () {
      const profile = new Profile(this.schema)
      await this.$store.dispatch('profiles/create', profile)
      await this.$store.dispatch('session/set', { profileId: profile.id })
      this.$router.push({ name: 'dashboard' })
    },

    moveTo (step) {
      this.step = step
    },

    selectAvatar (avatar) {
      this.schema.avatar = avatar
    },

    async selectBackground (background) {
      this.schema.background = background
      // TODO the background should be restored when cancelling the profile creation
      await this.$store.dispatch('session/set', { background })
    },

    selectCurrency (currency) {
      this.schema.currency = currency
    },

    async selectLanguage (language) {
      this.schema.language = language
      this.$i18n.locale = language
      // TODO the languge should be restored when cancelling the profile creation
      await this.$store.dispatch('session/set', { language })
    },

    selectNetwork (network) {
      this.schema.network = network
    },

    async selectTheme (theme) {
      this.schema.theme = theme
      // TODO the theme should be restored when cancelling the profile creation
      await this.$store.dispatch('session/set', { theme })
    }
  },

  validations: {
    step1: ['schema.avatar', 'schema.currency', 'schema.language', 'schema.name'],
    step2: ['schema.network']
  }
}
</script>

<style scoped>
/* To display the images scaled to the size of the button */
.ProfileNew__instructions {
  background-size: cover;
  background-position: center center;
}
</style>
