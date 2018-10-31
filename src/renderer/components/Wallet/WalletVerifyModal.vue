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
          @select="onChoiceSelect"
        />

        <div v-if="verifyChoice === 'Verify'">
          <InputText
            v-model="$v.form.message.$model"
            :label="$t('SIGN_VERIFY.MESSAGE')"
            class="mt-5"
            name="message"
          />

          <InputText
            v-model="$v.form.publicKey.$model"
            :label="$t('SIGN_VERIFY.PUBLIC_KEY')"
            :value="wallet.publicKey"
            class="mt-5"
            name="publicKey"
          />

          <InputText
            v-model="$v.form.signature.$model"
            :label="$t('SIGN_VERIFY.SIGNATURE')"
            class="mt-5"
            name="signature"
          />
        </div>
        <div v-else>
          <InputText
            v-model="$v.form.json.$model"
            :label="$t('SIGN_VERIFY.JSON_MESSAGE')"
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
        <div class="w-80">{{ $t('SIGN_VERIFY.FORMAT_FOOTER') }}</div>
      </div>
    </template>
  </ModalWindow>
</template>

<script>
import { InputText, InputToggle } from '@/components/Input'
import { ModalWindow } from '@/components/Modal'
import { WalletIdenticon, WalletVerifyDetail } from './'
import WalletService from '@/services/wallet'

export default {
  name: 'WalletVerifyModal',

  components: {
    WalletIdenticon,
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

  mounted () {
    this.form.publicKey = this.wallet.publicKey
  },

  methods: {
    verifyMessage () {
      // TODO: use try catch for the verify functions?
      let verified
      if (this.verifyChoice === 'Verify') {
        verified = WalletService.verifyMessage(this.form.message, this.form.publicKey, this.form.signature)
      } else {
        const json = JSON.parse(this.form.json)
        verified = WalletService.verifyMessage(json['message'], json['publicKey'], json['signature'])
      }

      if (verified) {
        this.isVerified = true
      } else {
        this.isNotVerified = true
      }
    },

    getAddress () {
      if (this.verifyChoice === 'Verify') {
        return WalletService.getAddressFromPublicKey(this.form.publicKey, this.session_network.version)
      }
      return WalletService.getAddressFromPublicKey(JSON.parse(this.form.json)['publicKey'], this.session_network.version)
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
        isValid (value) {
          if (this.verifyChoice === 'Verify') {
            return true
          }
          // Check for valid json
          try {
            const json = JSON.parse(value)
            return json['message'] && json['publicKey'] && json['signature']
          } catch (err) {
            return false
          }
        }
      }
    }
  }
}
</script>
