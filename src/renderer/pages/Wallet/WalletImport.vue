<template>
  <div class="WalletImport relative bg-theme-feature rounded-lg m-r-4">
    <main class="flex flex-col sm:flex-row h-full">
      <div
        :style="`background-image: url('${assets_loadImage(backgroundImages[session_hasDarkTheme][step])}')`"
        class="WalletImport__instructions sm:flex-grow background-image sm:w-1/2 lg:w-3/5"
      >
        <div class="instructions-text my-8 sm:mt-16 sm:mb-0 mx-8 sm:mx-16 w-auto md:w-1/2">
          <h3 class="mb-2 text-theme-page-instructions-text">
            {{ $t(`PAGES.WALLET_IMPORT.STEP${step}.INSTRUCTIONS.HEADER`) }}
          </h3>

          <p>
            {{ $t(`PAGES.WALLET_IMPORT.STEP${step}.INSTRUCTIONS.TEXT`) }}
          </p>
        </div>
      </div>

      <div class="flex-no-grow p-10 sm:w-1/2 lg:w-2/5">
        <MenuStep
          :step="step"
        >
          <MenuStepItem
            :step="1"
            :is-next-enabled="!$v.step1.$invalid"
            :title="$t('PAGES.WALLET_IMPORT.STEP1.TITLE')"
            @next="!useOnlyAddress ? moveTo(2) : moveTo(3)"
          >
            <div class="flex flex-col h-full w-full justify-around">
              <InputSwitch
                :label="$t('PAGES.WALLET_IMPORT.STEP1.ONLY_ADDRESS')"
                :text="$t('PAGES.WALLET_IMPORT.STEP1.ONLY_ADDRESS')"
                :is-active="useOnlyAddress"
                class="my-3"
                @change="setOnlyAddress"
              />

              <InputSwitch
                :label="$t('PAGES.WALLET_IMPORT.STEP1.ONLY_PASSPHRASE')"
                :text="$t('PAGES.WALLET_IMPORT.STEP1.ONLY_PASSPHRASE')"
                :is-active="useOnlyPassphrase"
                class="my-3"
                @change="setOnlyPassphrase"
              />

              <!-- TODO check duplicate here when db store is available -->
              <InputAddress
                v-show="!useOnlyPassphrase"
                ref="addressInput"
                v-model="schema.address"
                :pub-key-hash="session_network.version"
                class="my-3"
              />

              <PassphraseInput
                v-show="!useOnlyAddress"
                ref="passphrase"
                v-model="schema.passphrase"
                :address="useOnlyPassphrase ? null : schema.address"
                :pub-key-hash="session_network.version"
                :not-bip39-warning="true"
                class="my-3"
              />
            </div>
          </MenuStepItem>

          <MenuStepItem
            :step="2"
            :is-back-visible="true"
            :is-next-enabled="!$v.step2.$invalid"
            :title="$t('PAGES.WALLET_IMPORT.STEP2.TITLE')"
            @back="moveTo(1)"
            @next="moveTo(3)"
          >
            <div class="flex flex-col h-full w-full justify-around">
              <InputPassword
                ref="password"
                v-model="walletPassword"
                :label="$t('PAGES.WALLET_IMPORT.STEP2.PASSWORD')"
                :is-required="false"
                :min-length="8"
                :is-create="true"
                class="my-3"
                name="wallet-password"
              />

              <InputPassword
                v-show="walletPassword && !!walletPassword.length"
                ref="confirmPassword"
                v-model="walletConfirmPassword"
                :label="$t('PAGES.WALLET_IMPORT.STEP2.PASSWORD_CONFIRM')"
                :is-required="walletPassword && !!walletPassword.length"
                :min-length="0"
                :give-feedback="false"
                :confirm="walletPassword"
                class="my-3"
                name="wallet-confirm-password"
              />

              <span class="text-orange-dark">
                <span class="font-bold">
                  {{ $t('COMMON.WARNING') }}:
                </span>
                <span>{{ $t('PAGES.WALLET_IMPORT.STEP2.PASSWORD_WARNING') }}</span>
              </span>
            </div>
          </MenuStepItem>

          <MenuStepItem
            :step="3"
            :is-back-visible="true"
            :is-next-enabled="!$v.step3.$invalid"
            :title="$t('PAGES.WALLET_IMPORT.STEP3.TITLE')"
            @back="!useOnlyAddress ? moveTo(2) : moveTo(1)"
            @next="importWallet"
          >
            <div class="flex flex-col h-full w-full justify-around">
              <InputText
                v-model="schema.name"
                :label="$t('PAGES.WALLET_IMPORT.STEP3.NAME')"
                :bip39-warning="true"
                :is-invalid="$v.schema.name.$invalid"
                :helper-text="nameError"
                class="my-3"
                name="name"
              />

              <!-- TODO check duplicate here when db store is available -->
              <InputText
                v-model="schema.address"
                :label="$t('PAGES.WALLET_IMPORT.STEP3.ADDRESS')"
                :is-read-only="true"
                class="my-3"
                name="address-placeholder"
              />
            </div>
          </MenuStepItem>
        </MenuStep>
      </div>

      <ModalLoader
        :message="$t('ENCRYPTION.ENCRYPTING')"
        :visible="showEncryptLoader"
      />
    </main>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { InputAddress, InputPassword, InputSwitch, InputText } from '@/components/Input'
import { MenuStep, MenuStepItem } from '@/components/Menu'
import { ModalLoader } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import WalletService from '@/services/wallet'
import Wallet from '@/models/wallet'

export default {
  name: 'WalletImport',

  components: {
    InputAddress,
    InputPassword,
    InputSwitch,
    InputText,
    MenuStep,
    MenuStepItem,
    ModalLoader,
    PassphraseInput
  },

  schema: Wallet.schema,

  data: () => ({
    ensureEntirePassphrase: false,
    step: 1,
    useOnlyAddress: false,
    useOnlyPassphrase: false,
    wallet: {},
    walletPassword: null,
    walletConfirmPassword: null,
    showEncryptLoader: false,
    bip38Worker: null,
    backgroundImages: {
      true: {
        1: 'pages/wallet-new/background-step-1-dark.png',
        2: 'pages/wallet-new/background-step-2-dark.png',
        3: 'pages/wallet-new/background-step-5-dark.png'
      },
      false: {
        1: 'pages/wallet-new/background-step-1.png',
        2: 'pages/wallet-new/background-step-2.png',
        3: 'pages/wallet-new/background-step-5.png'
      }
    }
  }),

  computed: {
    nameError () {
      if (this.$v.schema.name.$invalid) {
        if (!this.$v.schema.name.doesNotExists) {
          return this.$t('VALIDATION.NAME.DUPLICATED', [this.schema.name])
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

  watch: {
    /**
     * Generate always the address when moving to the step 2
     */
    step () {
      if (this.step === 2 && !this.useOnlyAddress) {
        // Important: .normalize('NFD') is needed to properly work with Korean bip39 words
        // It alters the passphrase string, so no need to normalize again in the importWallet function
        this.schema.address = WalletService.getAddress(this.schema.passphrase.normalize('NFD'), this.session_network.version)
      }
    }
  },

  beforeDestroy () {
    this.bip38Worker.send('quit')
  },

  mounted () {
    if (this.bip38Worker) {
      this.bip38Worker.send('quit')
    }
    this.bip38Worker = this.$bgWorker.bip38()
    this.bip38Worker.on('message', message => {
      if (message.bip38key) {
        this.showEncryptLoader = false
        this.wallet.passphrase = message.bip38key
        this.finishCreate()
      }
    })
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$synchronizer.focus()
      vm.$synchronizer.pause('market')
    })
  },

  methods: {
    async importWallet () {
      this.wallet = {
        ...this.schema,
        profileId: this.session_profile.id
      }
      if (!this.useOnlyAddress) {
        this.wallet.publicKey = WalletService.getPublicKeyFromPassphrase(this.wallet.passphrase)
      }

      if (!this.useOnlyAddress && this.walletPassword && this.walletPassword.length) {
        this.showEncryptLoader = true
        this.bip38Worker.send({
          passphrase: this.wallet.passphrase,
          password: this.walletPassword,
          wif: this.session_network.wif
        })
      } else {
        this.wallet.passphrase = null

        this.finishCreate()
      }
    },

    async finishCreate () {
      try {
        const { address } = await this.$store.dispatch('wallet/create', this.wallet)
        this.$router.push({ name: 'wallet-show', params: { address } })
      } catch (error) {
        this.$error(`${this.$t('PAGES.WALLET_IMPORT.FAILED')}: ${error.message}`)
      }
    },

    moveTo (step) {
      this.step = step
    },

    setOnlyAddress (useOnlyAddress) {
      this.useOnlyPassphrase = false
      this.useOnlyAddress = useOnlyAddress
    },

    setOnlyPassphrase (useOnlyPassphrase) {
      this.useOnlyAddress = false
      this.useOnlyPassphrase = useOnlyPassphrase
    }
  },

  validations: {
    step1: ['schema.address', 'schema.passphrase'],
    step2: ['walletPassword', 'walletConfirmPassword'],
    step3: ['schema.name'],
    walletPassword: {
      isValid (value) {
        if (!this.walletPassword || !this.walletPassword.length) {
          return true
        }

        if (this.$refs.password) {
          return !this.$refs.password.$v.$invalid
        }

        return false
      }
    },
    walletConfirmPassword: {
      isValid (value) {
        if (!this.walletPassword || !this.walletPassword.length) {
          return true
        }

        if (this.$refs.confirmPassword) {
          return !this.$refs.confirmPassword.$v.$invalid
        }

        return false
      }
    },
    schema: {
      address: {
        isRequired (value) {
          return this.useOnlyPassphrase || required(value)
        },
        isValid (value) {
          if (this.useOnlyPassphrase) {
            return true
          }

          if (this.$refs.addressInput) {
            return !this.$refs.addressInput.$v.$invalid
          }

          return false
        }
      },
      name: {
        doesNotExists (value) {
          return value === '' || !this.$store.getters['wallet/byName'](value)
        }
      },
      passphrase: {
        isRequired (value) {
          return this.useOnlyAddress || required(value)
        },
        isValid (value) {
          if (this.useOnlyAddress) {
            return true
          }

          if (this.$refs.passphrase) {
            return !this.$refs.passphrase.$v.$invalid
          }

          return false
        }
      }
    }
  }
}
</script>

<style>
.WalletImport .Collapse.MenuStepItem .Collapse__handler {
  width: 100%;
  text-align: left;
  vertical-align: middle;
  pointer-events: none;
}
</style>

<style lang="postcss" scoped>
/* To display the images scaled to the size of the button */
.WalletImport__instructions {
  background-size: cover;
  background-position: center center;
}
.WalletImport__wallets--selected {
  @apply .font-bold
}
</style>
