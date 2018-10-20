<template>
  <div class="WalletImport relative bg-theme-feature rounded-lg m-r-4">
    <main class="flex flex-row h-full">

      <div
        :style="`background-image: url('${assets_loadImage('pages/background-1920.png')}')`"
        class="WalletImport__instructions flex-grow background-image w-3/5"
      >
        <div class="mt-16 mx-16">
          <h3 class="mb-2">{{ $t(`PAGES.WALLET_IMPORT.STEP${step}.INSTRUCTIONS.HEADER`) }}</h3>

          <p>
            {{ $t(`PAGES.WALLET_IMPORT.STEP${step}.INSTRUCTIONS.TEXT`) }}
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
            :title="$t('PAGES.WALLET_IMPORT.STEP1.TITLE')"
            @next="moveTo(2)"
          >

            <div class="flex flex-col h-full w-full justify-around">

              <!-- TODO check duplicate here when db store is available -->
              <InputAddress
                v-show="!useOnlyPassphrase"
                ref="addressInput"
                v-model="schema.address"
                :pub-key-hash="session_network.version"
                class="my-3"
              />

              <InputSwitch
                :label="$t('PAGES.WALLET_IMPORT.STEP1.ONLY_PASSPHRASE')"
                :text="$t('PAGES.WALLET_IMPORT.STEP1.ONLY_PASSPHRASE')"
                :is-active="useOnlyPassphrase"
                class="my-3"
                @change="setOnlyPassphrase"
              />

              <InputSwitch
                :label="$t('PAGES.WALLET_IMPORT.STEP1.ONLY_ADDRESS')"
                :text="$t('PAGES.WALLET_IMPORT.STEP1.ONLY_ADDRESS')"
                :is-active="useOnlyAddress"
                class="my-3"
                @change="setOnlyAddress"
              />

              <PassphraseInput
                v-show="!useOnlyAddress"
                ref="passphrase"
                v-model="schema.passphrase"
                :address="useOnlyPassphrase ? null : schema.address"
                :pub-key-hash="session_network.version"
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

              <!-- TODO: Warning of storing passphrases even encrypted -->
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

            </div>

          </MenuStepItem>

          <MenuStepItem
            :step="3"
            :is-back-visible="true"
            :is-next-enabled="!$v.step3.$invalid"
            :title="$t('PAGES.WALLET_IMPORT.STEP3.TITLE')"
            @back="moveTo(1)"
            @next="importWallet"
          >

            <div class="flex flex-col h-full w-full justify-around">

              <!-- TODO check duplicate here when db store is available -->
              <InputText
                v-model="schema.name"
                :label="$t('PAGES.WALLET_IMPORT.STEP3.NAME')"
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

              <InputSwitch
                v-show="!useOnlyAddress"
                :label="$t('PAGES.WALLET_IMPORT.STEP3.OPERATIONS')"
                :text="$t('PAGES.WALLET_IMPORT.STEP3.SENDING_ENABLED')"
                :is-active="schema.isSendingEnabled"
                class="my-3"
                @change="setSendingEnabled"
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
    showEncryptLoader: false,
    bip38Worker: null
  }),

  watch: {
    /**
     * Generate always the address when moving to the step 2
     */
    step () {
      if (this.step === 2 && !this.useOnlyAddress) {
        this.schema.address = WalletService.getAddress(this.schema.passphrase, this.session_network.version)
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
      if (this.schema.name === '') {
        this.schema.name = this.schema.address
      }

      this.wallet = {
        ...this.schema,
        profileId: this.session_profile.id
      }

      if (this.walletPassword && this.walletPassword.length) {
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
      const { address } = await this.$store.dispatch('wallet/create', this.wallet)
      this.$router.push({ name: 'wallet-show', params: { address } })
    },

    moveTo (step) {
      this.step = step
    },

    setSendingEnabled (isSendingEnabled) {
      this.schema.isSendingEnabled = isSendingEnabled
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
    step2: ['walletPassword'],
    step3: [],
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
.WalletImport Collapse.MenuStepItem .Collapse__handler {
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
