<template>
  <ModalConfirmation
    :question="$t('PLUGIN_ENABLE_CONFIRMATION.QUESTION', { title: plugin.title })"
    :note="$t('PLUGIN_ENABLE_CONFIRMATION.NOTICE')"
    :cancel-button="$t('PLUGIN_ENABLE_CONFIRMATION.NO')"
    :continue-button="$t('PLUGIN_ENABLE_CONFIRMATION.YES')"
    container-classes="PluginEnableConfirmation"
    @close="emitClose"
    @cancel="emitIgnore"
    @continue="emitEnable"
  />
</template>

<script>
import { ModalConfirmation } from '@/components/Modal'

export default {
  name: 'PluginEnableConfirmation',

  components: {
    ModalConfirmation
  },

  props: {
    plugin: {
      type: Object,
      required: true
    }
  },

  methods: {
    emitIgnore () {
      this.$emit('ignore')
    },

    emitEnable () {
      this.$emit('enable', this.plugin)
    },

    emitClose () {
      this.$emit('close')
    }
  }
}
</script>

<style>
.PluginEnableConfirmation .ModalConfirmation__container {
  min-width: calc(10rem + 74px * 2 + 80px);
  max-width: calc(10rem + 74px * 2 + 120px)
}
.PluginEnableConfirmation .ModalConfirmation__container > div:first-child {
  @apply .mb-0
}
</style>
