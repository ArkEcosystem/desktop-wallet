<template>
  <ModalWindow
    v-if="isVisible"
    :allow-close="showClose"
    class="ModalLoader"
    container-classes="max-w-md sm:w-md"
    portal-target="loading"
    @close="toggle"
  >
    <PluginLogo
      v-if="plugin"
      :plugin="plugin"
      class="mb-5 mx-auto"
    />

    <h2 class="text-center">
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
      {{ closeWarningMessage || $t('MODAL_LOADER.CLOSE_WARNING') }}
    </div>
  </ModalWindow>
</template>

<script>
import Loader from '@/components/utils/Loader'
import PluginLogo from '@/components/PluginManager/PluginLogo'
import ModalWindow from './ModalWindow'

export default {
  name: 'ModalLoader',

  components: {
    Loader,
    ModalWindow,
    PluginLogo
  },

  props: {
    message: {
      type: String,
      required: true
    },
    plugin: {
      type: Object,
      required: false,
      default: null
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
    },
    closeWarningMessage: {
      type: String,
      required: false,
      default: null
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
