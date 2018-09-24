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
      <svg
        viewBox="0 0 16 19"
        width="12px"
        height="13px"
      >
        <path d="M11.000,-0.000 L1.999,-0.000 C0.899,-0.000 -0.000,0.941 -0.000,2.091 L-0.000,13.000 L1.999,13.000 L1.999,2.000 L11.000,2.000 L11.000,-0.000 ZM14.000,3.994 L5.999,3.994 C4.900,3.994 3.999,4.944 3.999,6.106 L3.999,16.888 C3.999,18.049 4.900,19.000 5.999,19.000 L14.000,19.000 C15.099,19.000 16.000,18.049 16.000,16.888 L16.000,6.106 C16.000,4.944 15.099,3.994 14.000,3.994 ZM14.000,17.000 L5.999,17.000 L5.999,6.000 L14.000,6.000 L14.000,17.000 Z"/>
      </svg>
    </div>
  </button>
</template>

<script>
export default {
  name: 'ButtonClipboard',

  props: {
    value: {
      type: String,
      required: true
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
        console.error('Clipboard not supported!')
      }

      document.body.removeChild(textArea)
    }
  }
}
</script>
