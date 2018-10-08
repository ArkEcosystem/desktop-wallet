<template>
  <span>Second Signature</span>
</template>

<script>
import { TRANSACTION_TYPES } from '@config'

export default {
  name: 'TransactionConfirmSecondSignature',

  transactionType: TRANSACTION_TYPES.SECOND_SIGNATURE,

  inject: ['transaction']
}
</script>
