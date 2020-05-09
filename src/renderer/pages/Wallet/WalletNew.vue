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
                :is-refreshing="isRefreshing"
                color-class="WalletNew__ButtonReload-colorClass"
                text-class="hover:text-white"
                view-box="0 0 14 12"
                class="WalletNew__refresh-button WalletNew__refresh-button--address"
                @click="refreshAddresses"
              />
            </div>

            <TransitionGroup
              class="WalletNew__wallets list-reset"
              name="WalletNew__wallets--transition"
              tag="ul"
            >
              <template v-for="(passphrase, address) in wallets">
                <li
                  :key="address"
                  :class="[
                    isSelected(address) ? 'WalletNew__wallets__address--selected' : 'WalletNew__wallets__address--unselected',
                  ]"
                  class="WalletNew__wallets__address py-4 w-full truncate cursor-pointer"
                  @click="selectWallet(address, passphrase)"
                >
                  <div class="WalletNew__wallets__address__mask flex items-center">
                    <div class="relative">
                      <WalletIdenticon
                        :value="address"
                        :size="35"
                        class="flex-no-shrink identicon"
                      />
                      <span
                        v-if="isSelected(address)"
                        class="WalletNew_wallets__check absolute rounded-full flex items-center justify-center -mb-1 w-6 h-6 bg-green border-4 border-theme-feature text-white"
                      >
                        <SvgIcon
                          name="checkmark"
                          view-box="0 0 8 7"
                        />
                      </span>
                    </div>
                    <span class="WalletNew__wallets--address text-theme-page-text ml-2 flex-no-shrink font-semibold text-sm">
                      {{ address }}
                    </span>
                  </div>
                </li>

                <div
                  :key="`separator-${address}`"
                  class="WalletNew__wallets__address__separator"
                />
              </template>
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
            @next="onCreate"
          >
            <div class="flex flex-col h-full w-full justify-around">
              <div class="flex items-center justify-between mt-4">
                <div class="flex flex-col">
                  <div class="flex items-center">
                    <span class="text-base font-semibold mr-1">
                      {{ schema.address }}
                    </span>
                    <ButtonClipboard
                      v-if="schema.address"
                      :value="schema.address"
                      class="text-theme-page-text hover:text-blue"
                    />
                  </div>
                  <span class="text-sm text-theme-page-text-light font-semibold mt-1">
                    {{ $t('PAGES.WALLET_NEW.STEP5.ADDRESS') }}
                  </span>
                </div>
                <WalletIdenticon
                  v-if="schema.address"
                  :value="schema.address"
                  :size="35"
                  class="flex-no-shrink identicon"
                />
              </div>
              <InputText
                v-model="schema.name"
                :label="$t('PAGES.WALLET_NEW.STEP5.NAME')"
                :bip39-warning="true"
                :is-invalid="$v.schema.name.$invalid"
                :helper-text="nameError"
                class="my-3"
                name="name"
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
import { flatten } from '@/utils'
import { ButtonClipboard, ButtonReload } from '@/components/Button'
import { InputPassword, InputSwitch, InputText } from '@/components/Input'
import { MenuStep, MenuStepItem } from '@/components/Menu'
import { ModalLoader } from '@/components/Modal'
import { PassphraseVerification, PassphraseWords } from '@/components/Passphrase'
import { SvgIcon } from '@/components/SvgIcon'
import WalletIdenticon from '@/components/Wallet/WalletIdenticon'
import WalletService from '@/services/wallet'
import Wallet from '@/models/wallet'
import onCreate from './mixin-on-create'

export default {
  name: 'WalletNew',

  components: {
    ButtonClipboard,
    ButtonReload,
    InputPassword,
    InputSwitch,
    InputText,
    MenuStep,
    MenuStepItem,
    ModalLoader,
    PassphraseVerification,
    PassphraseWords,
    SvgIcon,
    WalletIdenticon
  },

  mixins: [onCreate],

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

  methods: {
    async createWallet () {
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
    },

    isSelected (address) {
      return this.schema.address === address
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
      isValid () {
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
      isValid () {
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

.WalletNew__wallets {
  /* To avoid shaking the area with the generated wallets */
  min-height: 203px
}
.WalletNew__wallets--transition-enter-active {
  transition: opacity 1s!important;
}
.WalletNew__wallets--transition-leave-active {
  transition: opacity 0.2s!important;
}

.WalletNew__wallets--transition-enter,
.WalletNew__wallets--transition-leave-to {
  opacity: 0
}
.WalletNew__refresh-button--address {
  padding: .6rem;
}
.WalletNew__wallets__address .identicon {
  font-size: 0;
}
.WalletNew__wallets__address__mask {
  @apply opacity-75;
  transition: opacity .2s ease;
}
.WalletNew__wallets__address {
  transition-property: transform, box-shadow, padding;
  transition-duration: .2s;
  transition-timing-function: ease-in-out;
}
.WalletNew__wallets__address:hover {
  @apply z-20 rounded-lg bg-theme-feature px-4;
  border-top-width: 0!important;
  transform: scale(1.05);
  box-shadow: var(--theme-wallet-grid-shadow);
}
.WalletNew__wallets__address:hover > .WalletNew__wallets__address__mask,
.WalletNew__wallets__address--selected > .WalletNew__wallets__address__mask {
  @apply opacity-100;
}

.WalletNew__wallets__address__separator {
  @apply block border-t border-dashed border-theme-line-separator
}
.WalletNew__wallets__address__separator:last-of-type {
  @apply hidden
}

.WalletNew__ButtonReload-colorClass {
  @apply .text-grey-dark .bg-theme-button;
}
.WalletNew__ButtonReload-colorClass:hover {
  @apply .bg-blue .text-white;
  box-shadow: 0 5px 15px rgba(9, 100, 228, 0.34);
  transition: all .1s ease-in
}

.WalletNew_wallets__check {
  left: 42%;
  top: 52%;
}
</style>
