<template>
  <div class="ContactNew relative">
    <main class="flex h-full">
      <div
        class="ContactNew__instructions theme-dark bg-theme-feature text-theme-page-instructions-text hidden lg:flex flex-1 mr-4 rounded-lg overflow-y-auto"
      >
        <div class="m-auto w-3/5 text-center flex flex-col items-center justify-center">
          <h1 class="text-inherit">
            {{ $t(`PAGES.CONTACT_NEW.INSTRUCTIONS.HEADER`) }}
          </h1>
          <p class="text-center py-2 leading-normal">
            {{ $t(`PAGES.CONTACT_NEW.INSTRUCTIONS.TEXT`) }}
          </p>

          <img
            :src="assets_loadImage(backgroundImage)"
            :title="$t(`PAGES.CONTACT_NEW.INSTRUCTIONS.HEADER`)"
            class="w-full xl:w-4/5 mt-10"
          >
        </div>
      </div>

      <div class="flex-none w-full lg:max-w-sm p-10 bg-theme-feature rounded-lg overflow-y-auto">
        <h3>{{ $t('PAGES.CONTACT_NEW.TITLE') }}</h3>

        <div class="w-full mt-10">
          <InputAddress
            ref="addressInput"
            v-model="schema.address"
            :is-invalid="$v.schema.address.$invalid"
            :helper-text="addressError"
            :pub-key-hash="session_network.version"
            class="my-3"
          />
        </div>

        <div class="w-full mt-6">
          <InputText
            v-model="schema.name"
            :label="$t('PAGES.CONTACT_NEW.NAME')"
            :is-invalid="$v.schema.name.$invalid"
            :helper-text="nameError"
            class="my-3"
            name="name"
          />

          <div class="mt-4 border-theme-button-text border-l-4 pl-2">
            <span class="text-theme-button-text font-bold">
              {{ $t('PAGES.CONTACT_NEW.NAME_INFO') }}
            </span>
            {{ $t('PAGES.CONTACT_NEW.NAME_DESCRIPTION') }}
          </div>
        </div>

        <div class="w-full mt-10">
          <button
            :disabled="$v.schema.address.$invalid || $v.schema.name.$invalid"
            class="blue-button"
            @click="create"
          >
            {{ $t('COMMON.DONE') }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { InputAddress, InputText } from '@/components/Input'
import Wallet from '@/models/wallet'

export default {
  name: 'ContactNew',

  components: {
    InputAddress,
    InputText
  },

  schema: Wallet.schema,

  computed: {
    backgroundImage () {
      return 'pages/contact-new/wallet.svg'
    },
    addressError () {
      if (this.$v.schema.address.$invalid) {
        if (!this.$v.schema.address.contactDoesNotExist) {
          return this.$t('VALIDATION.ADDRESS.EXISTS_AS_CONTACT', [this.schema.address])
        } else if (!this.$v.schema.address.walletDoesNotExist) {
          return this.$t('VALIDATION.ADDRESS.EXISTS_AS_WALLET', [this.schema.address])
        }
      }
      return null
    },
    nameError () {
      if (this.$v.schema.name.$invalid) {
        if (!this.$v.schema.name.contactDoesNotExist) {
          return this.$t('VALIDATION.NAME.EXISTS_AS_CONTACT', [this.schema.name])
        } else if (!this.$v.schema.name.walletDoesNotExist) {
          return this.$t('VALIDATION.NAME.EXISTS_AS_WALLET', [this.schema.name])
        } else if (!this.$v.schema.name.schemaMaxLength) {
          return this.$t('VALIDATION.NAME.MAX_LENGTH', [Wallet.schema.properties.name.maxLength])
        // NOTE: not used, unless the minimum length is changed
        } else if (!this.$v.schema.name.schemaMinLength) {
          return this.$tc('VALIDATION.NAME.MIN_LENGTH', Wallet.schema.properties.name.minLength)
        }
      }
      return null
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
        let wallet

        try {
          wallet = await this.$client.fetchWallet(this.schema.address)
        } catch (error) {
          wallet = {
            address: this.schema.address,
            balance: '0'
          }
        }

        const { address } = await this.$store.dispatch('wallet/create', {
          ...wallet,
          name: this.schema.name,
          profileId: this.session_profile.id,
          isContact: true
        })

        const name = this.schema.name.length
          ? this.wallet_name(address)
          : this.wallet_truncate(address)

        this.$success(this.$t('PAGES.CONTACT_NEW.SUCCESS', [name]))
        this.$router.push({ name: 'contacts' })
      } catch (error) {
        this.$error(`${this.$t('PAGES.CONTACT_NEW.FAILED')}: ${error.message}`)
      }
    },
    contactExists (byAttr, value) {
      const contact = this.$store.getters[`wallet/${byAttr}`](value)
      return contact && contact.isContact
    },
    walletExists (byAttr, value) {
      const wallet = this.$store.getters[`wallet/${byAttr}`](value)
      return wallet && !wallet.isContact
    }
  },

  validations: {
    schema: {
      address: {
        isValid () {
          if (this.$refs.addressInput) {
            return !this.$refs.addressInput.$v.$invalid
          }

          return false
        },
        contactDoesNotExist (value) {
          return value === '' || !this.contactExists('byAddress', value)
        },
        walletDoesNotExist (value) {
          return value === '' || !this.walletExists('byAddress', value)
        }
      },
      name: {
        contactDoesNotExist (value) {
          return value === '' || !this.contactExists('byName', value)
        },
        walletDoesNotExist (value) {
          return value === '' || !this.walletExists('byName', value)
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
