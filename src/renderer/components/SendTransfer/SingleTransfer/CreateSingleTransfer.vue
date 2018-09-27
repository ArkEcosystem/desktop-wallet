<template>
  <div class="CreateTransfer">
    <h1>{{ $t('TRANSACTIONS.CREATE_TRANSFER') }}</h1>
    <InputText
      :value="recipientId"
      :label="$t('TRANSACTIONS.RECIPIENT_ID')"
      name="recipientAddress"
      @input="$emit('transfer-updated', 'recipientId', $event)"
    />
    <InputText
      :value="amount"
      :label="$t('TRANSACTIONS.AMOUNT')"
      name="amount"
      @input="$emit('transfer-updated', 'amount', $event)"

    />
    <InputText
      :value="vendorField"
      :label="$t('TRANSACTIONS.VENDOR_FIELD')"
      name="vendorField"
      @input="$emit('transfer-updated', 'vendorField', $event)"

    />
    <InputText
      :value="passphrase"
      :label="$t('TRANSACTIONS.VENDOR_FIELD')"
      name="passphrase"
      @input="$emit('transfer-updated', 'passphrase', $event)"

    />
    <InputFee
      :fee="fee"
      :transaction-type="transactionType"
      @input="$emit('transfer-updated', 'fee', $event)"
    />
    <button
      class="MenuStepItem__footer__next-button blue-button"
      @click="$emit('transfer-built')"
    >
      {{ $t('COMMON.CONFIRM') }} &rarr;
    </button>
  </div>
</template>

<script>
import InputText from '@/components/Input/InputText'
import InputFee from '@/components/Input/InputFee/InputFee'

export default {
  components: {
    InputText,
    InputFee
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
    },
    transactionType: {
      type: Number,
      required: true
    }
  }
}
</script>
