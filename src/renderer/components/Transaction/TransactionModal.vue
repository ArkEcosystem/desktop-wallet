<template>
  <ModalWindow
    :title="title || typeName"
    :container-classes="`TransactionModal ${typeClass}`"
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
import { camelCase, includes, findKey, upperFirst } from 'lodash'
import { TRANSACTION_TYPES } from '@config'
import { ModalWindow } from '@/components/Modal'
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
    typeClass () {
      const type = findKey(TRANSACTION_TYPES, type => this.type === type)
      return `TransactionModal${upperFirst(camelCase(type))}`
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

      this.isSuccessfulResponse(response)
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

    /**
     * Checks if the response is successful: in case the transaction is rejected
     * due a low fee, it is broadcasted too, so it cannot be declared as invalid yet
     * @param {Object} response
     * @return {Boolean}
     */
    isSuccessfulResponse (response) {
      if (response.status !== 200) {
        this.$logger.error(response)
        return false
      }

      if (this.$client.version === 1) {
        return response.data.success
      } else {
        const { data, errors } = response.data
        if (data && data.invalid.length === 0) {
          return true
        } else {
          const keys = Object.keys(errors)
          return errors[keys[0]][0].type === 'ERR_LOW_FEE'
        }
      }
    }
  }
}
</script>

<style>
.TransactionModal {
  max-width: 45rem
}
.TransactionModalTransfer {
  /* To allow more space on the fee slider */
  min-width: 35rem;
}
</style>
