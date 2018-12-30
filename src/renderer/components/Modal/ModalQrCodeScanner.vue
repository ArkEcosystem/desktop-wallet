<template>
  <ModalWindow
    :title="title"
    :allow-close="!isLoading"
    portal-target="qr-scan"
    @close="emitClose"
  >
    <section class="overflow-hidden flex flex-col justify-center items-center">
      <span v-if="isLoading">
        {{ $t('MODAL_QR_SCANNER.LOADING') }}
      </span>
      <span
        v-else
        class="mb-2"
      >
        {{ $t('MODAL_QR_SCANNER.INSTRUCTION') }}
      </span>
      <span v-if="errorMessage">
        {{ errorMessage }}
      </span>
      <QrcodeStream
        :camera="getCameraConstraints"
        :track="false"
        @decode="onDecode"
        @init="onInit"
      />
    </section>
  </ModalWindow>
</template>

<script>
import ModalWindow from './ModalWindow'
import { QrcodeStream } from 'vue-qrcode-reader'

export default {
  name: 'ModalQrCode',

  components: {
    ModalWindow,
    QrcodeStream
  },

  props: {
    toggle: {
      type: Function,
      required: true
    }
  },

  data: () => ({
    isLoading: true,
    errorMessage: ''
  }),

  computed: {
    getCameraConstraints () {
      return {
        audio: false, // don't request microphone access
        video: {
          facingMode: { ideal: 'environment' },
          width: { min: 360, ideal: 640, max: 1920 },
          height: { min: 240, ideal: 480, max: 1080 }
        }
      }
    },
    title () {
      return this.$t('MODAL_QR_SCANNER.TITLE')
    }
  },

  methods: {
    async onInit (promise) {
      let promiseSuccessfullyHandled = false
      try {
        setTimeout(() => {
          if (!promiseSuccessfullyHandled) {
            this.isLoading = false
            this.errorMessage = this.$t('MODAL_QR_SCANNER.ERROR.NOT_READABLE')
          }
        }, 10000)
        await promise
        this.errorMessage = ''
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.errorMessage = this.$t('MODAL_QR_SCANNER.ERROR.NOT_ALLOWED')
        } else if (error.name === 'NotFoundError') {
          this.errorMessage = this.$t('MODAL_QR_SCANNER.ERROR.NOT_FOUND')
        } else if (error.name === 'NotSupportedError') {
          this.errorMessage = this.$t('MODAL_QR_SCANNER.ERROR.NOT_SUPPORTED')
        } else if (error.name === 'NotReadableError') {
          this.errorMessage = this.$t('MODAL_QR_SCANNER.ERROR.NOT_READABLE')
        } else if (error.name === 'OverconstrainedError') {
          this.errorMessage = this.$t('MODAL_QR_SCANNER.ERROR.OVERCONSTRAINED')
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.errorMessage = this.$t('MODAL_QR_SCANNER.ERROR.STREAM')
        }
      } finally {
        setTimeout(() => {
          promiseSuccessfullyHandled = true
          this.isLoading = false
        }, 1000)
      }
    },

    onDecode (decodedString) {
      this.$emit('decoded', decodedString, this.toggle)
    },

    emitClose () {
      this.$emit('close')
    }
  }
}
</script>

<style>
.qrcode-stream__tracking-layer {
  display: none;
}

.qrcode-stream__inner-wrapper video {
  transform: scaleX(-1);
}
</style>
