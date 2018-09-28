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
      :label="$t('WALLET_HEADING.ACTIONS.SEND')"
      icon="send"
      view-box="0 0 12 12"
    >
      <SendTransferModal
        slot-scope="{ toggle }"
        @close="toggle"
      />
    </ButtonModal>
  </div>
</template>

<script>
import { ButtonModal } from '@/components/Button'
import { ModalQrCode } from '@/components/Modal'
import SendTransferModal from '@/components/SendTransfer/SendTransferModal'

export default {
  name: 'WalletHeadingPrimaryActions',

  components: {
    ButtonModal,
    ModalQrCode,
    SendTransferModal
  },

  computed: {
    buttonStyle () {
      return 'bg-theme-heading-button text-theme-heading-button-text'
    },

    currentWallet () {
      return this.wallet_fromRoute
    }
  }
}
</script>
