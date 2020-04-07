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
                  class="flex-1"
                  name="name"
                />
              </div>

              <div class="flex mb-5">
                <InputSelect
                  v-model="currency"
                  :items="currencies"
                  :label="$t('COMMON.CURRENCY')"
                  name="currency"
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

              <div class="flex mb-5">
                <InputSelect
                  v-model="timeFormat"
                  :items="timeFormats"
                  :label="$t('COMMON.TIME_FORMAT')"
                  name="time-format"
                  class="flex-1 mr-5"
                />

                <InputSelect
                  v-model="priceApi"
                  :items="priceApis"
                  :label="$t('COMMON.PRICE_PROVIDER')"
                  name="price-api"
                  class="flex-1"
                />
              </div>

              <div class="ProfileNew__avatar flex items-center justify-between mt-5 pt-5 mb-2 border-t border-theme-line-separator border-dashed">
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
                  :letter-value="schema.name"
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
                :add-button="true"
                @select="selectNetwork"
              />
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
                    {{ $t('COMMON.IS_MARKET_CHART_ENABLED') }}
                  </h5>
                  <p class="text-theme-page-text-light">
                    {{ $t('PAGES.PROFILE_NEW.STEP3.MARKET_CHART') }}
                  </p>
                </div>
                <ButtonSwitch
                  :is-active="isMarketChartEnabled"
                  @change="selectIsMarketChartEnabled"
                />
              </div>

              <div class="flex items-center justify-between mb-5 mt-2">
                <div>
                  <h5 class="mb-2">
                    {{ $t('COMMON.THEME') }}
                  </h5>
                  <p class="text-theme-page-text-light">
                    {{ $t('PAGES.PROFILE_NEW.STEP3.THEME') }}
                  </p>
                </div>
                <SelectionTheme
                  v-model="theme"
                />
              </div>

              <div class="ProfileNew__background flex items-center justify-between">
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
import { BIP39, I18N, MARKET, NETWORKS } from '@config'
import Profile from '@/models/profile'
import { ButtonSwitch } from '@/components/Button'
import { MenuStep, MenuStepItem } from '@/components/Menu'
import { InputSelect, InputText } from '@/components/Input'
import { SelectionAvatar, SelectionBackground, SelectionNetwork, SelectionTheme } from '@/components/Selection'

export default {
  name: 'ProfileNew',

  components: {
    ButtonSwitch,
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
    isMarketChartEnabled: {
      get () {
        return this.$store.getters['session/isMarketChartEnabled']
      },
      set (isMarketChartEnabled) {
        this.selectIsMarketChartEnabled(isMarketChartEnabled)
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
        return this.$store.getters['session/timeFormat'] || 'Default'
      },
      set (timeFormat) {
        this.selectTimeFormat(timeFormat)
      }
    },
    priceApi: {
      get () {
        return this.$store.getters['session/priceApi'] || 'coingecko'
      },
      set (priceApi) {
        this.selectPriceApi(priceApi)
      }
    },
    currencies () {
      return Object.keys(MARKET.currencies)
    },
    bip39Languages () {
      return BIP39.languages.reduce((all, language) => {
        all[language] = this.$t(`BIP39_LANGUAGES.${language}`)

        return all
      }, {})
    },
    timeFormats () {
      return ['Default', '12h', '24h'].reduce((all, format) => {
        all[format] = this.$t(`TIME_FORMAT.${format.toUpperCase()}`)
        return all
      }, {})
    },
    priceApis () {
      return {
        coingecko: 'CoinGecko',
        cryptocompare: 'CryptoCompare',
        coincap: 'CoinCap'
      }
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

  /**
   * Reuse the settings of the current profile every time the page is created
   */
  created () {
    this.selectNetwork(this.defaultNetworks.find(network => network.id === 'ark.mainnet'))
    this.schema.background = this.background
    this.schema.bip39Language = this.bip39Language
    this.schema.currency = this.currency
    this.schema.isMarketChartEnabled = this.isMarketChartEnabled
    this.schema.language = I18N.defaultLocale
    this.schema.timeFormat = this.timeFormat
    this.schema.priceApi = this.priceApi

    // In case we came from a profile using a plugin theme, revert back to default
    const defaultThemes = ['light', 'dark']
    this.schema.theme = defaultThemes.includes(this.theme)
      ? this.theme
      : defaultThemes[0]
    if (this.schema.theme !== this.$store.getters['session/theme']) {
      this.$store.dispatch('session/setTheme', this.schema.theme)
    }
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
      if (typeof avatar === 'string') {
        this.schema.avatar = avatar
      } else if (avatar.onlyLetter) {
        this.schema.avatar = null
      } else if (avatar.name) {
        this.schema.avatar = {
          avatarName: avatar.name,
          pluginId: avatar.pluginId
        }
      } else {
        throw new Error(`Invalid value for avatar: ${avatar}`)
      }
    },

    async selectBackground (background) {
      this.schema.background = background
      await this.$store.dispatch('session/setBackground', background)
    },

    selectCurrency (currency) {
      this.schema.currency = currency
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

    async selectIsMarketChartEnabled (isMarketChartEnabled) {
      this.schema.isMarketChartEnabled = isMarketChartEnabled
      await this.$store.dispatch('session/setIsMarketChartEnabled', isMarketChartEnabled)
    },

    async selectTheme (theme) {
      this.schema.theme = theme
      await this.$store.dispatch('session/setTheme', theme)
    },

    async selectTimeFormat (timeFormat) {
      this.schema.timeFormat = timeFormat
      await this.$store.dispatch('session/setTimeFormat', timeFormat)
    },

    async selectPriceApi (priceApi) {
      this.schema.priceApi = priceApi
      await this.$store.dispatch('session/setPriceApi', priceApi)
    }
  },

  validations: {
    step1: ['schema.avatar', 'schema.currency', 'schema.bip39Language', 'schema.name'],
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

<style lang="postcss">
.ProfileNew__avatar .SelectionAvatar .InputGrid__container button:first-child,
.ProfileNew__avatar .SelectionAvatar .InputGrid__container button:first-child .InputGridItem {
  @apply .cursor-default .opacity-100;
}

.ProfileNew__background .SelectionBackgroundGrid .InputGrid__container button:first-child,
.ProfileNew__background .SelectionBackgroundGrid .InputGrid__container button:first-child .InputGridItem {
  @apply .cursor-default .opacity-100;
}
</style>
