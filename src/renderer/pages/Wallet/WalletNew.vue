<template>
  <div class="WalletNew relative">
    <main class="flex h-full">
      <div
        class="WalletNew__instructions theme-dark bg-theme-feature text-theme-page-instructions-text hidden lg:flex flex-1 mr-4 rounded-lg overflow-y-auto"
      >
        <div class="m-auto w-3/5 text-center flex flex-col items-center justify-center">
          <h1 class="text-inherit">
            {{ $t(`PAGES.WALLET_NEW.STEP${step}.INSTRUCTIONS.HEADER`) }}
          </h1>
          <p
            v-if="step === 1"
            class="text-center py-2 leading-normal"
          >
            {{ $t('PAGES.WALLET_NEW.STEP1.INSTRUCTIONS.TEXT_BEFORE_BUTTON') }}

            <ButtonReload
              :is-refreshing="isRefreshing"
              :without-background="true"
              class="WalletNew__refresh-button inline"
              text-class="text-theme-page-instructions-text"
              @click="refreshAddresses"
            />

            {{ $t('PAGES.WALLET_NEW.STEP1.INSTRUCTIONS.TEXT_AFTER_BUTTON') }}
          </p>
          <p
            v-else
            class="text-center py-2 leading-normal"
          >
            {{ $t(`PAGES.WALLET_NEW.STEP${step}.INSTRUCTIONS.TEXT`, { words: wordPositionLabel }) }}
          </p>

          <img
            :src="assets_loadImage(backgroundImages[step])"
            :title="$t(`PAGES.WALLET_NEW.STEP${step}.INSTRUCTIONS.HEADER`)"
            class="w-full xl:w-4/5 mt-10"
          >
        </div>
      </div>

      <div class="flex-none w-full lg:max-w-sm p-10 bg-theme-feature rounded-lg overflow-y-auto">
        <MenuStep
          :step="step"
        >
          <MenuStepItem
            :step="1"
            :is-next-enabled="!$v.step1.$invalid"
            :title="$t('PAGES.WALLET_NEW.STEP1.TITLE')"
            @next="moveTo(2)"
          >
            <div
              slot="header"
              slot-scope="{ title }"
              class="flex flex-row justify-between items-center"
            >
              <div class="">
                {{ title }}
              </div>

              <!-- Hide it when the step is collapse -->
              <ButtonReload
                v-if="step === 1"
                color-class="WalletNew__ButtonReload-colorClass"
                text-class="hover:text-white"
                :is-refreshing="isRefreshing"
                class="WalletNew__refresh-button"
                @click="refreshAddresses"
              />
            </div>

            <TransitionGroup
              class="WalletNew__wallets list-reset"
              name="WalletNew__wallets"
              tag="ul"
            >
              <li
                v-for="(passphrase, address) in wallets"
                :key="address"
                :class="schema.address === address ? 'WalletNew__wallets--selected' : 'WalletNew__wallets--unselected'"
                class="flex items-center py-4 w-full border-b border-dashed border-theme-line-separator truncate cursor-pointer"
                @click="selectWallet(address, passphrase)"
              >
                <WalletIdenticon
                  :value="address"
                  :size="35"
                  class="flex-no-shrink identicon"
                />
                <span class="WalletNew__wallets--address text-theme-wallet-new-unselected ml-2 flex-no-shrink font-semibold text-sm">
                  {{ address }}
                </span>
              </li>
            </TransitionGroup>
          </MenuStepItem>

          <MenuStepItem
            :step="2"
            :is-back-visible="true"
            :is-next-enabled="true"
            :title="$t('PAGES.WALLET_NEW.STEP2.TITLE')"
            @back="moveTo(1)"
            @next="moveTo(3)"
          >
            <div
              slot="header"
              slot-scope="{ title }"
              class="flex flex-row justify-between items-center"
            >
              <div class="">
                {{ title }}
              </div>

              <!-- Hide it when the step is collapse -->
              <ButtonClipboard
                v-if="step === 2"
                :value="schema.passphrase"
                class="text-theme-button-light-text py-2 px-4 rounded bg-theme-button-light"
              />
            </div>

            <PassphraseWords :passphrase-words="passphraseWords" />
          </MenuStepItem>

          <MenuStepItem
            :step="3"
            :is-back-visible="true"
            :is-next-enabled="!$v.step3.$invalid"
            :title="$t('PAGES.WALLET_NEW.STEP3.TITLE')"
            @back="moveTo(2)"
            @next="moveTo(4)"
          >
            <div class="flex flex-col h-full w-full justify-around">
              <InputSwitch
                v-model="ensureEntirePassphrase"
                :label="$t('PAGES.WALLET_NEW.STEP3.CHECK_ENTIRE_PASSPHRASE')"
                :text="$t('PAGES.WALLET_NEW.STEP3.VERIFY_ALL_WORDS')"
                class="my-3"
                @change="onSwitch"
              />

              <PassphraseVerification
                :additional-suggestions="additionalSuggestions"
                :passphrase="passphraseWords"
                :word-positions="wordPositions"
                @verified="onVerification"
              />
            </div>
          </MenuStepItem>

          <MenuStepItem
            :step="4"
            :is-back-visible="true"
            :is-next-enabled="!$v.step4.$invalid"
            :title="$t('PAGES.WALLET_NEW.STEP4.TITLE')"
            @back="moveTo(3)"
            @next="moveTo(5)"
          >
            <div class="flex flex-col h-full w-full justify-around">
              <InputPassword
                ref="password"
                v-model="walletPassword"
                :label="$t('PAGES.WALLET_NEW.STEP4.PASSWORD')"
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
                :label="$t('PAGES.WALLET_NEW.STEP4.PASSWORD_CONFIRM')"
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
            :step="5"
            :is-back-visible="true"
            :is-next-enabled="!$v.step5.$invalid"
            :title="$t('PAGES.WALLET_NEW.STEP5.TITLE')"
            @back="moveTo(4)"
            @next="create"
          >
            <div class="flex flex-col h-full w-full justify-around">
              <InputText
                v-model="schema.name"
                :label="$t('PAGES.WALLET_NEW.STEP5.NAME')"
                :bip39-warning="true"
                :is-invalid="$v.schema.name.$invalid"
                :helper-text="nameError"
                class="my-3"
                name="name"
              />

              <InputField
                v-if="schema.address"
                :label="$t('PAGES.WALLET_NEW.STEP5.ADDRESS')"
                :is-dirty="true"
                :is-read-only="true"
                class="InputText my-3"
              >
                <div
                  slot-scope="{ inputClass }"
                  :class="inputClass"
                  class="flex flex-row"
                >
                  <input
                    v-model="schema.address"
                    :disabled="true"
                    name="address"
                    type="text"
                    class="flex flex-grow bg-transparent text-theme-page-text cursor-text"
                  >
                  <ButtonClipboard
                    :value="schema.address"
                    class="text-theme-button-light-text flex flex-no-shrink text-grey-dark hover:text-blue"
                  />
                </div>
              </InputField>
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
import { flatten } from 'lodash'
import { required } from 'vuelidate/lib/validators'
import { ButtonClipboard, ButtonReload } from '@/components/Button'
import { InputField, InputPassword, InputSwitch, InputText } from '@/components/Input'
import { MenuStep, MenuStepItem } from '@/components/Menu'
import { ModalLoader } from '@/components/Modal'
import { PassphraseVerification, PassphraseWords } from '@/components/Passphrase'
import WalletIdenticon from '@/components/Wallet/WalletIdenticon'
import WalletService from '@/services/wallet'
import Wallet from '@/models/wallet'

export default {
  name: 'WalletNew',

  components: {
    ButtonClipboard,
    ButtonReload,
    InputField,
    InputPassword,
    InputSwitch,
    InputText,
    MenuStep,
    MenuStepItem,
    ModalLoader,
    PassphraseVerification,
    PassphraseWords,
    WalletIdenticon
  },

  schema: Wallet.schema,

  data: () => ({
    isRefreshing: false,
    isPassphraseVerified: false,
    ensureEntirePassphrase: false,
    step: 1,
    wallets: {},
    walletPassword: null,
    walletConfirmPassword: null,
    showEncryptLoader: false,
    bip38Worker: null,
    backgroundImages: {
      1: 'pages/wallet-new/choose-wallet.svg',
      2: 'pages/wallet-new/backup-wallet.svg',
      3: 'pages/wallet-new/verify-passphrase.svg',
      4: 'pages/wallet-new/encrypt-wallet.svg',
      5: 'pages/wallet-new/protect-wallet.svg'
    }
  }),

  computed: {
    /**
     * Mixes words from the passphrases of all the generated wallets
     * @return {Array}
     */
    additionalSuggestions () {
      const passphrases = Object.values(this.wallets)

      // Check for Japanese "space"
      return flatten(passphrases.map(passphrase =>
        /\u3000/.test(passphrase) ? passphrase.split('\u3000') : passphrase.split(' ')
      ))
    },
    passphraseWords () {
      const passphrase = this.schema.passphrase
      if (passphrase) {
        // Check for Japanese "space"
        if (/\u3000/.test(passphrase)) {
          return this.schema.passphrase.split('\u3000')
        }
        return this.schema.passphrase.split(' ')
      }
      return []
    },
    wordPositions () {
      return this.ensureEntirePassphrase ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : [3, 6, 9]
    },
    wordPositionLabel () {
      return this.ensureEntirePassphrase
        ? this.$t('PAGES.WALLET_NEW.STEP3.INSTRUCTIONS.ALL_WORDS')
        : this.$t('PAGES.WALLET_NEW.STEP3.INSTRUCTIONS.WORDS', { words: this.wordPositions.join(', ') })
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
      vm.$synchronizer.pause('market')
    })
  },

  created () {
    this.refreshAddresses()
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

  methods: {
    create () {
      this.wallet = {
        ...this.schema,
        profileId: this.session_profile.id
      }
      this.wallet.publicKey = WalletService.getPublicKeyFromPassphrase(this.wallet.passphrase)

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

    onSwitch () {
      this.isPassphraseVerified = false
    },

    onVerification () {
      this.isPassphraseVerified = true
    },

    selectWallet (address, passphrase) {
      this.schema.address = address
      this.schema.passphrase = passphrase
      this.isPassphraseVerified = false
    },

    refreshAddresses () {
      this.isRefreshing = true

      this.schema.address = null
      this.schema.passphrase = null
      this.isPassphraseVerified = false

      for (const [address] of Object.entries(this.wallets)) {
        this.$delete(this.wallets, address)
      }

      // Delay the generation to play an animation
      setTimeout(() => {
        for (let i = 0; i < 3; i++) {
          const { address, passphrase } = WalletService.generate(
            this.session_network.version,
            this.session_profile.bip39Language
          )
          this.$set(this.wallets, address, passphrase)
        }

        this.isRefreshing = false
      }, 300)
    }
  },

  validations: {
    step1: ['schema.address'],
    step3: ['isPassphraseVerified'],
    step4: ['walletPassword', 'walletConfirmPassword'],
    step5: ['schema.name'],
    schema: {
      name: {
        contactDoesNotExist (value) {
          const contact = this.$store.getters['wallet/byName'](value)
          return value === '' || !(contact && contact.isContact)
        },
        walletDoesNotExist (value) {
          const wallet = this.$store.getters['wallet/byName'](value)
          return value === '' || !(wallet && !wallet.isContact)
        }
      }
    },
    isPassphraseVerified: {
      required,
      isVerified: value => value
    },
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
    }
  }
}
</script>

<style>
.WalletNew .Collapse.MenuStepItem .Collapse__handler {
  width: 100%;
  text-align: left;
  vertical-align: middle;
  pointer-events: none;
}
.WalletNew .Collapse.MenuStepItem .Collapse__handler .WalletNew__refresh-button,
.WalletNew .Collapse.MenuStepItem .Collapse__handler .ButtonClipboard {
  pointer-events: visible;
}
</style>

<style lang="postcss" scoped>
/* To display the images scaled to the size of the button */
.WalletNew__instructions {
  background-size: cover;
  background-position: center center;
}

.WalletNew__wallets-enter-active {
  transition: opacity 1s
}
.WalletNew__wallets-leave-active {
  transition: opacity 0.2s
}

.WalletNew__wallets-enter,
.WalletNew__wallets-leave-to {
  opacity: 0
}

.WalletNew__wallets .identicon {
  font-size: 0;
  opacity: 0.5;
  transition: all 0.5s;
}
.WalletNew__wallets--unselected:hover .identicon {
  opacity: 1;
}
.WalletNew__wallets--unselected:hover .WalletNew__wallets--address {
  transition: all 0.5s;
  @apply .text-theme-wallet-new-selected .no-underline
}

.WalletNew__wallets--selected .identicon {
  opacity: 1;
}
.WalletNew__wallets--selected .WalletNew__wallets--address {
  @apply .text-theme-wallet-new-selected;
}
.WalletNew__wallets--address {
  transition: all 0.5s;
}

.WalletNew__ButtonReload-colorClass {
  @apply .text-grey-dark .bg-theme-button;
}

.WalletNew__ButtonReload-colorClass:hover {
  @apply .bg-blue .text-white;
  box-shadow: 0 5px 15px rgba(9, 100, 228, 0.34);
  transition: all .1s ease-in
}
</style>
