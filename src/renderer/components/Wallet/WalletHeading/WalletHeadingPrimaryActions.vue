<template>
  <div
    key="PrimaryActions"
    class="WalletHeading__PrimaryActions flex"
  >
    <ButtonModal
      :class="buttonStyle"
      icon="qr"
      label="QR"
      view-box="0 0 18 18"
    >
      <ModalQrCode
        slot-scope="{ toggle }"
        :value="currentWallet.address"
        @close="toggle"
      />
    </ButtonModal>

    <ButtonModal
      :class="buttonStyle"
      :label="$t('TRANSACTION.SEND')"
      icon="send"
      view-box="0 0 12 12"
    >
      <TransactionModal
        slot-scope="{ toggle }"
        :type="0"
        @cancel="toggle"
      />
    </ButtonModal>
  </div>
</template>

<script>
import { ButtonModal } from '@/components/Button'
import { ModalQrCode } from '@/components/Modal'
import { TransactionModal } from '@/components/Transaction'

export default {
  name: 'WalletHeadingPrimaryActions',

  components: {
    ButtonModal,
    ModalQrCode,
    TransactionModal
  },

  computed: {
    buttonStyle () {
      return 'option-button'
    },

    currentWallet () {
      return this.wallet_fromRoute
    }
  }
}
</script>
