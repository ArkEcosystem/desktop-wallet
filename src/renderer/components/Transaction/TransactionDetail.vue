<template>
  <div class="flex flex-row justify-between rounded-lg px-5 py-6 bg-theme-heading-background TransactionDetail">
    <div class="flex flex-row">
      <WalletIdenticon
        :value="senderAddress"
        :size="75"
      />
      <div class="flex flex-col justify-center ml-2">
        <span class="text-theme-feature-item-text">{{ $t('TRANSACTION_DETAIL.SEND_AMOUNT', { token: currency }) }}</span>
        <span class="text-white">{{ amount }}</span>
      </div>
    </div>
    <div
      class="w-48 flex justify-center items-center"
    >
      <span
        v-for="n in 5"
        :key="n"
        class="text-theme-transaction-detail-arrow"
      >
        <SvgIcon
          name="arrow-transaction"
          view-box="0 0 30 30"
        />
      </span>
    </div>
    <WalletIdenticon
      v-if="type === 0"
      :value="recipientAddress"
      :size="75"
    />
    <div
      v-else
      :class="[backgroundColor, textColor]"
      class="RecipientIcon flex justify-center items-center rounded-full"
    >
      <SvgIcon
        :name="iconName"
        view-box="0 0 22 22"
      />
    </div>
  </div>
</template>

<script>
import { WalletIdenticon } from '@/components/Wallet'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'TransactionDetail',

  components: {
    WalletIdenticon,
    SvgIcon
  },

  props: {
    senderAddress: {
      type: String,
      required: true
    },
    recipientAddress: {
      type: String,
      required: false,
      default: ''
    },
    amount: {
      type: String,
      required: true
    },
    type: {
      type: Number,
      required: false,
      default: 0
    }
  },

  computed: {
    currency () {
      return this.$store.getters['session/network'].token
    },
    iconName () {
      switch (this.type) {
        case 1:
          return '2nd-passphrase'
        case 2:
          return 'register-delegate'
        case 3:
          return 'vote'
        default:
          return 'wallet'
      }
    },
    backgroundColor () {
      switch (this.type) {
        case 1:
          return 'bg-theme-send-circle-second-signature'
        case 2:
          return 'bg-theme-send-circle-register-delegate'
        case 3:
          return 'bg-theme-send-circle-vote'
        default:
          return 'bg-theme-heading-background'
      }
    },
    textColor () {
      switch (this.type) {
        case 1:
          return 'text-theme-send-circle-second-signature-text'
        case 2:
          return 'text-theme-send-circle-register-delegate-text'
        case 3:
          return 'text-theme-send-circle-vote-text'
        default:
          return 'text-white'
      }
    }
  }
}
</script>

<style>
.TransactionDetail {
  background-image: -webkit-linear-gradient(30deg, var(--theme-transaction-detail-gradient1) 20%, var(--theme-transaction-detail-gradient2) 20%);
}

.RecipientIcon {
  width: 75px;
  height: 75px;
}
</style>
