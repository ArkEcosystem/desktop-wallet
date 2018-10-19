<template>
  <ModalWindow
    :title="title || typeName"
    container-classes="TransactionModal"
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

    <portal-target
      v-if="step === 0"
      slot="footer"
      name="transaction-footer"
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
    step: 0,
    transaction: null
  }),

  computed: {
    transactionKey () {
      return findKey(TRANSACTION_TYPES, type => this.type === type)
    },
    typeName () {
      return this.$t(`TRANSACTION.TYPE.${this.transactionKey}`)
    }
  },

  methods: {
    onBuilt (transaction) {
      this.step = 1
      this.transaction = transaction
    },

    onBack () {
      this.step = 0
      this.transaction = null
    },

    async onConfirm () {
      const response = await this.$client.broadcastTransaction(this.transaction)

      this.successfulResponse(response)
        ? this.$success(this.$t(`TRANSACTION.SUCCESS.${this.transactionKey}`))
        : this.$error(this.$t(`TRANSACTION.ERROR.${this.transactionKey}`))

      this.emitSent(response)
    },

    emitSent (response) {
      this.$emit('sent', response)
    },

    emitCancel () {
      this.$emit('cancel')
    },

    successfulResponse (response) {
      if (response.status !== 200) {
        this.$logger.error(response)
        return false
      }

      if (this.$client.version === 1) {
        return response.data.success
      } else {
        return response.data.data && response.data.data.invalid.length === 0
      }
    }
  }
}
</script>

<style>
.TransactionModal {
  max-width: 45rem
}
</style>
