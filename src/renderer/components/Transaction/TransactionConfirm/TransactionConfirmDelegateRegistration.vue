<template>
  <span>Delegate Registration</span>
</template>

<script>
import { TRANSACTION_TYPES } from '@config'

export default {
  name: 'TransactionConfirmDelegateRegistration',

  transactionType: TRANSACTION_TYPES.DELEGATE_REGISTRATION,

  inject: ['transaction']
}
</script>
