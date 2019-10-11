<template>
  <InputEditableList
    v-model="items"
    :title="title"
    :readonly="readonly"
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

      <div class="flex-1 pl-4">
        <div class="py-1">
          <span class="font-bold">
            {{ $t('TRANSACTION.RECIPIENT') }}:
          </span>

          <span>
            {{ formatWalletAddress(item.address || item.recipientId) }}
          </span>
        </div>

        <div class="py-1">
          <span class="font-bold">
            {{ $t('TRANSACTION.AMOUNT') }}:
          </span>

          <span>
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
import WalletIdenticon from '@/components/Wallet/WalletIdenticon'

export default {
  name: 'TransactionMultiPaymentList',

  components: {
    InputEditableList,
    WalletIdenticon
  },

  props: {
    title: {
      type: String,
      required: false,
      default: 'Recipients'
    },

    items: {
      type: Array,
      required: true
    },

    readonly: {
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
    }
  }
}
</script>
