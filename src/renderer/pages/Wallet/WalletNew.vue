<template>
  <div class="WalletNew relative bg-theme-feature rounded-lg m-r-4">
    <main class="flex flex-row h-full">

      <div
        :style="`background-image: url('${assets_loadImage('pages/background-1920.png')}')`"
        class="WalletNew__instructions flex-grow background-image w-3/5"
      >
        <div class="mt-16 mx-16">
          <h3 class="mb-2">{{ $t(`PAGES.WALLET_NEW.STEP${step}.INSTRUCTIONS.HEADER`) }}</h3>

          <p v-if="step === 1">
            {{ $t('PAGES.WALLET_NEW.STEP1.INSTRUCTIONS.TEXT_BEFORE_BUTTON') }}

            <span
              class="WalletNew__refresh-button cursor-pointer"
              @click="refreshAddresses"
            >
              <SvgIcon
                :class="{
                  'rotate-360': isRefreshing
                }"
                class="text-grey-dark mx-1"
                name="update"
                view-box="0 0 16 14"
              />
            </span>

            {{ $t('PAGES.WALLET_NEW.STEP1.INSTRUCTIONS.TEXT_AFTER_BUTTON') }}
          </p>
          <p v-else>
            {{ $t(`PAGES.WALLET_NEW.STEP${step}.INSTRUCTIONS.TEXT`, { words: wordPositionLabel }) }}
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
            :title="$t('PAGES.WALLET_NEW.STEP1.TITLE')"
            @next="moveTo(2)"
          >
            <div
              slot="header"
              slot-scope="{ title }"
              class="flex flex-row justify-between items-center"
            >
              <div class="">{{ title }}</div>

              <div
                v-if="step === 1"
                class="WalletNew__refresh-button cursor-pointer py-2 px-4 rounded bg-grey-lighter"
                @click="refreshAddresses"
              >
                <SvgIcon
                  :class="{
                    'rotate-360': isRefreshing
                  }"
                  class="text-grey-dark"
                  name="update"
                  view-box="0 0 16 14"
                />
              </div>
            </div>

            <transition-group
              class="list-reset flex flex-col justify-around"
              name="WalletNew__wallets"
              tag="ul"
            >
              <li
                v-for="(passphrase, address) in wallets"
                :key="address"
                class="py-4 w-full border-b border-dashed border-theme-line-separator"
              >
                <a
                  :class="{ 'WalletNew__wallets--selected': wallet.address === address }"
                  class="cursor-pointer text-theme-page-text"
                  @click="selectWallet(address, passphrase)"
                >

                  {{ address }}
                </a>
              </li>
            </transition-group>

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
              <div class="">{{ title }}</div>

              <div
                v-if="step === 2"
                class="py-2 px-4 rounded bg-grey-lighter"
              >
                <ButtonClipboard
                  :value="wallet.passphrase"
                  class="text-grey-dark"
                />
              </div>
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
                :label="$t('PAGES.WALLET_NEW.STEP3.CHECK_ENTIRE_PASSPHRASE')"
                :text="$t('PAGES.WALLET_NEW.STEP3.VERIFY_ALL_WORDS')"
                :is-active="wallet.ensureEntirePassphrase"
                class="my-3"
                @change="setEnsureEntirePassphrase"
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
            @next="create"
          >

            <div class="flex flex-col h-full w-full justify-around">

              <!-- TODO check duplicate here when db store is available -->
              <InputText
                v-model="wallet.name"
                :label="$t('PAGES.WALLET_NEW.STEP4.NAME')"
                :is-invalid="$v.wallet.name.$dirty && $v.wallet.name.$invalid"
                class="my-3"
                name="name"
              />

              <InputText
                v-model="wallet.address"
                :label="$t('PAGES.WALLET_NEW.STEP4.ADDRESS')"
                :is-read-only="true"
                class="my-3"
                name="address"
              />

              <InputSwitch
                :label="$t('PAGES.WALLET_NEW.STEP4.OPERATIONS')"
                :text="$t('PAGES.WALLET_NEW.STEP4.SENDING_ENABLED')"
                :is-active="wallet.isSendingEnabled"
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
import { flatten } from 'lodash'
import { required } from 'vuelidate/lib/validators'
import { ButtonClipboard } from '@/components/Button'
import { InputSwitch, InputText } from '@/components/Input'
import ListDivided from '@/components/ListDivided'
import { MenuStep, MenuStepItem } from '@/components/Menu'
import { PassphraseVerification, PassphraseWords } from '@/components/Passphrase'
import SvgIcon from '@/components/SvgIcon'
import WalletService from '@/services/wallet'

export default {
  name: 'WalletNew',

  components: {
    ButtonClipboard,
    InputSwitch,
    InputText,
    ListDivided,
    MenuStep,
    MenuStepItem,
    PassphraseVerification,
    PassphraseWords,
    SvgIcon
  },

  data: () => ({
    isRefreshing: false,
    isPasspharaseVerified: false,
    ensureEntirePassphrase: false,
    step: 1,
    wallets: {},
    wallet: {
      address: null,
      passphrase: null,
      name: '',
      isSendingEnabled: true
    }
  }),

  computed: {
    // TODO pending until having the new model/db system
    network () {
      return {
        pubKeyHash: 23
      }
    },
    /**
     * Mixes words from the passphrases of all the generated wallets
     * @return {Array}
     */
    additionalSuggestions () {
      const passphrases = Object.values(this.wallets)

      return flatten(passphrases.map(passphrase => passphrase.split(' ')))
    },
    passphraseWords () {
      const passphrase = this.wallet.passphrase
      if (passphrase) {
        return this.wallet.passphrase.split(' ')
      }
      return []
    },
    wordPositions () {
      return this.ensureEntirePassphrase ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : [3, 6, 9]
    },
    wordPositionLabel () {
      return this.ensureEntirePassphrase
        ? this.$i18n.t('PAGES.WALLET_NEW.STEP3.INSTRUCTIONS.ALL_WORDS')
        : this.$i18n.t('PAGES.WALLET_NEW.STEP3.INSTRUCTIONS.WORDS', { words: this.wordPositions.join(', ') })
    }
  },

  created () {
    this.refreshAddresses()
  },

  methods: {
    async create () {
      // TODO pending until having the new model/db system
      // this.$router.push({ name: 'wallet' })
    },

    moveTo (step) {
      this.step = step
    },

    onVerification () {
      this.isPasspharaseVerified = true
    },

    selectWallet (address, passphrase) {
      this.wallet.address = address
      this.wallet.passphrase = passphrase
    },

    setEnsureEntirePassphrase (ensureEntirePassphrase) {
      this.ensureEntirePassphrase = ensureEntirePassphrase
    },

    setSendingEnabled (isSendingEnabled) {
      this.wallet.isSendingEnabled = isSendingEnabled
    },

    refreshAddresses () {
      this.isRefreshing = true

      this.wallet.address = null
      this.wallet.passphrase = null
      this.isPasspharaseVerified = false

      for (const [address] of Object.entries(this.wallets)) {
        this.$delete(this.wallets, address)
      }

      // Delay the generation to play an animation
      setTimeout(() => {
        for (let i = 0; i < 4; i++) {
          const { address, passphrase } = WalletService.generate(this.network.pubKeyHash)
          this.$set(this.wallets, address, passphrase)
        }

        this.isRefreshing = false
      }, 200)
    }
  },

  validations: {
    step1: ['wallet.address'],
    step3: ['isPasspharaseVerified'],
    step4: ['wallet.name'],
    isPasspharaseVerified: {
      required,
      isVerified: value => value
    },
    // TODO some restrictions may depend on model schema / constraints
    wallet: {
      address: {
        required
      },
      name: {
        required
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

<style scoped>
/* To display the images scaled to the size of the button */
.WalletNew__instructions {
  background-size: cover;
  background-position: center center;
}
.WalletNew__wallets--selected {
  @apply .font-bold
}

.WalletNew__wallets-leave-active {
  transition: all 0.2s;
}
.WalletNew__wallets-enter-active {
  transition: all 1s;
}
.WalletNew__wallets-enter,
.WalletNew__wallets-leave-to {
  opacity: 0;
}
</style>
