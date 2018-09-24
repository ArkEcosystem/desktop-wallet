<template>
  <div
    key="PrimaryActions"
    class="WalletHeading__PrimaryActions flex"
  >
    <button
      class="bg-theme-heading-button text-theme-heading-button-text mr-2 p-2 rounded-lg flex items-center justify-center"
      @click="showQRCodeModal = true"
    >
      <SvgIcon
        name="qr"
        view-box="0 0 18 18"
        class="mr-1"
      />
      QR
      <portal
        v-if="showQRCodeModal"
        to="modal"
      >
        <QRCodeModal
          value="wallet_fromRoute.address"
          @close="showQRCodeModal = false"
        />
      </portal>
    </button>
    <button class="bg-theme-heading-button text-theme-heading-button-text p-2 rounded-lg">
      <SvgIcon
        name="send"
        view-box="0 0 12 12"
        class="mr-1"
      />
      {{ $t('WALLET_HEADING.ACTIONS.SEND') }}
    </button>
  </div>
</template>

<script>
import QRCodeModal from '@/components/QRCode'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'WalletHeadingPrimaryActions',

  components: {
    QRCodeModal,
    SvgIcon
  },

  data () {
    return {
      showQRCodeModal: false
    }
  }
}
</script>
