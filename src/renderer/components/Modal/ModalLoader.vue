<template>
  <ModalWindow
    v-if="isVisible"
    :allow-close="showClose"
    container-classes="w-1/2"
    portal-target="loading"
    @close="toggle"
  >
    <h2>
      {{ message }}
    </h2>
    <div
      class="flex justify-center p-5"
    >
      <Loader />
    </div>

    <div
      v-if="showClose"
      class="text-center text-theme-warn-text border-theme-warn border-t-2 p-2"
    >
      {{ $t('MODAL_LOADER.CLOSE_WARNING') }}
    </div>
  </ModalWindow>
</template>

<script>
import Loader from '@/components/utils/Loader'
import ModalWindow from './ModalWindow'

export default {
  name: 'ModalLoader',

  components: {
    Loader,
    ModalWindow
  },

  props: {
    message: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: false,
      default: true
    },
    allowClose: {
      type: Boolean,
      required: false,
      default: false
    },
    closeWarningDelay: {
      type: Number,
      required: false,
      default: 15000
    }
  },

  data (vm) {
    return {
      showClose: false,
      showCloseTimeout: null,
      isVisible: vm.visible
    }
  },

  watch: {
    visible: function (value) {
      this.isVisible = value
      if (value) {
        this.triggerShowClose()
      }
    }
  },

  mounted () {
    this.triggerShowClose()
  },

  methods: {
    toggle () {
      this.isVisible = !this.isVisible

      if (!this.isVisible) {
        this.$emit('close')
      }
    },

    triggerShowClose () {
      if (this.allowClose) {
        if (this.showCloseTimeout || this.showClose) {
          clearInterval(this.showCloseTimeout)
          this.showClose = false
        }
        this.showCloseTimeout = setTimeout(() => {
          this.showClose = true
        }, this.closeWarningDelay)
      }
    }
  }
}
</script>
