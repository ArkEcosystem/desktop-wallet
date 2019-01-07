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
              <InputText
                v-model="$v.schema.name.$model"
                :label="$t('PAGES.PROFILE_NEW.STEP1.NAME')"
                :is-invalid="$v.schema.name.$dirty && $v.schema.name.$invalid"
                :helper-text="nameError"
                class="mb-5"
                name="name"
              />

              <div class="flex mb-5">
                <InputSelect
                  v-model="language"
                  :items="languages"
                  :label="$t('COMMON.LANGUAGE')"
                  name="language"
                  class="flex-1 mr-2"
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
                <InputSelect
                  v-model="bip39Language"
                  :items="bip39Languages"
                  :label="$t('COMMON.BIP39_LANGUAGE')"
                  name="bip39-language"
                  class="flex-1"
                />
              </div>

              <div>
                <h5 class="mb-2">
                  {{ $t('COMMON.AVATAR') }}
                </h5>

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
              <div v-if="customNetworks.length">
                <p class="mt-5 mb-1 text-theme-page-text font-semibold">
                  {{ $t('PAGES.PROFILE_NEW.STEP2.INSTRUCTIONS.CUSTOM_NETWORK') }}
                </p>
                <p class="text-theme-page-text-light mb-5">
                  {{ $t('PAGES.PROFILE_NEW.STEP2.INSTRUCTIONS.CUSTOM_NETWORK_EXPLAIN') }}
                </p>
                <SelectionNetwork
                  :selected="selectedNetwork"
                  :networks="customNetworks"
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
              <h5 class="mb-2">
                {{ $t('COMMON.SELECT_THEME') }}
              </h5>

              <div class="flex items-center justify-between pb-5 mb-5 border-b border-dashed border-theme-line-separator">
                <p class="text-theme-page-text-light">
                  {{ $t('PAGES.PROFILE_NEW.STEP3.INSTRUCTIONS.THEME') }}
                </p>
                <SelectionTheme v-model="theme" />
              </div>

              <h5 class="mb-2">
                {{ $t('COMMON.SELECT_BACKGROUND') }}
              </h5>

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
import { BIP39, I18N, NETWORKS } from '@config'
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
        return this.$store.getters['session/bip39Language'] || 'english'
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
    currencies () {
      return this.$store.getters['market/currencies']
    },
    languages () {
      return I18N.enabledLocales.reduce((all, locale) => {
        all[locale] = this.$t(`LANGUAGES.${locale}`)
        return all
      }, {})
    },
    bip39Languages () {
      return BIP39.languages.reduce((all, language) => {
        all[language] = this.$t(`BIP39_LANGUAGES.${language}`)

        return all
      }, {})
    },
    defaultNetworks () {
      return NETWORKS.map(network => network)
    },
    customNetworks () {
      const networks = this.$store.getters['network/customNetworks']
      return Object.values(networks)
    },
    nameError () {
      if (this.$v.schema.name.$dirty && this.$v.schema.name.$invalid) {
        if (!this.$v.schema.name.doesNotExists) {
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
    }
  },

  validations: {
    step1: ['schema.avatar', 'schema.currency', 'schema.language', 'schema.name'],
    step2: ['schema.networkId'],
    schema: {
      name: {
        doesNotExists (value) {
          return !this.$store.getters['profile/doesExist'](value)
        }
      }
    }
  }
}
</script>
