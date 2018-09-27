<template>
  <div>
    <CreateSingleTransfer
      v-if="!transferBuilt"
      key="CreateTransfer"
      v-bind="transfer"
      :transaction-type="transactionType"
      @transfer-updated="onTransferUpdated"
      @transfer-built="transferBuilt = true"
    />
    <ConfirmSingleTransfer
      v-else
      key="ConfirmTransfer"
      v-bind="transfer"
      @transfer-confirmed="onConfirm"
      @transfer-rejected="transferBuilt = false"
    />
  </div>
</template>

<script>
import CreateSingleTransfer from './CreateSingleTransfer'
import ConfirmSingleTransfer from './ConfirmSingleTransfer'
import InputText from '@/components/Input/InputText'
import InputFee from '@/components/Input/InputFee/InputFee'

export default {
  components: {
    InputText,
    InputFee,
    CreateSingleTransfer,
    ConfirmSingleTransfer
  },

  data () {
    return {
      transactionType: 0,
      transfer: {
        recipientId: '',
        amount: '',
        vendorField: '',
        passphrase: '',
        fee: 0
      },
      transferBuilt: false
    }
  },

  methods: {
    async onConfirm () {
      let transfer = await this.$client.sendTransfer({
        amount: this.transfer.amount,
        recipientId: this.transfer.recipientId,
        senderPublicKey: this.wallet_fromRoute.address,
        vendorField: this.transfer.vendorField,
        passphrase: this.transfer.passphrase,
        fee: this.transfer.fee
      })

      console.log(transfer)
    },

    onTransferUpdated (key, value) {
      this.transfer[key] = value
    }
  }
}
</script>
