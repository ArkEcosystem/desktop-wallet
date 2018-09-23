<template>
  <div
    key="PrimaryActions"
    class="WalletHeading__PrimaryActions"
  >
    <button
      class="bg-theme-heading-button text-theme-heading-button-text mr-2 p-2 rounded-lg"
      @click="showQRCodeModal = true"
    >
      QR
      <portal
        v-if="showQRCodeModal"
        to="modal"
      >
        <QRCodeModal
          @close="showQRCodeModal = false"
        />
      </portal>
    </button>
    <button class="bg-theme-heading-button text-theme-heading-button-text p-2 rounded-lg">
      {{ $t('WALLET_HEADING.ACTIONS.SEND') }}
    </button>
  </div>
</template>

<script>
import QRCodeModal from '@/components/QRCode'

export default {
  components: {
    QRCodeModal
  },
  data () {
    return {
      showQRCodeModal: false
    }
  }
}
</script>
