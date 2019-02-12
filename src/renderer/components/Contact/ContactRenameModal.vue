<template>
  <ModalRename
    :wallet="wallet"
    :is-contact="true"
    :is-new-contact="isNewContact"
    :title="isNewContact ? $t('CONTACT_RENAME.TITLE_ADD') : $t('CONTACT_RENAME.TITLE')"
    :address-info="$t('CONTACT_RENAME.ADDRESS_INFO')"
    :label="$t('CONTACT_RENAME.NEW')"
    :button-text="isNewContact ? $t('CONTACT_RENAME.ADD') : $t('CONTACT_RENAME.RENAME')"
    @cancel="emitCancel"
    @renamed="emitRenamed"
    @created="emitCreated"
  />
</template>

<script>
import ModalRename from '@/components/Modal/ModalRename'

export default {
  name: 'ContactRenameModal',

  components: {
    ModalRename
  },

  props: {
    wallet: {
      type: Object,
      required: true
    },
    isNewContact: {
      type: Boolean,
      default: false
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
