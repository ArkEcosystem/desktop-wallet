<template>
  <button
    v-tooltip="{ show: isSmallScreen, content: tooltipContent, trigger:'hover' }"
    :disabled="!isCopySupported"
    class="ButtonClipboard"
    @click="copy"
  >
    <div
      :class="{ 'animated wobble': isCopying }"
      class="fill-current"
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
    }
  },

  data: () => ({
    isCopying: false,
    isCopySupported: true,
    isSmallScreen: false
  }),

  computed: {
    tooltipContent () {
      let translationKey

      if (!this.isCopySupported) {
        translationKey = 'NOT_SUPPORTED'
      } else {
        translationKey = this.isCopying ? 'DONE' : 'COPY_TO_CLIPBOARD'
      }

      return this.$t(`BUTTON_CLIPBOARD.${translationKey}`)
    }
  },

  methods: {
    copy () {
      const textArea = document.createElement('textarea')
      textArea.value = this.value
      textArea.style.cssText = 'position:absolute;top:0;left:0;z-index:-9999;opacity:0;'

      document.body.appendChild(textArea)
      textArea.select()

      try {
        this.isCopying = true

        setTimeout(() => (this.isCopying = false), 500)

        if (window.innerWidth < 768) {
          this.isSmallScreen = true
          // If set to 500, it will briefly show 'Copy to clipboard' before closing tooltip
          setTimeout(() => (this.isSmallScreen = false), 400)
        }

        document.execCommand('copy')
      } catch (err) {
        this.isCopySupported = false
        this.$logger.error('Clipboard not supported!')
      }

      document.body.removeChild(textArea)
    }
  }
}
</script>
