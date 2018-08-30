<template>
  <PopupModal
    @close="emitClose"
  >
    <section class="flex flex-col items-center p-5">
      <h2 class="mb-1">{{ $t('QRCode.popupTitle') }}</h2>
      <p class="mb-5">{{ $t('QRCode.popupSubtitle') }}</p>
      <VueQrcode v-bind="$props" />
    </section>
  </PopupModal>
</template>

<script>
import PopupModal from '@/components/PopupModal'
import VueQrcode from '@xkeshi/vue-qrcode'

export default {
  name: 'QRCode',

  components: {
    PopupModal,
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
