<template>
  <section class="TransactionConfirm">
    <component
      :is="activeComponent"
    />

    <footer class="mt-10">
      <button
        class="TransactionConfirm__back-button blue-button mr-2"
        @click="emitBack"
      >
        {{ $t('COMMON.BACK') }}
      </button>

      <button
        class="TransactionConfirm__send-button blue-button"
        @click="emitConfirm"
      >
        {{ $t('TRANSACTION.SEND') }}
      </button>
    </footer>
  </section>
</template>

<script>
import TransactionConfirmDelegateRegistration from './TransactionConfirmDelegateRegistration'
import TransactionConfirmSecondSignature from './TransactionConfirmSecondSignature'
import TransactionConfirmTransfer from './TransactionConfirmTransfer'
import TransactionConfirmVote from './TransactionConfirmVote'
import { find } from 'lodash'

export default {
  name: 'TransactionConfirm',

  provide () {
    return {
      transaction: this.transaction
    }
  },

  components: {
    TransactionConfirmDelegateRegistration,
    TransactionConfirmSecondSignature,
    TransactionConfirmTransfer,
    TransactionConfirmVote
  },

  props: {
    transaction: {
      type: Object,
      required: true,
      default: () => {}
    }
  },

  data: () => ({
    activeComponent: null
  }),

  mounted () {
    const component = find(this.$options.components, item => item.transactionType === this.transaction.type)

    if (!component) {
      throw new Error(`[TransactionConfirm] - Confirm for type ${this.type} not found.`)
    }

    this.activeComponent = component.name
  },

  methods: {
    emitBack () {
      this.$emit('back')
    },

    emitConfirm () {
      this.$emit('confirm')
    }
  }
}
</script>
