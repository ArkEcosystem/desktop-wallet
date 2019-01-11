<template>
  <ModalWindow
    :container-classes="containerClasses"
    :title="title"
    :portal-target="portalTarget"
    @close="emitCancel"
  >
    <section class="ModalConfirmation__container flex flex-col">
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
        >
          {{ note }}
        </div>
      </div>

      <slot />

      <div class="mt-4 flex flex-row">
        <button
          class="blue-button"
          @click="emitCancel"
        >
          {{ cancelButton }}
        </button>

        <button
          class="action-button px-8"
          @click="emitContinue"
        >
          {{ continueButton }}
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
    cancelButton: {
      type: String,
      required: false,
      default () {
        return this.$t('MODAL_CONFIRMATION.CANCEL')
      }
    },
    containerClasses: {
      type: String,
      required: false,
      default: 'ModalConfirmation'
    },
    continueButton: {
      type: String,
      required: false,
      default () {
        return this.$t('MODAL_CONFIRMATION.CONTINUE')
      }
    },
    note: {
      type: String,
      required: false,
      default: null
    },
    question: {
      type: String,
      required: false,
      default: null
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

    emitContinue () {
      this.$emit('continue')
    }
  }
}
</script>
