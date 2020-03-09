<template>
  <ModalWindow
    :title="$t('SIGN_VERIFY.TITLE_VERIFY')"
    @close="emitCancel"
  >
    <div
      v-if="!isVerified && !isNotVerified"
      class="w-80"
    >
      <div class="flex flex-col justify-center">
        <InputToggle
          v-model="verifyChoice"
          :choices="verifyChoices"
          :selected-choice="verifyChoice"
          @select="onChoiceSelect"
        />

        <div v-if="verifyChoice === 'Verify'">
          <InputText
            ref="message"
            v-model="$v.form.message.$model"
            :label="$t('SIGN_VERIFY.MESSAGE')"
            :helper-text="messageError"
            :is-invalid="$v.form.message.$error"
            class="mt-5"
            name="message"
          />

          <InputText
            v-model="$v.form.publicKey.$model"
            :label="$t('SIGN_VERIFY.PUBLIC_KEY')"
            :value="wallet.publicKey"
            :helper-text="publicKeyError"
            :is-invalid="$v.form.publicKey.$error"
            class="mt-5"
            name="publicKey"
          />

          <InputText
            ref="signature"
            v-model="$v.form.signature.$model"
            :label="$t('SIGN_VERIFY.SIGNATURE')"
            :helper-text="signatureError"
            :is-invalid="$v.form.signature.$error"
            class="mt-5"
            name="signature"
          />
        </div>
        <div v-else>
          <InputText
            ref="json"
            v-model="$v.form.json.$model"
            :label="$t('SIGN_VERIFY.JSON_MESSAGE')"
            :helper-text="jsonError"
            :is-invalid="$v.form.json.$error"
            class="mt-5"
            name="json"
          />
        </div>

        <button
          :disabled="$v.form.$invalid"
          class="blue-button mt-5"
          type="button"
          @click="verifyMessage"
        >
          {{ $t('SIGN_VERIFY.VERIFY') }}
        </button>
      </div>
    </div>
    <div
      v-else-if="isVerified"
    >
      <WalletVerifyDetail
        :address="getAddress()"
        :is-verified="true"
      />
    </div>
    <div
      v-else
      class="flex"
    >
      <WalletVerifyDetail
        :address="getAddress()"
        :is-verified="false"
      />
    </div>
    <template
      v-if="!isVerified && !isNotVerified && verifyChoice !== 'Verify'"
      slot="footer"
    >
      <div class="ModalWindow__container__footer--warning">
        <div class="w-80">
          {{ $t('SIGN_VERIFY.FORMAT_FOOTER') }}
        </div>
      </div>
    </template>
  </ModalWindow>
</template>

<script>
import { InputText, InputToggle } from '@/components/Input'
import { ModalWindow } from '@/components/Modal'
import { WalletVerifyDetail } from './'
import WalletService from '@/services/wallet'

export default {
  name: 'WalletVerifyModal',

  components: {
    InputText,
    InputToggle,
    ModalWindow,
    WalletVerifyDetail
  },

  props: {
    wallet: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    form: {
      message: '',
      publicKey: '',
      signature: '',
      json: ''
    },
    verifyChoices: [
      'Verify',
      'Verify text'
    ],
    verifyChoice: 'Verify',
    isVerified: false,
    isNotVerified: false
  }),

  computed: {
    messageError () {
      if (this.$v.form.message.$error && !this.$v.form.message.isValid) {
        return this.$t('VALIDATION.REQUIRED', [this.$refs.message.label])
      }
      return null
    },

    publicKeyError () {
      if (this.$v.form.publicKey.$error && !this.$v.form.publicKey.isValid) {
        return this.$t('VALIDATION.PUBLIC_KEY.INVALID_LENGTH')
      }
      return null
    },

    signatureError () {
      if (this.$v.form.signature.$error && !this.$v.form.signature.isValid) {
        return this.$t('VALIDATION.REQUIRED', [this.$refs.signature.label])
      }
      return null
    },

    jsonError () {
      if (this.$v.form.json.$error) {
        if (!this.$v.form.json.isNotEmpty) {
          return this.$t('VALIDATION.REQUIRED', [this.$refs.json.label])
        } else if (!this.$v.form.json.isValid) {
          return this.$t('VALIDATION.INVALID_FORMAT')
        }
      }
      return null
    }
  },

  mounted () {
    this.form.publicKey = this.wallet.publicKey
  },

  methods: {
    verifyMessage () {
      try {
        let verified
        if (this.verifyChoice === 'Verify') {
          verified = WalletService.verifyMessage(this.form.message, this.form.publicKey, this.form.signature)
        } else {
          const json = JSON.parse(this.form.json)
          verified = WalletService.verifyMessage(json.message, json.publicKey, json.signature)
        }

        if (verified) {
          this.isVerified = true
        } else {
          this.isNotVerified = true
        }
      } catch (error) {
        this.$error(this.$t('SIGN_VERIFY.FAILED_VERIFY'))
      }
    },

    getAddress () {
      if (this.verifyChoice === 'Verify') {
        return WalletService.getAddressFromPublicKey(this.form.publicKey, this.session_network.version)
      }
      return WalletService.getAddressFromPublicKey(JSON.parse(this.form.json).publicKey, this.session_network.version)
    },

    onChoiceSelect (choice) {
      this.verifyChoice = choice
    },

    emitCancel () {
      this.$emit('cancel')
    },

    emitNotVerified () {
      this.$emit('notVerified')
    },

    emitVerified () {
      this.$emit('verified')
    }
  },

  validations: {
    form: {
      message: {
        isValid (value) {
          if (this.verifyChoice !== 'Verify') {
            return true
          }
          return value.length >= 1
        }
      },
      publicKey: {
        isValid (value) {
          if (this.verifyChoice !== 'Verify') {
            return true
          }
          return value.length === 66 // Public key length
        }
      },
      signature: {
        isValid (value) {
          if (this.verifyChoice !== 'Verify') {
            return true
          }
          return value.length >= 1
        }
      },
      json: {
        isNotEmpty (value) {
          if (this.verifyChoice === 'Verify') {
            return true
          }
          return value.length !== 0
        },
        isValid (value) {
          if (this.verifyChoice === 'Verify') {
            return true
          }

          // Check for valid json
          try {
            const json = JSON.parse(value)
            return !!(json.message && (json.publicKey || json.publickey) && json.signature)
          } catch (err) {
            return false
          }
        }
      }
    }
  }
}
</script>
