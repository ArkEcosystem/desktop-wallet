<template>
  <ModalConfirmation
    :title="$t('BLACKLIST_DISCLAIMER_CONFIRMATION.QUESTION')"
    :note="$t('BLACKLIST_DISCLAIMER_CONFIRMATION.NOTE')"
    :cancel-button="$t('BLACKLIST_DISCLAIMER_CONFIRMATION.CANCEL')"
    :continue-button="$t('BLACKLIST_DISCLAIMER_CONFIRMATION.ACCEPT')"
    container-classes="w-md"
    @close="emitClose"
    @cancel="emitClose"
    @continue="emitContinue"
  />
</template>

<script>
import { ModalConfirmation } from '@/components/Modal'

export default {
  name: 'PluginBlacklistDisclaimerConfirmation',

  components: {
    ModalConfirmation
  },

  methods: {
    emitContinue () {
      this.$emit('continue')
    },

    emitClose () {
      this.$emit('close')
    }
  }
}
</script>
