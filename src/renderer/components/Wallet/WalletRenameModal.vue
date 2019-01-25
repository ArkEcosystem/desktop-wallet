<template>
  <ModalRename
    :wallet="wallet"
    :is-contact="false"
    :title="$t('WALLET_RENAME.TITLE')"
    :address-info="$t('WALLET_RENAME.ADDRESS_INFO')"
    :label="$t('WALLET_RENAME.NEW')"
    :button-text="$t('WALLET_RENAME.RENAME')"
    @cancel="emitCancel"
    @renamed="emitRenamed"
    @created="emitCreated"
  />
</template>

<script>
import ModalRename from '@/components/Modal/ModalRename'

export default {
  name: 'WalletRenameModal',

  components: {
    ModalRename
  },

  props: {
    wallet: {
      type: Object,
      required: true
    }
  },

  methods: {
    emitCancel () {
      this.$emit('cancel')
    },

    emitRenamed () {
      this.$emit('renamed')
    },

    emitCreated () {
      this.$emit('created')
    }
  }
}
</script>
