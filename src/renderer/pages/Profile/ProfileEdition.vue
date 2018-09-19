<template>
  <div class="ProfileEdition relative bg-theme-feature rounded-lg">
    <main class="flex flex-row h-full">

      <div
        :style="`background-image: url('${assets_loadImage('pages/background-1920.png')}')`"
        class="ProfileEdition__instructions w-3/5 background-image"
      >
        <div class="mt-16 mx-16">
          <h3 class="mb-2">{{ $t(`PAGES.PROFILE_EDITION.TAB_${tab.toUpperCase()}.INSTRUCTIONS.HEADER`) }}</h3>
          <p>
            {{ $t(`PAGES.PROFILE_EDITION.TAB_${tab.toUpperCase()}.INSTRUCTIONS.TEXT`) }}
          </p>
        </div>
      </div>

      <div class="w-2/5">
        <MenuTab :tab="tab">
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
                <input
                  v-if="isNameEditable"
                  :value="modified.name"
                  type="text"
                  class=""
                  @input="setName"
                  @keyup.enter="toggleIsNameEditable"
                  @keyup.esc="toggleIsNameEditable"
                >
                <span
                  v-else
                  :class="{
                    'ProfileEdition__field--modified': modified.name && modified.name !== profile.name
                  }"
                  class="flex leading-tight"
                >
                  {{ name }}
                </span>

                <div
                  class="ml-2 cursor-pointer text-grey hover:text-blue"
                  @click="toggleIsNameEditable"
                >
                  <SvgIcon
                    name="edit"
                    view-box="0 0 11 14"
                  />
                </div>
              </ListDividedItem>

              <ListDividedItem :label="$t('COMMON.LANGUAGE')">
                <MenuDropdown
                  :class="{
                    'ProfileEdition__field--modified': modified.language && modified.language !== profile.language
                  }"
                  :items="languages"
                  :value="language"
                  @select="selectLanguage"
                />
              </ListDividedItem>

              <ListDividedItem :label="$t('COMMON.CURRENCY')">
                <MenuDropdown
                  :class="{
                    'ProfileEdition__field--modified': modified.currency && modified.currency !== profile.currency
                  }"
                  :items="currencies"
                  :value="currency"
                  @select="selectCurrency"
                />
              </ListDividedItem>

              <ListDividedItem :label="$t('COMMON.NETWORK')">
                <MenuDropdown
                  :class="{
                    'ProfileEdition__field--modified': modified.networkId && modified.networkId !== profile.networkId
                  }"
                  :items="networks"
                  :value="networkId"
                  @select="selectNetwork"
                />
              </ListDividedItem>

              <ListDividedItem
                :label="$t('COMMON.AVATAR')"
                class="ProfileEdition__avatar"
              >
                <SelectionAvatar
                  :enable-popup="false"
                  :max-visible-items="4"
                  :selected="avatar"
                  @select="selectAvatar"
                />
              </ListDividedItem>

            </ListDivided>
          </MenuTabItem>

          <MenuTabItem
            :label="$t('PAGES.PROFILE_EDITION.TAB_DESIGN.TITLE')"
            tab="design"
            class="p-5"
          >
            <ListDivided>

              <ListDividedItem
                :label="$t('COMMON.SELECT_THEME')"
                class="ProfileEdition__theme"
              >
                <SelectionTheme
                  :max-visible-items="4"
                  :selected="theme"
                  @select="selectTheme"
                />
              </ListDividedItem>

              <ListDividedItem
                :label="$t('COMMON.SELECT_BACKGROUND')"
                class="ProfileEdition__background"
              >
                <SelectionBackground
                  :max-visible-items="5"
                  :selected="background"
                  @select="selectBackground"
                />
              </ListDividedItem>

            </ListDivided>
          </MenuTabItem>
        </MenuTab>

        <!-- TODO at the bottom ? -->
        <footer class="ProfileEdition__footer mt-3 p-10">
          <button
            :disabled="!isModified"
            class="blue-button"
            @click="save"
          >
            {{ $t('COMMON.SAVE') }}
          </button>
        </footer>
      </div>
    </main>
  </div>
</template>

<script>
import { capitalize } from 'lodash'
import { I18N, NETWORKS, MARKET } from '@config'
import { InputText, InputSelect } from '@/components/Input'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { MenuDropdown, MenuTab, MenuTabItem } from '@/components/Menu'
import { SelectionAvatar, SelectionBackground, SelectionTheme } from '@/components/Selection'
import SvgIcon from '@/components/SvgIcon'

/**
 * This component uses the data property `modified` to hold the changes done during
 * the edition and to highlight the fields that have been changed in blue.
 */
export default {
  name: 'ProfileEdition',

  components: {
    InputSelect,
    InputText,
    ListDivided,
    ListDividedItem,
    MenuTab,
    MenuTabItem,
    MenuDropdown,
    SelectionAvatar,
    SelectionBackground,
    SelectionTheme,
    SvgIcon
  },

  data: () => ({
    isNameEditable: false,
    modified: {},
    tab: 'profile'
  }),

  computed: {
    currencies () {
      return MARKET.currencies
    },
    languages () {
      return I18N.enabledLocales.reduce((all, locale) => {
        all[locale] = this.$t(`LANGUAGES.${locale}`)
        return all
      }, {})
    },
    networks () {
      return NETWORKS.reduce((acc, network) => {
        acc[network.id] = network.name
        return acc
      }, {})
    },

    isModified () {
      return Object.keys(this.modified).some(property => {
        if (this.modified[property]) {
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
      return this.$store.getters['session/profileId'] === this.profile.id
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
    language () {
      return this.modified.language || this.profile.language
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
    }
  },

  beforeDestroy () {
    this.$store.dispatch('session/load')
  },

  methods: {
    toggleIsNameEditable () {
      if (!this.isNameEditable && !this.modified.name) {
        this.$set(this.modified, 'name', this.profile.name)
      }
      this.isNameEditable = !this.isNameEditable
    },

    async save () {
      await this.$store.dispatch('profile/update', {
        ...this.profile,
        ...this.modified
      })

      this.$router.push({ name: 'profiles' })
    },

    selectAvatar (avatar) {
      this.__updateSession('avatar', avatar)
    },

    async selectBackground (background) {
      this.__updateSession('background', background)
    },

    selectCurrency (currency) {
      this.__updateSession('currency', currency)
    },

    async selectLanguage (language) {
      this.$i18n.locale = language

      this.__updateSession('language', language)
    },

    // TODO when API client works flawlessly
    selectNetwork (network) {
      this.__updateSession('network', network)
    },

    async selectTheme (theme) {
      this.__updateSession('theme', theme)
    },

    setName (event) {
      this.__updateSession('name', event.target.value)
    },

    async __updateSession (propertyName, value) {
      this.$set(this.modified, propertyName, value)

      if (this.isCurrentProfile) {
        const action = `session/set${capitalize(propertyName)}`
        await this.$store.dispatch(action, value)
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
.ProfileEdition .MenuTab .MenuTab__nav__item {
  @apply .px-10 .py-6
}

.ProfileEdition__name .ProfileEdition__field--modified,
.ProfileEdition__field--modified .MenuDropdownHandler {
  @apply .text-blue .font-bold
}

.ProfileEdition__name .ListDividedItem__label {
  @apply .flex-no-shrink
}
.ProfileEdition__name .ListDividedItem__value {
  @apply .flex .flex-row
}
.ProfileEdition__name .ListDividedItem__value input {
  @apply .w-full .ml-4
}

.ProfileEdition__avatar.ListDividedItem,
.ProfileEdition__background.ListDividedItem,
.ProfileEdition__theme.ListDividedItem {
  @apply .flex-col
}
.ProfileEdition__avatar .ListDividedItem__value,
.ProfileEdition__background .ListDividedItem__value,
.ProfileEdition__theme .ListDividedItem__value {
  @apply .pt-4
}
.ProfileEdition__avatar .InputGrid__container {
  grid-template-columns: repeat(4, 4rem) !important;
  grid-gap: 1rem !important
}
</style>
