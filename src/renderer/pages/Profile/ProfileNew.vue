<template>
  <div class="ProfileNew relative bg-theme-feature rounded-lg m-r-4">
    <main class="flex flex-row h-full">

      <div
        :style="`background-image: url('${assets_loadImage('pages/background-1920.png')}')`"
        class="ProfileNew__instructions flex-grow background-image"
      >
        <div class="mt-16 mx-16">
          <h3 class="mb-2">{{ $t(`pages.profile-new.step${step}.instructions.header`) }}</h3>
          <p>
            {{ $t(`pages.profile-new.step${step}.instructions.text`) }}
          </p>
        </div>
      </div>

      <div class="flex-no-grow p-10">
        <CollapsibleStepper
          :step="step"
        >

          <CollapsibleStepperItem
            :step="1"
            :is-next-enabled="!$v.step1.$invalid"
            title="Profile"
            @next="moveTo(2)"
          >

            <!-- NOTE wraps the content, but doesn't modify the stepper -->
            <div class="flex flex-col justify-around">

              <!-- TODO check duplicate here -->
              <InputText
                v-model="schema.name"
                :label="$t('pages.profile-new.step1.name')"
                :is-invalid="$v.schema.name.$dirty && $v.schema.name.$invalid"
                name="name"
              />

              <div class="flex flex-row">
                <InputSelect
                  :items="languages"
                  :value="schema.language"
                  name="language"
                  label="Language"
                  class="mr-2"
                  @select="selectLanguage"
                />

                <InputSelect
                  :items="currencies"
                  :value="schema.currency"
                  name="currency"
                  label="Currency"
                  class="ml-2"
                  @select="selectCurrency"
                />
              </div>

              <div>
                <h5>Avatar</h5>

                <SelectionAvatar
                  :max-visible-items="2"
                  :selected="schema.avatar"
                  @select="selectAvatar"
                />
              </div>

            </div>

          </CollapsibleStepperItem>

          <CollapsibleStepperItem
            :step="2"
            :is-back-visible="true"
            :is-next-enabled="!$v.step2.$invalid"
            title="Network"
            @back="moveTo(1)"
            @next="moveTo(3)"
          >

            <div class="flex flex-col h-full w-full justify-around">
              <SelectionNetwork
                :max-visible-items="2"
                :selected="schema.network"
                @select="selectNetwork"
              />
            </div>

          </CollapsibleStepperItem>

          <CollapsibleStepperItem
            :step="3"
            :is-back-visible="true"
            :is-next-enabled="!$v.schema.$invalid"
            title="Appearance"
            @back="moveTo(2)"
            @next="create"
          >

            <div class="flex flex-col h-full w-full justify-around">
              <h5>Select wallet theme:</h5>

              <SelectionTheme
                :max-visible-items="2"
                :selected="schema.theme"
                @select="selectTheme"
              />

              <h5>Select background:</h5>

              <SelectionBackground
                :max-visible-items="2"
                :selected="schema.background"
                @select="selectBackground"
              />
            </div>

          </CollapsibleStepperItem>

        </CollapsibleStepper>
      </div>
    </main>
  </div>
</template>

<script>
import { I18N, NETWORKS, MARKET } from '@config'
import Profile from '@/models/profile'
import { CollapsibleStepper, CollapsibleStepperItem } from '@/components/CollapsibleStepper'
import InputSelect from '@/components/InputSelect'
import InputText from '@/components/InputText'
import { SelectionAvatar, SelectionBackground, SelectionNetwork, SelectionTheme } from '@/components/Selection'

export default {
  name: 'ProfileNew',

  components: {
    SelectionAvatar,
    SelectionBackground,
    SelectionNetwork,
    SelectionTheme,
    CollapsibleStepper,
    CollapsibleStepperItem,
    InputSelect,
    InputText
  },

  schema: Profile.schema,

  data: () => ({
    step: 1
  }),

  computed: {
    currencies () {
      return MARKET.currencies
    },
    languages () {
      return I18N.enabledLocales.map(locale => this.$i18n.t(`languages.${locale}`))
    },
    networks () {
      return NETWORKS.map(network => network.id)
    }
  },

  // TODO remove when InputSelect is available
  mounted () {
    this.selectCurrency('EUR')
    this.selectLanguage('es-ES')
  },

  methods: {
    async create () {
      await this.$store.dispatch('profiles/create', new Profile(this.schema))
      this.$router.push({ name: 'dashboard' })
    },

    moveTo (step) {
      this.step = step
    },

    selectAvatar (avatar) {
      this.schema.avatar = avatar
    },

    selectBackground (background) {
      this.schema.background = background
    },

    selectCurrency (currency) {
      this.schema.currency = currency
    },

    selectLanguage (language) {
      this.schema.language = language
    },

    selectNetwork (network) {
      this.schema.network = network
    },

    selectTheme (theme) {
      this.schema.theme = theme
    }
  },

  validations: {
    // TODO enable currency and language
    // step1: ['schema.avatar', 'schema.currency', 'schema.language', 'schema.name'],
    step1: ['schema.avatar', 'schema.name'],
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
