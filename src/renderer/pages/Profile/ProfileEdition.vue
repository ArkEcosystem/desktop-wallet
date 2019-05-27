<template>
  <div class="ProfileEdition relative">
    <main class="flex h-full">
      <div
        class="ProfileNew__instructions theme-dark bg-theme-feature text-theme-page-instructions-text hidden lg:flex flex-1 mr-4 rounded-lg overflow-y-auto"
      >
        <div class="m-auto w-3/5 text-center flex flex-col items-center justify-center">
          <h1 class="text-inherit">
            {{ $t(`PAGES.PROFILE_EDITION.TAB_${tab.toUpperCase()}.INSTRUCTIONS.HEADER`) }}
          </h1>
          <p class="text-center py-2 leading-normal">
            {{ $t(`PAGES.PROFILE_EDITION.TAB_${tab.toUpperCase()}.INSTRUCTIONS.TEXT`) }}
          </p>

          <div class="relative w-full xl:w-4/5 mt-10">
            <img
              :src="assets_loadImage(instructionsImage)"
              :title="$t(`PAGES.PROFILE_EDITION.TAB_${tab.toUpperCase()}.INSTRUCTIONS.HEADER`)"
            >
            <h2
              v-if="isProfileTab"
              class="ProfileNew__instructions__name opacity-75 absolute pin-x z-10 hidden xl:block"
            >
              {{ name }}
            </h2>
          </div>
        </div>
      </div>

      <div class="flex-none w-full lg:max-w-sm bg-theme-feature rounded-lg overflow-y-auto">
        <MenuTab v-model="tab">
          <MenuTabItem
            :label="$t('PAGES.PROFILE_EDITION.TAB_PROFILE.TITLE')"
            tab="profile"
            class="p-5"
          >
            <ListDivided>
              <ListDividedItem
                :label="$t('COMMON.PROFILE_NAME')"
                class="ProfileEdition__name"
              >
                <InputText
                  v-if="isNameEditable"
                  v-model="$v.modified.name.$model"
                  label=""
                  :is-invalid="$v.modified.name.$dirty && $v.modified.name.$invalid"
                  :helper-text="nameError"
                  class="bg-transparent text-theme-page-text flex-1"
                  name="name"
                  @input="setName"
                  @keyup.enter.native="toggleIsNameEditable"
                  @keyup.esc.native="toggleIsNameEditable"
                />
                <div
                  v-else
                  :class="{
                    'ProfileEdition__field--modified': modified.name && modified.name !== profile.name
                  }"
                  class="leading-tight border-b border-transparent flex-1"
                >
                  {{ name }}
                </div>

                <button
                  :disabled="$v.modified.name.$dirty && $v.modified.name.$invalid"
                  class="ProfileEdition__name__toggle ml-2 cursor-pointer text-grey hover:text-blue focus:text-blue inline-flex"
                  @click="toggleIsNameEditable"
                >
                  <SvgIcon
                    name="edit"
                    view-box="0 0 11 14"
                  />
                </button>
              </ListDividedItem>

              <ListDividedItem
                :label="$t('COMMON.LANGUAGE')"
                class="ProfileEdition__language"
              >
                <MenuDropdown
                  :class="{
                    'ProfileEdition__field--modified': modified.language && modified.language !== profile.language
                  }"
                  :items="languages"
                  :value="language"
                  :position="['-50%', '0%']"
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
                      class="ProfileEdition__language__item__flag mr-2"
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
                        class="ProfileEdition__language__handler__flag mr-1"
                      >
                      {{ handlerScope.item }}
                    </MenuDropdownHandler>
                  </div>
                </MenuDropdown>
              </ListDividedItem>

              <ListDividedItem :label="$t('COMMON.BIP39_LANGUAGE')">
                <MenuDropdown
                  :class="{
                    'ProfileEdition__field--modified': modified.bip39Language && modified.bip39Language !== profile.bip39Language
                  }"
                  :items="bip39Languages"
                  :value="bip39Language"
                  :position="['-50%', '0%']"
                  @select="selectBip39Language"
                />
              </ListDividedItem>

              <ListDividedItem :label="$t('COMMON.CURRENCY')">
                <MenuDropdown
                  :class="{
                    'ProfileEdition__field--modified': modified.currency && modified.currency !== profile.currency
                  }"
                  :items="currencies"
                  :value="currency"
                  :position="['-50%', '0%']"
                  @select="selectCurrency"
                />
              </ListDividedItem>

              <ListDividedItem :label="$t('COMMON.TIME_FORMAT')">
                <MenuDropdown
                  :class="{
                    'ProfileEdition__field--modified': modified.timeFormat && modified.timeFormat !== profile.timeFormat
                  }"
                  :items="timeFormats"
                  :value="timeFormat"
                  :position="['-50%', '0%']"
                  @select="selectTimeFormat"
                />
              </ListDividedItem>

              <ListDividedItem
                v-if="!hasWallets"
                :label="$t('COMMON.NETWORK')"
              >
                <MenuDropdown
                  :class="{
                    'ProfileEdition__field--modified': modified.networkId && modified.networkId !== profile.networkId
                  }"
                  :items="networks"
                  :value="networkId"
                  :position="['-50%', '0%']"
                  @select="selectNetwork"
                />
              </ListDividedItem>

              <ListDividedItem
                :label="$t('COMMON.AVATAR')"
                class="ProfileEdition__avatar"
              >
                <SelectionAvatar
                  :enable-modal="true"
                  :letter-value="name"
                  :max-visible-items="3"
                  :selected="avatar"
                  :profile="profile"
                  @select="selectAvatar"
                />
              </ListDividedItem>
            </ListDivided>

            <footer class="ProfileEdition__footer pb-10">
              <button
                :disabled="!isModified || isNameEditable"
                class="blue-button"
                @click="save"
              >
                {{ $t('COMMON.SAVE') }}
              </button>
            </footer>
          </MenuTabItem>

          <MenuTabItem
            :label="$t('PAGES.PROFILE_EDITION.TAB_DESIGN.TITLE')"
            tab="design"
            class="p-5"
          >
            <ListDivided>
              <ListDividedItem
                :label="$t('COMMON.HIDE_WALLET_BUTTON_TEXT')"
                class="ProfileEdition__wallet-button-text"
              >
                <ButtonSwitch
                  :is-active="hideWalletButtonText"
                  @change="selectHideWalletButtonText"
                />
              </ListDividedItem>

              <ListDividedItem
                :label="$t('COMMON.IS_MARKET_CHART_ENABLED')"
                :item-label-class="!isMarketEnabled ? 'opacity-50' : ''"
                :item-value-class="!isMarketEnabled ? 'opacity-50 cursor-not-allowed' : ''"
                class="ProfileEdition__market-chart"
              >
                <ButtonSwitch
                  :is-disabled="!isMarketEnabled"
                  :is-active="isMarketChartEnabled"
                  @change="selectIsMarketChartEnabled"
                />
              </ListDividedItem>

              <ListDividedItem
                :label="$t('COMMON.THEME')"
                class="ProfileEdition__theme"
              >
                <MenuDropdown
                  v-if="pluginThemes"
                  :class="{
                    'ProfileEdition__field--modified': modified.theme && modified.theme !== profile.theme
                  }"
                  :items="themes"
                  :value="theme"
                  :position="['-50%', '0%']"
                  @select="selectTheme"
                />
                <SelectionTheme
                  v-else
                  :value="theme"
                  @input="selectTheme"
                />
              </ListDividedItem>

              <ListDividedItem
                :label="$t('COMMON.BACKGROUND')"
                class="ProfileEdition__background"
              >
                <SelectionBackground
                  :max-visible-items="5"
                  :selected="background"
                  @select="selectBackground"
                />
              </ListDividedItem>
            </ListDivided>

            <footer class="ProfileEdition__footer pb-10">
              <button
                :disabled="!isModified || isNameEditable"
                class="blue-button"
                @click="save"
              >
                {{ $t('COMMON.SAVE') }}
              </button>
            </footer>
          </MenuTabItem>
        </MenuTab>
      </div>
    </main>

    <ProfileLeavingConfirmation
      v-if="routeLeaveCallback"
      :profile="profile"
      @close="onStopLeaving"
      @ignore="onLeave(false)"
      @save="onLeave(true)"
    />
  </div>
</template>

<script>
import { isEmpty } from 'lodash'
import { BIP39, I18N } from '@config'
import { ButtonSwitch } from '@/components/Button'
import { InputText } from '@/components/Input'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { MenuDropdown, MenuDropdownHandler, MenuTab, MenuTabItem } from '@/components/Menu'
import { ProfileLeavingConfirmation } from '@/components/Profile'
import { SelectionAvatar, SelectionBackground, SelectionTheme } from '@/components/Selection'
import SvgIcon from '@/components/SvgIcon'
import Profile from '@/models/profile'

/**
 * This component uses the data property `modified` to hold the changes done during
 * the edition and to highlight the fields that have been changed in blue.
 */
export default {
  name: 'ProfileEdition',

  components: {
    ButtonSwitch,
    InputText,
    ListDivided,
    ListDividedItem,
    MenuTab,
    MenuTabItem,
    MenuDropdown,
    MenuDropdownHandler,
    ProfileLeavingConfirmation,
    SelectionAvatar,
    SelectionBackground,
    SelectionTheme,
    SvgIcon
  },

  data: () => ({
    isNameEditable: false,
    modified: {
      name: '',
      language: '',
      bip39Language: '',
      currency: '',
      timeFormat: ''
    },
    routeLeaveCallback: null,
    tab: 'profile'
  }),

  computed: {
    currencies () {
      return this.$store.getters['market/currencies']
    },
    timeFormats () {
      return ['Default', '12h', '24h'].reduce((all, format) => {
        all[format] = this.$t(`TIME_FORMAT.${format.toUpperCase()}`)
        return all
      }, {})
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
      return this.$store.getters['network/all'].reduce((acc, network) => {
        acc[network.id] = network.name
        return acc
      }, {})
    },

    hasWallets () {
      const wallets = this.$store.getters['wallet/byProfileId'](this.profile.id)
      return !isEmpty(wallets)
    },

    isModified () {
      return Object.keys(this.modified).some(property => {
        if (property === 'avatar' || this.modified.hasOwnProperty(property)) {
          return this.modified[property] !== this.profile[property]
        }
        return false
      })
    },

    profile () {
      const profileId = this.$route.params.profileId
      return this.$store.getters['profile/byId'](profileId)
    },
    isCurrentProfile () {
      return this.session_profile.id === this.profile.id
    },

    avatar () {
      return this.modified.avatar || this.profile.avatar
    },
    background () {
      return this.modified.background || this.profile.background
    },
    // TODO update it when modified, but it's changed on the sidemenu
    currency () {
      return this.modified.currency || this.profile.currency
    },
    timeFormat () {
      return this.modified.timeFormat || this.profile.timeFormat
    },
    language () {
      return this.modified.language || this.profile.language
    },
    bip39Language () {
      return this.modified.bip39Language || this.profile.bip39Language || BIP39.defaultLanguage
    },
    name () {
      return this.modified.name || this.profile.name
    },
    networkId () {
      return this.modified.networkId || this.profile.networkId
    },
    // TODO update it when modified, but it's changed on the sidemenu
    theme () {
      return this.modified.theme || this.profile.theme
    },
    hideWalletButtonText () {
      return this.modified.hideWalletButtonText || this.profile.hideWalletButtonText
    },
    isMarketChartEnabled () {
      return this.modified.isMarketChartEnabled || this.profile.isMarketChartEnabled
    },
    isMarketEnabled () {
      return this.session_network && this.session_network.market && this.session_network.market.enabled
    },
    isProfileTab () {
      return this.tab === 'profile'
    },
    instructionsImage () {
      const name = this.isProfileTab ? 'step-1' : 'step-3'
      return `pages/profile-new/${name}.svg`
    },
    nameError () {
      if (this.$v.modified.name.$dirty && this.$v.modified.name.$invalid) {
        if (!this.$v.modified.name.doesNotExist) {
          return this.$t('VALIDATION.NAME.DUPLICATED', [this.modified.name])
        } else if (!this.$v.modified.name.maxLength) {
          return this.$t('VALIDATION.NAME.MAX_LENGTH', [Profile.schema.properties.name.maxLength])
        } else if (!this.$v.modified.name.minLength) {
          return this.$tc('VALIDATION.NAME.MIN_LENGTH', Profile.schema.properties.name.minLength)
        }
      }

      return null
    },
    pluginThemes () {
      return isEmpty(this.$store.getters['plugin/themes'])
        ? null
        : this.$store.getters['plugin/themes']
    },
    themes () {
      return ['light', 'dark', ...Object.keys(this.pluginThemes)]
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$synchronizer.focus()
      vm.$synchronizer.pause('market')
    })
  },

  beforeRouteLeave (to, from, next) {
    if (this.isModified) {
      // Capture the callback to trigger it when user has decided to update or not the profile
      this.routeLeaveCallback = next
    } else {
      next()
    }
  },

  mounted () {
    this.modified.name = this.profile.name
    this.modified.language = this.profile.language
    this.modified.bip39Language = this.profile.bip39Language
    this.modified.currency = this.profile.currency
    this.modified.timeFormat = this.profile.timeFormat || 'Default'
  },

  methods: {
    onStopLeaving () {
      this.routeLeaveCallback = null
    },

    async onLeave (hasToSave) {
      if (hasToSave) {
        await this.updateProfile()
      } else {
        this.$store.dispatch('session/load', this.session_profile.id)
      }

      this.routeLeaveCallback()
    },

    flagImage (language) {
      return this.assets_loadImage(`flags/${language}.svg`)
    },

    toggleIsNameEditable () {
      if (!this.nameError || !this.isNameEditable) {
        if (!this.isNameEditable && !this.modified.name) {
          this.$set(this.modified, 'name', this.profile.name)
        }
        this.isNameEditable = !this.isNameEditable
      }
    },

    async updateProfile () {
      await this.$store.dispatch('profile/update', {
        ...this.profile,
        ...this.modified
      })
    },

    async save () {
      await this.updateProfile()

      this.$router.push({ name: 'profiles' })
    },

    selectAvatar (avatar) {
      let newAvatar

      if (typeof avatar === 'string') {
        newAvatar = avatar
      } else if (avatar.onlyLetter) {
        newAvatar = null
      } else if (avatar.name) {
        newAvatar = {
          avatarName: avatar.name,
          pluginId: avatar.pluginId
        }
      } else {
        throw new Error(`Invalid value for avatar: ${avatar}`)
      }

      this.__updateSession('avatar', newAvatar)
    },

    async selectBackground (background) {
      this.__updateSession('background', background)
    },

    selectCurrency (currency) {
      this.__updateSession('currency', currency)
    },

    selectTimeFormat (format) {
      this.__updateSession('timeFormat', format)
    },

    async selectLanguage (language) {
      this.__updateSession('language', language)
    },

    selectBip39Language (bip39Language) {
      this.__updateSession('bip39Language', bip39Language)
    },

    selectNetwork (network) {
      this.$set(this.modified, 'networkId', network)
    },

    async selectTheme (theme) {
      this.__updateSession('theme', theme)
    },

    async selectHideWalletButtonText (hideWalletButtonText) {
      this.__updateSession('hideWalletButtonText', hideWalletButtonText)
    },

    async selectIsMarketChartEnabled (isMarketChartEnabled) {
      this.__updateSession('isMarketChartEnabled', isMarketChartEnabled)
    },

    setName (event) {
      this.__updateSession('name', this.modified.name)
      this.$v.modified.name.$touch()
    },

    async __updateSession (propertyName, value) {
      this.$set(this.modified, propertyName, value)

      if (this.isCurrentProfile) {
        const action = `session/set${this.capitalizeFirst(propertyName)}`
        await this.$store.dispatch(action, value)
      }
    },

    capitalizeFirst (value) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },

  validations: {
    modified: {
      name: {
        doesNotExist (value) {
          const otherProfile = this.$store.getters['profile/doesExist'](value)
          return !otherProfile || otherProfile.id === this.profile.id
        },
        maxLength (value) {
          return value.length <= Profile.schema.properties.name.maxLength
        },
        minLength (value) {
          return value.length >= Profile.schema.properties.name.minLength
        }
      }
    }
  }
}
</script>

<style scoped>
/* To display the images scaled to the size of the button */
.ProfileEdition__instructions {
  background-size: cover;
  background-position: center center;
}
</style>

<style lang="postcss">
.ProfileNew__instructions__name {
  bottom: 3.3rem;
}
.ProfileEdition .MenuTab .MenuTab__nav__item {
  @apply .px-10 .py-6
}
.ProfileEdition .MenuTab__content {
  padding-top: 0;
  padding-bottom: 0;
}

.ProfileEdition__language .MenuDropdown__container {
  min-width: 200px
}
.ProfileEdition__language .MenuDropdownItem__container {
  @apply .mx-2 .px-2
}
.ProfileEdition__language .MenuDropdownItem__container {
  @apply .break-normal
}
.ProfileEdition__language__item__flag {
  height: 18px
}
.ProfileEdition__language__handler__flag {
  height: 12px
}

.ProfileEdition__name .ProfileEdition__field--modified,
.ProfileEdition__field--modified .MenuDropdownHandler {
  @apply .text-blue .font-bold
}

.ProfileEdition__name .ListDividedItem__label {
  @apply .flex-no-shrink
}
.ProfileEdition__name .ListDividedItem__value {
  @apply .flex w-full text-right
}
.ProfileEdition__name .ListDividedItem__value .InputText {
  @apply .w-full .ml-4
}
.ProfileEdition__name__toggle {
  height: 21px
}
.ProfileEdition__name .ListDividedItem__value .InputText .InputField__wrapper {
  height: 0
}
.ProfileEdition__avatar .InputGrid__container {
  grid-template-columns: repeat(4, 4rem) !important;
  grid-gap: 1rem !important
}
</style>
