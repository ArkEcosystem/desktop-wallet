<template>
  <div class="ProfileNew relative bg-theme-feature rounded-lg">
    <main class="flex flex-row h-full">

      <div
        :style="`background-image: url('${assets_loadImage(backgroundImages[isDarkMode][step])}')`"
        class="ProfileNew__instructions w-2/3 background-image"
      >
        <div class="instructions-text">
          <h3 class="mb-2 text-theme-page-instructions-text">{{ $t(`PAGES.PROFILE_NEW.STEP${step}.INSTRUCTIONS.HEADER`) }}</h3>
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
                  class="flex-1 mr-2"
                />
              </div>

              <div>
                <h5 class="mb-2">{{ $t('COMMON.AVATAR') }}</h5>

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
            :title="$t('COMMON.NETWORK')"
            @back="moveTo(1)"
            @next="moveTo(3)"
          >

            <div class="flex flex-row h-full w-full py-2">
              <!-- Show the two default networks, and a button to load more -->
              <div
                v-for="network in defaultNetworks"
                :key="network.id"
              >
                <div
                  :title="network.title"
                  :class="{
                    'svg-button--selected': selectedNetwork && selectedNetwork.id === network.id,
                    'rounded-l-lg': first.id === network.id,
                    'rounded-r-lg': last.id === network.id,
                  }"
                  class="svg-button w-30 h-30 text-center text-theme-page-text"
                  @click="selectNetwork(network)"
                >
                  <div
                    class="flex items-center justify-center"
                  >
                    <img
                      class="w-22 h-22"
                      :src="`${assets_loadImage(network.svg)}`"
                    >
                  </div>
                  <span class="text-theme-page-text font-semibold">{{ network.textContent }}</span>
                </div>
              </div>
              <div
                v-if="networks.length > defaultNetworks.length"
                class="flex items-center ml-3"
              >
                <ButtonModal
                  class="rounded-lg w-18 h-18 border-2 cursor-pointer rounded-lg hover:shadow transition text-center text-4xl text-center p-1 align-middle bg-theme-button text-theme-option-button-text hover:text-theme-button-text border-transparent"
                  icon="point"
                  label=""
                >
                  <template slot-scope="{ toggle, isOpen }">
                    <NetworkSelectionModal
                      v-if="isOpen"
                      :toggle="toggle"
                      @cancel="toggle"
                      @selected="selectNetworkFromModal"
                    />
                  </template>
                </ButtonModal>
              </div>
            </div>

          </MenuStepItem>

          <MenuStepItem
            :step="3"
            :is-back-visible="true"
            :is-next-enabled="!$v.schema.$invalid"
            :is-disabled="step < 3"
            :title="$t('COMMON.APPEARANCE')"
            @back="moveTo(2)"
            @next="create"
          >

            <div class="flex flex-col h-full w-full justify-around">
              <h5 class="mb-2">{{ $t('COMMON.SELECT_THEME') }}</h5>

              <SelectionTheme
                :max-visible-items="2"
                :selected="theme"
                class="mb-5"
                @select="selectTheme"
              />

              <h5 class="mb-2">{{ $t('COMMON.SELECT_BACKGROUND') }}</h5>

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
import { ButtonModal } from '@/components/Button'
import { NetworkSelectionModal } from '@/components/Network'
import { MenuStep, MenuStepItem } from '@/components/Menu'
import { InputSelect, InputText } from '@/components/Input'
import { SelectionAvatar, SelectionBackground, SelectionTheme } from '@/components/Selection'

export default {
  name: 'ProfileNew',

  components: {
    ButtonModal,
    NetworkSelectionModal,
    SelectionAvatar,
    SelectionBackground,
    SelectionTheme,
    MenuStep,
    MenuStepItem,
    InputSelect,
    InputText
  },

  schema: Profile.schema,

  data: () => ({
    step: 1,
    backgroundImages: {
      true: {
        1: 'pages/profile-new/background-step-1-dark.png',
        2: 'pages/profile-new/background-step-2-dark.png',
        3: 'pages/profile-new/background-step-3-dark.png'
      },
      false: {
        1: 'pages/profile-new/background-step-1.png',
        2: 'pages/profile-new/background-step-2.png',
        3: 'pages/profile-new/background-step-3.png'
      }
    },
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
    networks () {
      return this.$store.getters['network/all']
    },
    defaultNetworks () {
      return NETWORKS.map(network => {
        return {
          id: network.id,
          title: network.description,
          textContent: network.title,
          svg: `networks/${network.id}.svg`
        }
      })
    },
    first () {
      return this.defaultNetworks[0]
    },
    last () {
      return this.defaultNetworks[this.defaultNetworks.length - 1]
    },
    isDarkMode () {
      return this.$store.getters['session/hasDarkTheme']
    },
    nameError () {
      if (this.$v.schema.name.$dirty) {
        if (!this.$v.schema.name.doesNotExists) {
          const existingProfile = this.$store.getters['profile/doesExist'](this.schema.name).name

          return this.$t('VALIDATION.PROFILE.DUPLICATE_NAME', [existingProfile])
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
  },

  destroyed () {
    this.$store.dispatch('session/load', this.session_profile.id)
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

<style scoped>
/* To display the images scaled to the size of the button */
.ProfileNew__instructions {
  background-size: cover;
  background-position: center center;
}
.ProfileNew .svg-button--selected > span, .svg-button--selected > img {
  color: #fff;
}
</style>
