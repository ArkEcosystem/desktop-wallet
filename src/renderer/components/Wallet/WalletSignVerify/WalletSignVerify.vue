<template>
  <div class="mx-4 overflow-hidden">
    <div class="flex flex-row pb-5 border-b border-dashed border-theme-line-separator">
      <WalletIdenticon
        :value="currentWallet.address"
        :size="75"
      />

      <div class="flex flex-col justify-center ml-2">
        <span class="font-bold">{{ $t('SIGN_VERIFY.VERIFY_WALLET') }}</span>
        <span>{{ $t('SIGN_VERIFY.VERIFY_BY_SIGNING') }}</span>
      </div>

      <div class="flex items-center ml-4">
        <ButtonModal
          :label="$t('SIGN_VERIFY.SIGN')"
          class="blue-button mr-2 py-2 px-4"
        >
          <template slot-scope="{ toggle, isOpen }">
            <WalletSignModal
              v-if="isOpen"
              :wallet="currentWallet"
              @cancel="toggle"
              @signed="onSigned(toggle)"
            />
          </template>
        </ButtonModal>

        <ButtonModal
          :label="$t('SIGN_VERIFY.VERIFY')"
          class="blue-button py-2 px-4"
        >
          <template slot-scope="{ toggle, isOpen }">
            <WalletVerifyModal
              v-if="isOpen"
              :wallet="currentWallet"
              @cancel="toggle"
            />
          </template>
        </ButtonModal>
      </div>
    </div>

    <div
      v-for="message in signedMessages"
      :key="message.timestamp"
      class="WalletSignVerify__message flex flex-row justify-between py-5 border-b border-dashed border-theme-line-separator"
      @mouseover="showTimestamp = message.timestamp"
      @mouseout="showTimestamp = null"
    >
      <div class="flex flex-row">
        <div class="font-semibold text-theme-wallet-sign-verify-message-text mr-6 pl-2">
          <div>{{ $t('SIGN_VERIFY.MESSAGE') }}:</div>
          <div>{{ $t('SIGN_VERIFY.SIGNATURE') }}:</div>
        </div>
        <div>
          <div class="font-semibold">{{ truncate(message.message, 50) }}</div>
          <div>{{ truncate(message.signature, 50) }}</div>
        </div>
      </div>

      <div v-show="showTimestamp === message.timestamp">
        <ButtonClipboard
          :value="copyMessage(message)"
          class="text-theme-button-light-text py-2 px-4 rounded bg-theme-button-light mr-2"
        />
        <button
          v-tooltip="{ content: $t('SIGN_VERIFY.DELETE'), trigger:'hover' }"
          class="text-theme-button-light-text py-2 px-4 rounded bg-theme-button-light mr-2"
          @click="deleteMessage(message)"
        >
          <SvgIcon
            name="delete-wallet"
            view-box="0 0 13 13"
          />
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import { ButtonClipboard, ButtonModal } from '@/components/Button'
import { WalletIdenticon, WalletSignModal, WalletVerifyModal } from '../'
import SvgIcon from '@/components/SvgIcon'
import { clone } from 'lodash'

export default {
  name: 'WalletSignVerify',

  components: {
    ButtonClipboard,
    ButtonModal,
    WalletIdenticon,
    SvgIcon,
    WalletSignModal,
    WalletVerifyModal
  },

  props: {
  },

  data: () => ({
    signedMessages: [],
    showTimestamp: null
  }),

  computed: {
    currentWallet () {
      return this.wallet_fromRoute
    }
  },

  mounted () {
    this.updateSignedMessages()
  },

  methods: {
    truncate (value, length) {
      if (value.length > (length + 3)) {
        return `${value.slice(0, length)}...`
      }
      return value
    },
    copyMessage (value) {
      var message = clone(value, false)
      delete message['timestamp']
      delete message['address']
      return JSON.stringify(message)
    },
    deleteMessage (value) {
      var message = clone(value, false)
      this.$store.dispatch('wallet/deleteSignedMessage', message)
    },
    updateSignedMessages () {
      this.signedMessages = this.$store.getters['wallet/signedMessages'](this.currentWallet.address)
    },
    onSigned (toggle) {
      toggle()
      this.updateSignedMessages()
    }
  }
}
</script>

<style>
.WalletSignVerify__message:hover {
  @apply bg-theme-table-row-hover
}
</style>
