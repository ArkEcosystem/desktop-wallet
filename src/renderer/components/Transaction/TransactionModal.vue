<template>
  <ModalWindow
    :title="title || typeName"
    @close="emitCancel"
  >
    <keep-alive>
      <TransactionForm
        v-if="!transaction"
        v-bind="$attrs"
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
    },
    title: {
      type: String,
      required: false,
      default: null
    }
  },

  data: () => ({
    transaction: null
  }),

  computed: {
    typeName () {
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

    async onConfirm () {
      const response = await this.$client.broadcastTransaction(this.transaction)
      this.emitSent(response)
    },

    emitSent (response) {
      this.$emit('sent', response)
    },

    emitCancel () {
      this.$emit('cancel')
    }
  }
}
</script>
