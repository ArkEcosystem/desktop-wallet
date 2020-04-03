<template>
  <ModalWindow
    :title="title"
    :allow-close="!isLoading"
    portal-target="qr-scan"
    @close="emitClose"
  >
    <section class="QrCode__container overflow-hidden flex flex-col justify-center items-center">
      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center my-auto"
      >
        <Loader />

        <span class="mt-4">
          {{ $t('MODAL_QR_SCANNER.LOADING') }}
        </span>
      </div>

      <div
        v-show="!isLoading && !errorMessage"
        class="relative"
      >
        <QrcodeStream
          :track="false"
          @decode="onDecode"
          @init="onInit"
        />

        <div class="QrCode__crosshair__container">
          <div class="m-auto relative">
            <div class="QrCode__crosshair">
              <div class="flex justify-between w-full">
                <span class="corner border-l-2 border-t-2 rounded-tl-lg" />
                <span class="corner border-r-2 border-t-2 rounded-tr-lg" />
              </div>
              <div class="flex justify-between w-full">
                <span class="corner border-l-2 border-b-2 rounded-bl-lg" />
                <span class="corner border-r-2 border-b-2 rounded-br-lg" />
              </div>
            </div>
          </div>
        </div>

        <span
          :class="{
            'absolute pin-b pin-x text-center py-4 bg-black-transparent text-theme-explanation-text': !isLoading
          }"
        >
          {{ $t('MODAL_QR_SCANNER.INSTRUCTION') }}
        </span>
      </div>

      <span
        v-if="errorMessage"
        class="my-auto"
      >
        {{ errorMessage }}
      </span>
    </section>
  </ModalWindow>
</template>

<script>
import ModalWindow from './ModalWindow'
import { QrcodeStream } from 'vue-qrcode-reader'
import Loader from '@/components/utils/Loader'

export default {
  name: 'ModalQrCode',

  components: {
    ModalWindow,
    QrcodeStream,
    Loader
  },

  props: {
    toggle: {
      type: Function,
      required: true
    }
  },

  data: () => ({
    isLoading: true,
    errorMessage: null
  }),

  computed: {
    title () {
      return this.$t('MODAL_QR_SCANNER.TITLE')
    }
  },

  methods: {
    async onInit (promise) {
      let promiseSuccessfullyHandled = false
      let errorMessage

      try {
        setTimeout(() => {
          if (!promiseSuccessfullyHandled) {
            this.isLoading = false
            this.errorMessage = this.$t('MODAL_QR_SCANNER.ERROR.NOT_READABLE')
          }
        }, 10000)
        await promise
        errorMessage = null
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = this.$t('MODAL_QR_SCANNER.ERROR.NOT_ALLOWED')
        } else if (error.name === 'NotFoundError') {
          errorMessage = this.$t('MODAL_QR_SCANNER.ERROR.NOT_FOUND')
        } else if (error.name === 'NotSupportedError') {
          errorMessage = this.$t('MODAL_QR_SCANNER.ERROR.NOT_SUPPORTED')
        } else if (error.name === 'NotReadableError') {
          errorMessage = this.$t('MODAL_QR_SCANNER.ERROR.NOT_READABLE')
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = this.$t('MODAL_QR_SCANNER.ERROR.OVERCONSTRAINED')
        } else if (error.name === 'StreamApiNotSupportedError') {
          errorMessage = this.$t('MODAL_QR_SCANNER.ERROR.STREAM')
        }
      } finally {
        setTimeout(() => {
          promiseSuccessfullyHandled = true
          this.isLoading = false
          this.errorMessage = errorMessage
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
.QrCode__container {
  min-height: 240px;
  min-width: 360px;
}

.QrCode__crosshair__container {
  @apply .absolute .flex .items-center .pin;
}
.QrCode__crosshair__container > div {
  width: 40%;
}
.QrCode__crosshair__container > div:after {
  content: '';
  display: block;
  padding-bottom: 100%;
}
.QrCode__crosshair {
  @apply .absolute .flex .flex-col .w-full .h-full .items-center .justify-between;
}

.QrCode__container .tracking-layer {
  display: none;
}
.QrCode__container .wrapper {
  font-size: 0;
}
.QrCode__container video {
  transform: scaleX(-1);
}

.corner {
  @apply .block .h-4 .w-4 .border-white-transparent;
}
.bg-black-transparent {
  background-color: rgba(0, 0, 0, 0.5);
}
.border-white-transparent {
  border-color: rgba(255, 255, 255, 0.5);
}
</style>
