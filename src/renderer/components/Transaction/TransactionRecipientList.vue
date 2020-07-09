<template>
  <InputEditableList
    v-model="items"
    :title="title"
    :max-items="maxItems"
    :show-count="showCount"
    :readonly="readonly"
    :required="required"
    :helper-text="helperText"
    :is-invalid="isInvalid"
    :no-items-message="$t('TRANSACTION.NO_RECIPIENTS')"
    class="TransactionRecipientList"
    @remove="emitRemove"
  >
    <div
      slot-scope="{ item }"
      class="flex flex-1"
    >
      <WalletIdenticon
        :value="item.address || item.recipientId"
        :size="50"
        class="flex-inline"
      />

      <div class="flex-1 px-4">
        <div class="TransactionRecipientList__recipient flex py-1">
          <span class="font-bold mr-1">
            {{ $t('TRANSACTION.RECIPIENT') }}:
          </span>

          <WalletAddress
            v-if="showLinks"
            :address="item.address || item.recipientId"
            @click="emitClick"
          >
            {{ formatWalletAddress(item.address || item.recipientId) }}
          </WalletAddress>

          <span v-else>
            {{ formatWalletAddress(item.address || item.recipientId) }}
          </span>
        </div>

        <div class="TransactionRecipientList__amount flex py-1">
          <span class="font-bold mr-1">
            {{ $t('TRANSACTION.AMOUNT') }}:
          </span>

          <span
            v-if="item.sendAll"
            class="font-bold uppercase"
          >
            {{ $t('COMMON.ALL') }}
          </span>

          <span v-else>
            {{ formatter_networkCurrency(item.amount) }}
          </span>
        </div>
      </div>
    </div>
  </InputEditableList>
</template>

<script>
import truncate from '@/filters/truncate'
import { InputEditableList } from '@/components/Input'
import WalletAddress from '@/components/Wallet/WalletAddress'
import WalletIdenticon from '@/components/Wallet/WalletIdenticon'

export default {
  name: 'TransactionRecipientList',

  components: {
    InputEditableList,
    WalletAddress,
    WalletIdenticon
  },

  props: {
    title: {
      type: String,
      required: false,
      default: function () {
        return this.$t('TRANSACTION.RECIPIENTS_TITLE_MINIMUM')
      }
    },

    items: {
      type: Array,
      required: true
    },

    maxItems: {
      type: Number,
      required: false,
      default: null
    },

    showCount: {
      type: Boolean,
      required: false,
      default: false
    },

    showLinks: {
      type: Boolean,
      required: false,
      default: false
    },

    readonly: {
      type: Boolean,
      required: false,
      default: false
    },

    required: {
      type: Boolean,
      required: false,
      default: false
    },

    helperText: {
      type: String,
      required: false,
      default: null
    },

    isInvalid: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  methods: {
    formatWalletAddress (address) {
      const walletName = this.wallet_name(address)
      if (walletName && walletName !== address) {
        address = `${truncate(walletName, 25)} (${this.wallet_truncate(address)})`
      }

      return address
    },

    emitRemove (index) {
      this.$emit('remove', index)
    },

    emitClick () {
      this.$emit('click')
    }
  }
}
</script>
