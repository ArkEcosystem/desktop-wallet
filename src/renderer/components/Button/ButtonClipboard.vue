<template>
  <button
    v-tooltip="getTooltip()"
    :disabled="!isCopySupported"
    class="ButtonClipboard"
    @click="copy"
  >
    <div
      :class="{ 'animated wobble': isCopying }"
      class="fill-current flex items-center"
    >
      <SvgIcon
        :view-box="viewBox"
        name="copy"
      />
    </div>
  </button>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'ButtonClipboard',

  components: {
    SvgIcon
  },

  props: {
    value: {
      type: String,
      required: true
    },
    viewBox: {
      type: String,
      required: false,
      default: '0 0 12 16'
    },
    subject: {
      type: String,
      required: false,
      default: ''
    }
  },

  data: () => ({
    isCopying: false,
    isCopySupported: true,
    copyText: '',
    timeout: null
  }),

  mounted () {
    // When opening the `TransactionShow` modal the clipboard buttons have i18n,
    // but, when closing, its value has been lost. This problem is produced only
    // when using portals. Probably is this bug:
    // https://github.com/LinusBorg/portal-vue/issues/159
    if (this.$i18n) {
      this.copyText = this.$t('BUTTON_CLIPBOARD.COPY_TO_CLIPBOARD', [this.subject])
    }
  },

  beforeDestroy () {
    clearTimeout(this.timeout)
  },

  methods: {
    copy () {
      const textArea = document.createElement('textarea')
      textArea.value = this.value
      textArea.style.cssText = 'position:absolute;top:0;left:0;z-index:-9999;opacity:0;'

      document.body.appendChild(textArea)
      textArea.select()

      this.isCopying = true
      this.timeout = setTimeout(() => (this.isCopying = false), 1000)
      this.timeout = setTimeout(() => (this.copyText = this.$t('BUTTON_CLIPBOARD.COPY_TO_CLIPBOARD', [this.subject])), 1500)

      try {
        document.execCommand('copy')
      } catch (err) {
        this.isCopySupported = false
        this.$logger.error('Clipboard not supported!')
      }

      document.body.removeChild(textArea)
    },

    getTooltip () {
      const tooltip = {
        content: this.copyText,
        trigger: 'hover',
        show: this.isCopying,
        hideOnTargetClick: this.isCopying
      }

      if (this.isCopying) {
        tooltip.delay = { show: 0, hide: 1000 }

        if (this.isCopySupported) {
          this.copyText = this.$t('BUTTON_CLIPBOARD.DONE')
          tooltip.classes = 'success'
        } else {
          this.copyText = this.$t('BUTTON_CLIPBOARD.NOT_SUPPORTED')
          tooltip.classes = 'error'
        }
      }

      return tooltip
    }
  }
}
</script>
