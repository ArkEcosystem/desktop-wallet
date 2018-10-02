<template>
  <ModalWindow
    :title="title"
    @close="emitCancel"
  >
    <keep-alive>
      <TransactionForm
        v-if="!transaction"
        :type="type"
        @built="onBuilt"
      />
    </keep-alive>

    <TransactionConfirm
      v-if="transaction"
      :transaction="transaction"
      @back="onBack"
      @confirm="onConfirm"
    />
  </ModalWindow>
</template>

<script>
import { ModalWindow } from '@/components/Modal'
import { TRANSACTION_TYPES } from '@config'
import { includes, findKey } from 'lodash'
import TransactionForm from './TransactionForm'
import TransactionConfirm from './TransactionConfirm'

export default {
  name: 'TransactionModal',

  components: {
    ModalWindow,
    TransactionForm,
    TransactionConfirm
  },

  props: {
    type: {
      type: Number,
      required: true,
      validator: value => includes(TRANSACTION_TYPES, value)
    }
  },

  data: () => ({
    transaction: null
  }),

  computed: {
    title () {
      const key = this.transactionKeyByType(this.type)
      return this.$t(`TRANSACTION.TYPE.${key}`)
    }
  },

  methods: {
    transactionKeyByType (value) {
      return findKey(TRANSACTION_TYPES, type => value === type)
    },

    onBuilt (transaction) {
      this.transaction = transaction
    },

    onBack () {
      this.transaction = null
    },

    onConfirm () {
      this.$client.broadcastTransaction(this.transaction)
    },

    emitCancel () {
      this.$emit('cancel')
    }
  }
}
</script>
