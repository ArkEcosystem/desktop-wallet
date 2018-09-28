<template>
  <ModalWindow
    @close="emitCancel"
  >
    <section class="ModalConfirmation__container m-6 flex flex-col">
      <div class="mb-6 text-xl">
        <h2 class="mb-5 text-3xl">{{ $t('WALLET_REMOVE_POPUP.HEADER') }}</h2>

        {{ $t('WALLET_REMOVE_POPUP.QUESTION') }}

        <div class="mt-3 text-grey-darker text-lg">{{ $t('WALLET_REMOVE_POPUP.NOTE') }}</div>
      </div>

      <div class="flex flex-row justify-center">
        <img
          :title="wallet.name"
          :src="assets_loadImage('arrows/arrow-confirmation.svg')"
          class="ModalConfirmation__container__arrow"
        >
        <div
          :style="`backgroundImage: url('https://api.adorable.io/avatars/285/abott@adorable.png')`"
          :title="wallet.name"
          class="wallet-identicon-xl background-image"
        />
        <img
          :title="wallet.name"
          :src="assets_loadImage('arrows/arrow-confirmation.svg')"
          class="ModalConfirmation__container__arrow ModalConfirmation__container__arrow--reverse"
        >
      </div>

      <div class="mt-4 flex flex-row">
        <button
          class="blue-button"
          @click="emitCancel"
        >
          {{ $t('WALLET_REMOVE_POPUP.NO') }}
        </button>

        <button
          class="blue-button"
          @click="emitContinue"
        >
          {{ $t('WALLET_REMOVE_POPUP.YES') }}
        </button>
      </div>
    </section>
  </ModalWindow>
</template>

<script>
import ModalWindow from './ModalWindow'

export default {
  name: 'ModalConfirmation',

  components: {
    ModalWindow
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

    emitContinue () {
      this.$emit('continue')
    }
  }
}
</script>

<style scoped>
.ModalConfirmation__container {
  min-width: calc(var(--wallet-identicon-xl) + 74px * 2);
  max-width: calc(var(--wallet-identicon-xl) + 74px * 2 + 50px)
}
.ModalConfirmation__container__arrow {
  width: 74px;
  height: 75px;
  margin-top: calc(var(--wallet-identicon-xl) - 75px + 2rem)
}
.ModalConfirmation__container__arrow--reverse {
  transform: scaleX(-1)
}
</style>
