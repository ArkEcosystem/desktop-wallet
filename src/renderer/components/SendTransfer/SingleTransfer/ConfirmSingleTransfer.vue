<template>
  <div class="ConfirmTransfer">
    <ListDivided>
      <ListDividedItem :label="$t('TRANSACTIONS.RECIPIENT_ID')">
        {{ recipientId }}
      </ListDividedItem>
      <ListDividedItem ::label="$t('TRANSACTIONS.AMOUNT')">
        {{ amount }}
      </ListDividedItem>
      <ListDividedItem :label="$t('TRANSACTIONS.VENDOR_FIELD')">
        {{ vendorField }}
      </ListDividedItem>
      <ListDividedItem label="">
        <button
          class="MenuStepItem__footer__next-button blue-button"
          @click="$emit('transfer-rejected')"
        >
          {{ $t('COMMON.BACK') }}
        </button>
        <button
          class="MenuStepItem__footer__next-button blue-button"
          @click="$emit('transfer-confirmed')"
        >
          {{ $t('COMMON.CONFIRM') }} 🚀
        </button>
      </ListDividedItem>
    </ListDivided>
  </div>
</template>

<script>
import { ListDivided, ListDividedItem } from '@/components/ListDivided'

export default {
  components: {
    ListDivided,
    ListDividedItem
  },

  props: {
    recipientId: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    vendorField: {
      type: String,
      required: true
    },
    passphrase: {
      type: String,
      required: true
    },
    fee: {
      type: Number,
      required: true
    }
  }
}
</script>
