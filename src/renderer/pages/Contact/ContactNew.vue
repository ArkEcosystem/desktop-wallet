<template>
  <div class="ContactNew relative bg-theme-feature rounded-lg m-r-4">
    <main class="flex flex-row h-full">

      <div
        :style="`background-image: url('${assets_loadImage(backgroundImages[isDarkMode][step])}')`"
        class="ContactNew__instructions flex-grow background-image w-3/5"
      >
        <div class="instructions-text">
          <h3 class="mb-2 text-theme-page-instructions-text">{{ $t(`PAGES.CONTACT_NEW.STEP${step}.INSTRUCTIONS.HEADER`) }}</h3>

          <p>
            {{ $t('PAGES.CONTACT_NEW.STEP1.INSTRUCTIONS.TEXT') }}
          </p>
        </div>
      </div>

      <div class="flex-no-grow p-10 w-2/5">
        <MenuStep
          :step="step"
        >

          <MenuStepItem
            :step="1"
            :is-next-enabled="!$v.step1.$invalid"
            :title="$t('PAGES.CONTACT_NEW.STEP1.TITLE')"
            @next="moveTo(2)"
          >

            <div class="flex flex-col h-full w-full justify-around">

              <InputAddress
                ref="addressInput"
                v-model="schema.address"
                :pub-key-hash="session_network.version"
                class="my-3"
              />
            </div>

          </MenuStepItem>

          <MenuStepItem
            :step="2"
            :is-back-visible="true"
            :is-next-enabled="!$v.step2.$invalid"
            :title="$t('PAGES.CONTACT_NEW.STEP2.TITLE')"
            @back="moveTo(1)"
            @next="create"
          >

            <div class="flex flex-col h-full w-full justify-around">

              <!-- TODO check duplicate here when db store is available -->
              <InputText
                v-model="schema.name"
                :label="$t('PAGES.CONTACT_NEW.STEP2.NAME')"
                :is-invalid="$v.schema.name.$dirty && $v.schema.name.$invalid"
                class="my-3"
                name="name"
              />

            </div>

          </MenuStepItem>

        </MenuStep>
      </div>
    </main>
  </div>
</template>

<script>
import { InputAddress, InputText } from '@/components/Input'
import { MenuStep, MenuStepItem } from '@/components/Menu'
import Wallet from '@/models/wallet'

export default {
  name: 'ContactNew',

  components: {
    InputAddress,
    InputText,
    MenuStep,
    MenuStepItem
  },

  schema: Wallet.schema,

  data: () => ({
    step: 1,
    backgroundImages: {
      true: {
        1: 'pages/wallet-new/background-step-1-dark.png',
        2: 'pages/wallet-new/background-step-5-dark.png'
      },
      false: {
        1: 'pages/wallet-new/background-step-1.png',
        2: 'pages/wallet-new/background-step-5.png'
      }
    }
  }),

  computed: {
    isDarkMode () {
      return this.$store.getters['session/hasDarkTheme']
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$synchronizer.focus()
    })
  },

  methods: {
    async create () {
      try {
        const { address } = await this.$store.dispatch('wallet/create', {
          ...this.schema,
          profileId: this.session_profile.id,
          isContact: true
        })
        this.$router.push({ name: 'wallet-show', params: { address } })
      } catch (error) {
        this.$error(`${this.$t('PAGES.CONTACT_NEW.FAILED')}: ${error.message}`)
      }
    },

    moveTo (step) {
      this.step = step
    }
  },

  validations: {
    step1: ['schema.address'],
    step2: ['schema.name'],
    schema: {
      address: {
        isValid (value) {
          if (this.$refs.addressInput) {
            return !this.$refs.addressInput.$v.$invalid
          }

          return false
        }
      }
    }
  }
}
</script>

<style>
.ContactNew .Collapse.MenuStepItem .Collapse__handler {
  width: 100%;
  text-align: left;
  vertical-align: middle;
  pointer-events: none;
}
.ContactNew .Collapse.MenuStepItem .Collapse__handler .ContactNew__refresh-button,
.ContactNew .Collapse.MenuStepItem .Collapse__handler .ButtonClipboard {
  pointer-events: visible;
}
</style>

<style lang="postcss" scoped>
/* To display the images scaled to the size of the button */
.ContactNew__instructions {
  background-size: cover;
  background-position: center center;
}
.ContactNew__contacts--selected {
  @apply .font-bold
}

.ContactNew__contacts-leave-active {
  transition: all 0.2s;
}
.ContactNew__contacts-enter-active {
  transition: all 1s;
}
.ContactNew__contacts-enter,
.ContactNew__contacts-leave-to {
  opacity: 0;
}
</style>
