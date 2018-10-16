<template>
  <ModalWindow
    :title="title || typeName"
    :message="footer || footerText"
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
    },
    footer: {
      type: String,
      required: false,
      default: null
    }
  },

  data: () => ({
    transaction: null
  }),

  computed: {
    transactionKey () {
      return findKey(TRANSACTION_TYPES, type => this.type === type)
    },
    typeName () {
      return this.$t(`TRANSACTION.TYPE.${this.transactionKey}`)
    },
    footerText () {
      const key = `TRANSACTION.FOOTER_TEXT.${this.transactionKey}`
      return this.$te(key) ? this.$t(key) : null
    }
  },

  methods: {
    onBuilt (transaction) {
      this.transaction = transaction
    },

    onBack () {
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

      if (this.$client.__version === 1) {
        return response.data.success
      } else {
        return response.data.data && response.data.data.invalid.length === 0
      }
    }
  }
}
</script>
