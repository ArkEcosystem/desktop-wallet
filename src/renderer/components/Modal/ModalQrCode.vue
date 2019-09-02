<template>
  <ModalWindow
    @close="emitClose"
  >
    <section class="flex flex-col items-center">
      <h2 class="mb-1">
        {{ $t('MODAL_QR_CODE.TITLE') }}
      </h2>
      <p class="mb-5">
        {{ $t('MODAL_QR_CODE.SUBTITLE') }}
      </p>
      <VueQrcode v-bind="$props" />
    </section>
  </ModalWindow>
</template>

<script>
import ModalWindow from './ModalWindow'
import VueQrcode from '@/components/utils/QRCode'

export default {
  name: 'ModalQrCode',

  components: {
    ModalWindow,
    VueQrcode
  },

  props: {
    value: {
      type: String,
      required: true,
      default: ''
    },
    options: {
      type: Object,
      required: false,
      default: () => ({
        size: 160
      })
    },
    tag: {
      type: String,
      required: false,
      default: 'canvas'
    }
  },

  methods: {
    emitClose () {
      this.$emit('close')
    }
  }
}
</script>
