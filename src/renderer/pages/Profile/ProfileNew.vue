<template>
  <div class="ProfileNew relative">
    <main class="flex h-full">
      <div
        class="ProfileNew__instructions theme-dark bg-theme-feature text-theme-page-instructions-text hidden lg:flex flex-1 mr-4 rounded-lg overflow-y-auto"
      >
        <div class="m-auto w-3/5 text-center flex flex-col items-center justify-center">
          <h1 class="text-inherit">
            {{ $t(`PAGES.PROFILE_NEW.STEP${step}.INSTRUCTIONS.HEADER`) }}
          </h1>
          <p class="text-center py-2 leading-normal">
            {{ $t(`PAGES.PROFILE_NEW.STEP${step}.INSTRUCTIONS.TEXT`) }}
          </p>

          <img
            :src="assets_loadImage(`pages/profile-new/step-${step}.svg`)"
            :title="$t(`PAGES.PROFILE_NEW.STEP${step}.INSTRUCTIONS.HEADER`)"
            class="w-full xl:w-4/5 mt-10"
          >
        </div>
      </div>

      <div class="flex-none w-full lg:max-w-sm p-10 bg-theme-feature rounded-lg overflow-y-auto">
        <MenuStep
          v-model="step"
        >
          <MenuStepItem
            :step="1"
            :is-next-enabled="!$v.step1.$invalid"
            :title="$t('PAGES.PROFILE_NEW.STEP1.TITLE')"
            @next="moveTo(2)"
          >
            <!-- NOTE wraps the content, but doesn't modify the stepper -->
            <div class="flex flex-col">
              <div class="flex mb-5">
                <InputText
                  v-model="$v.schema.name.$model"
                  :label="$t('PAGES.PROFILE_NEW.STEP1.NAME')"
                  :is-invalid="$v.schema.name.$dirty && $v.schema.name.$invalid"
                  :helper-text="nameError"
                  class="flex-1 mr-5"
                  name="name"
                />

                <InputSelect
                  v-model="currency"
                  :items="currencies"
                  :label="$t('COMMON.CURRENCY')"
                  name="currency"
                  class="flex-1"
                />
              </div>

              <div class="flex mb-5">
                <InputLanguage
                  v-model="language"
                  name="language"
                  class="flex-1 mr-5"
                />

                <InputSelect
                  v-model="bip39Language"
                  :items="bip39Languages"
                  :label="$t('COMMON.BIP39_LANGUAGE')"
                  name="bip39-language"
                  class="flex-1"
                />
              </div>

              <div class="flex mb-5 w-1/2 ProfileNew__time-format-container">
                <InputSelect
                  v-model="timeFormat"
                  :items="timeFormats"
                  :label="$t('COMMON.TIME_FORMAT')"
                  name="time-format"
                  class="flex-1"
                />
              </div>

              <div class="flex items-center justify-between mt-5 pt-5 mb-2 border-t border-theme-line-separator border-dashed">
                <div class="mr-2">
                  <h5 class="mb-2">
                    {{ $t('COMMON.AVATAR') }}
                  </h5>
                  <p class="text-theme-page-text-light">
                    {{ $t('PAGES.PROFILE_NEW.STEP1.AVATAR') }}
                  </p>
                </div>
                <SelectionAvatar
                  :selected="schema.avatar"
                  :extra-items="[{
                    title: $t('PAGES.PROFILE_NEW.STEP1.NO_AVATAR'),
                    textContent: schema.name,
                    onlyLetter: true
                  }]"
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
            :title="$t('PAGES.PROFILE_NEW.STEP2.TITLE')"
            @back="moveTo(1)"
            @next="moveTo(3)"
          >
            <div class="flex flex-col">
              <!-- Show the two default networks, and a button to load more -->
              <SelectionNetwork
                :selected="selectedNetwork"
                :networks="defaultNetworks"
                @select="selectNetwork"
              />
              <div v-if="availableCustomNetworks.length">
                <p class="mt-5 mb-1 text-theme-page-text font-semibold">
                  {{ $t('PAGES.PROFILE_NEW.STEP2.CUSTOM_NETWORK') }}
                </p>
                <p class="text-theme-page-text-light mb-5">
                  {{ $t('PAGES.PROFILE_NEW.STEP2.CUSTOM_NETWORK_EXPLAIN') }}
                </p>
                <SelectionNetwork
                  :selected="selectedNetwork"
                  :networks="availableCustomNetworks"
                  :is-custom="true"
                  @select="selectNetwork"
                />
              </div>
            </div>
          </MenuStepItem>

          <MenuStepItem
            :step="3"
            :is-back-visible="true"
            :is-next-enabled="!$v.schema.$invalid"
            :is-disabled="step < 3"
            :title="$t('PAGES.PROFILE_NEW.STEP3.TITLE')"
            @back="moveTo(2)"
            @next="create"
          >
            <div class="flex flex-col h-full w-full justify-around">
              <div class="flex items-center justify-between mb-5 mt-2">
                <div>
                  <h5 class="mb-2">
                    {{ $t('COMMON.THEME') }}
                  </h5>
                  <p class="text-theme-page-text-light">
                    {{ $t('PAGES.PROFILE_NEW.STEP3.THEME') }}
                  </p>
                </div>
                <SelectionTheme v-model="theme" />
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <h5 class="mb-2">
                    {{ $t('COMMON.BACKGROUND') }}
                  </h5>
                  <p class="text-theme-page-text-light">
                    {{ $t('PAGES.PROFILE_NEW.STEP3.BACKGROUND') }}
                  </p>
                </div>
                <SelectionBackground
                  :selected="background"
                  @select="selectBackground"
                />
              </div>
            </div>
          </MenuStepItem>
        </MenuStep>
      </div>
    </main>
  </div>
</template>

<script>
import { BIP39, NETWORKS } from '@config'
import Profile from '@/models/profile'
import { MenuStep, MenuStepItem } from '@/components/Menu'
import { InputLanguage, InputSelect, InputText } from '@/components/Input'
import { SelectionAvatar, SelectionBackground, SelectionNetwork, SelectionTheme } from '@/components/Selection'

export default {
  name: 'ProfileNew',

  components: {
    InputLanguage,
    InputSelect,
    InputText,
    MenuStep,
    MenuStepItem,
    SelectionAvatar,
    SelectionBackground,
    SelectionNetwork,
    SelectionTheme
  },

  schema: Profile.schema,

  data: () => ({
    step: 1,
    selectedNetwork: null
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
    bip39Language: {
      get () {
        return this.$store.getters['session/bip39Language'] || BIP39.defaultLanguage
      },
      set (bip39language) {
        this.selectBip39Language(bip39language)
      }
    },
    currency: {
      get () {
        return this.$store.getters['session/currency']
      },
      set (currency) {
        this.selectCurrency(currency)
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
    timeFormat: {
      get () {
        return this.$store.getters['session/timeFormat']
      },
      set (timeFormat) {
        this.selectTimeFormat(timeFormat)
      }
    },
    currencies () {
      return this.$store.getters['market/currencies']
    },
    bip39Languages () {
      return BIP39.languages.reduce((all, language) => {
        all[language] = this.$t(`BIP39_LANGUAGES.${language}`)

        return all
      }, {})
    },
    timeFormats () {
      return ['Default', '12h', '24h'].reduce((all, format) => {
        all[format] = this.$t(`TIME_FORMAT.${format}`)
        return all
      }, {})
    },
    defaultNetworks () {
      return NETWORKS.map(network => network)
    },
    customNetworks () {
      return this.$store.getters['network/customNetworks']
    },
    availableCustomNetworks: {
      get () {
        return Object.values(this.customNetworks)
      },
      cache: false
    },
    nameError () {
      if (this.$v.schema.name.$dirty && this.$v.schema.name.$invalid) {
        if (!this.$v.schema.name.doesNotExist) {
          return this.$t('VALIDATION.NAME.DUPLICATED', [this.schema.name])
        } else if (!this.$v.schema.name.schemaMaxLength) {
          return this.$t('VALIDATION.NAME.MAX_LENGTH', [Profile.schema.properties.name.maxLength])
        } else if (!this.$v.schema.name.schemaMinLength) {
          return this.$tc('VALIDATION.NAME.MIN_LENGTH', Profile.schema.properties.name.minLength)
        }
      }

      return null
    }
  },

  // Reuse the settings of the current profile
  // Or get defaults
  created () {
    this.schema.background = this.background
    this.schema.language = this.language
    this.schema.currency = this.currency
    this.schema.theme = this.theme
    this.selectNetwork(this.defaultNetworks.find(network => network.id === 'ark.mainnet'))
  },

  destroyed () {
    this.$store.dispatch('session/setProfileId', this.session_profile.id)
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$synchronizer.focus()
      vm.$synchronizer.pause('market')
    })
  },

  methods: {
    async create () {
      const { id } = await this.$store.dispatch('profile/create', this.schema)
      await this.$store.dispatch('session/setProfileId', id)
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
      await this.$store.dispatch('session/setBackground', background)
    },

    selectCurrency (currency) {
      this.schema.currency = currency
    },

    selectLanguage (language) {
      this.schema.language = language
      this.$store.dispatch('session/setLanguage', language)
    },

    selectBip39Language (bip39Language) {
      this.schema.bip39Language = bip39Language
      this.$store.dispatch('session/setBip39Language', bip39Language)
    },

    selectNetwork (network) {
      this.schema.networkId = network.id
      this.selectedNetwork = network
    },

    selectNetworkFromModal (network, toggle) {
      this.schema.networkId = network.id
      this.selectedNetwork = network
      toggle()
    },

    async selectTheme (theme) {
      this.schema.theme = theme
      await this.$store.dispatch('session/setTheme', theme)
    },

    async selectTimeFormat (timeFormat) {
      this.schema.timeFormat = timeFormat
      await this.$store.dispatch('session/setTimeFormat', timeFormat)
    }
  },

  validations: {
    step1: ['schema.avatar', 'schema.currency', 'schema.language', 'schema.name'],
    step2: ['schema.networkId'],
    schema: {
      name: {
        doesNotExist (value) {
          return !this.$store.getters['profile/doesExist'](value)
        }
      }
    }
  }
}
</script>

<style scoped>
.ProfileNew__time-format-container {
  /* To produce the exact same width  (.pr-5 class / 2) */
  padding-right: 0.625rem
}
</style>
