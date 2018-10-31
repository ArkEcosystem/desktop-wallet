<template>
  <ModalConfirmation
    :question="$t('CONTACT_REMOVAL_CONFIRMATION.QUESTION')"
    container-classes="ContactRemovalConfirmation"
    @cancel="emitCancel"
    @continue="removeContact"
  >
    <div class="flex flex-row justify-center">
      <img
        :title="contact.name"
        :src="assets_loadImage('arrows/arrow-confirmation.svg')"
        class="ContactRemovalConfirmation__container__arrow"
      >
      <WalletIdenticon
        :value="contact.address"
        :size="150"
        class="identicon cursor-pointer"
      />
      <img
        :title="contact.name"
        :src="assets_loadImage('arrows/arrow-confirmation.svg')"
        class="ContactRemovalConfirmation__container__arrow ContactRemovalConfirmation__container__arrow--reverse"
      >
    </div>
  </ModalConfirmation>
</template>

<script>
import { ModalConfirmation } from '@/components/Modal'
import { WalletIdenticon } from '@/components/Wallet'

export default {
  name: 'ContactRemovalConfirmation',

  components: {
    WalletIdenticon,
    ModalConfirmation
  },

  props: {
    contact: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeContact () {
      this.$store.dispatch('wallet/delete', this.contact)
      this.emitRemoved()
    },

    emitCancel () {
      this.$emit('cancel')
    },

    emitRemoved () {
      this.$emit('removed')
    }
  }
}
</script>

<style>
.ContactRemovalConfirmation .ModalConfirmation__container {
  min-width: calc(var(--contact-identicon-xl) + 74px * 2);
  max-width: calc(var(--contact-identicon-xl) + 74px * 2 + 50px)
}
.ContactRemovalConfirmation__container__arrow {
  width: 74px;
  height: 75px;
  margin-top: calc(var(--contact-identicon-xl) - 75px + 2rem)
}
.ContactRemovalConfirmation__container__arrow--reverse {
  transform: scaleX(-1)
}
</style>
