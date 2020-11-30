<template>
  <div>Resignation</div>
</template>

<script>
import { TRANSACTION_TYPES_ENTITY } from '@config'

export default {
  name: 'TransactionFormEntityUpdate',

  entityAction: TRANSACTION_TYPES_ENTITY.ACTION.UPDATE
}
</script>
