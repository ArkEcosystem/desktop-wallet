<template>
  <div
    class="ModalCloseConfirmation ModalCloseConfirmation__mask"
    @click="onBackdropClick"
  >
    <div
      class="ModalCloseConfirmation__container"
      @click.stop="void 0"
    >
      <section class="ModalCloseConfirmation__container__content">
        <div class="mb-6">
          <h3
            v-if="question"
            class="font-semibold"
          >
            {{ question }}
          </h3>

          <div
            v-if="note"
            class="mt-3 text-grey-darker text-lg"
            :class="{ 'mb-8': note }"
          >
            {{ note }}
          </div>
        </div>

        <slot />

        <div class="mt-4 flex flex-row">
          <div class="flex-1">
            <button
              class="ModalCloseConfirmation__cancel-button blue-button m-1"
              @click="emitCancel"
            >
              {{ cancelButton }}
            </button>
          </div>

          <div class="flex-1 text-right">
            <button
              class="ModalCloseConfirmation__confirm-button action-button m-1 px-8 py-4"
              @click="emitConfirm"
            >
              {{ confirmButton }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ModalCloseConfirmation',

  props: {
    cancelButton: {
      type: String,
      required: false,
      default () {
        return this.$t('MODAL_CLOSE_CONFIRMATION.CANCEL')
      }
    },
    confirmButton: {
      type: String,
      required: false,
      default () {
        return this.$t('MODAL_CLOSE_CONFIRMATION.CONFIRM')
      }
    },
    containerClasses: {
      type: String,
      required: false,
      default: 'ModalConfirmationClose'
    },
    footer: {
      type: String,
      required: false,
      default: ''
    },
    note: {
      type: String,
      required: false,
      default: null
    },
    question: {
      type: String,
      required: false,
      default () {
        return this.$t('MODAL_CLOSE_CONFIRMATION.QUESTION')
      }
    },
    title: {
      type: String,
      required: false,
      default () {
        return this.$t('MODAL_CONFIRMATION.TITLE')
      }
    },
    portalTarget: {
      type: String,
      required: false,
      default: 'modal'
    }
  },

  methods: {
    emitCancel () {
      this.$emit('cancel')
    },

    emitConfirm () {
      this.$emit('confirm')
    },

    onBackdropClick () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="postcss" scoped>
.ModalCloseConfirmation-enter,
.ModalCloseConfirmation-leave-active {
  opacity: 0;
  transform: scale(1.1);
}

.ModalCloseConfirmation__mask {
  @apply overflow-hidden p-16 pt-16 bg-theme-modal shadow rounded-lg w-full h-full flex items-center justify-center absolute;
  position: fixed;
  z-index: 60;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .5);
  transition: opacity .3s ease;
  backdrop-filter: blur(4px);
}

.ModalCloseConfirmation__container__content{
  @apply overflow-hidden p-12 bg-theme-modal shadow rounded-lg flex flex-col inline-block w-auto
}
</style>
