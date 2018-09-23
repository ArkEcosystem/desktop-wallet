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
                v-model="schema.address"
                :pub-key-hash="network.version"
                class="my-3"
              />

              <InputSwitch
                :label="$t('PAGES.WALLET_IMPORT.STEP1.ONLY_PASSPHRASE')"
                :text="$t('PAGES.WALLET_IMPORT.STEP1.ONLY_PASSPHRASE')"
                :is-active="useOnlyPassphrase"
                class="my-3"
                @change="setOnlyPassphrase"
              />

              <PassphraseInput
                ref="passphrase"
                v-model="schema.passphrase"
                :address="useOnlyPassphrase ? null : schema.address"
                :pub-key-hash="network.version"
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
            @next="importWallet"
          >

            <div class="flex flex-col h-full w-full justify-around">

              <!-- TODO check duplicate here when db store is available -->
              <InputText
                v-model="schema.name"
                :label="$t('PAGES.WALLET_IMPORT.STEP2.NAME')"
                :is-invalid="$v.schema.name.$dirty && $v.schema.name.$invalid"
                class="my-3"
                name="name"
              />

              <!-- TODO check duplicate here when db store is available -->
              <InputText
                v-model="schema.address"
                :label="$t('PAGES.WALLET_IMPORT.STEP2.ADDRESS')"
                :is-read-only="true"
                class="my-3"
                name="address-placeholder"
              />

              <InputSwitch
                :label="$t('PAGES.WALLET_IMPORT.STEP2.OPERATIONS')"
                :text="$t('PAGES.WALLET_IMPORT.STEP2.SENDING_ENABLED')"
                :is-active="schema.isSendingEnabled"
                class="my-3"
                @change="setSendingEnabled"
              />
            </div>

          </MenuStepItem>

        </MenuStep>
      </div>
    </main>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { InputAddress, InputSwitch, InputText } from '@/components/Input'
import { MenuStep, MenuStepItem } from '@/components/Menu'
import { PassphraseInput } from '@/components/Passphrase'
import WalletService from '@/services/wallet'
import Wallet from '@/models/wallet'

export default {
  name: 'WalletImport',

  components: {
    InputAddress,
    InputSwitch,
    InputText,
    MenuStep,
    MenuStepItem,
    PassphraseInput
  },

  schema: Wallet.schema,

  data: () => ({
    ensureEntirePassphrase: false,
    step: 1,
    useOnlyPassphrase: false
  }),

  computed: {
    network () {
      return this.$store.getters['session/currentNetwork']
    },
    profileId () {
      return this.$store.getters['session/profileId']
    }
  },

  watch: {
    /**
     * Generate always the address when moving to the step 2
     */
    step () {
      if (this.step === 2) {
        this.schema.address = WalletService.getAddress(this.schema.passphrase, this.network.version)
      }
    }
  },

  methods: {
    async importWallet () {
      const { address } = await this.$store.dispatch('wallet/create', {
        ...this.schema,
        profileId: this.profileId
      })
      this.$router.push({ name: 'wallet-show', params: { address } })
    },

    moveTo (step) {
      this.step = step
    },

    setSendingEnabled (isSendingEnabled) {
      this.schema.isSendingEnabled = isSendingEnabled
    },

    setOnlyPassphrase (useOnlyPassphrase) {
      this.useOnlyPassphrase = useOnlyPassphrase
    }
  },

  validations: {
    step1: ['schema.address', 'schema.passphrase'],
    step2: ['schema.name'],
    schema: {
      address: {
        isRequired (value) {
          return this.useOnlyPassphrase || required(value)
        }
      },
      passphrase: {
        isValid (value) {
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
