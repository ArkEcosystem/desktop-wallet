<template>
  <div
    key="PrimaryActions"
    class="WalletHeading__PrimaryActions flex"
  >
    <ButtonPopup
      :class="buttonStyle"
      icon="qr"
      label="QR"
      view-box="0 0 18 18"
    >
      <QRCodeModal
        slot-scope="{ toggle }"
        :value="currentWallet.address"
        @close="toggle"
      />
    </ButtonPopup>

    <ButtonPopup
      :class="buttonStyle"
      :label="$t('WALLET_HEADING.ACTIONS.SEND')"
      icon="send"
      view-box="0 0 12 12"
    >
      <SendTransferModal
        slot-scope="{ toggle }"
        @close="toggle"
      />
    </ButtonPopup>
  </div>
</template>

<script>
import { ButtonPopup } from '@/components/Button'
import { QRCodeModal } from '@/components/QRCode'
import SendTransferModal from '@/components/SendTransfer/SendTransferModal'

export default {
  name: 'WalletHeadingPrimaryActions',

  components: {
    ButtonPopup,
    QRCodeModal,
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
