<template>
  <ModalConfirmation
    :question="$t('PLUGIN_BLACKLIST_CONFIRMATION.QUESTION', { plugin: plugin.title })"
    :note="$t('PLUGIN_BLACKLIST_CONFIRMATION.NOTE')"
    container-classes="max-w-md"
    @close="emitCancel"
    @cancel="emitCancel"
    @continue="emitConfirm"
  />
</template>

<script>
import { ModalConfirmation } from '@/components/Modal'

export default {
  name: 'PluginBlacklistConfirmation',

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
    emitCancel () {
      this.$emit('cancel')
    },

    emitConfirm () {
      this.$emit('confirm')
    }
  }
}
</script>
