<template>
  <ModalWindow
    :container-classes="containerClasses"
    :title="title"
    :message="footer"
    :portal-target="portalTarget"
    @close="emitClose"
  >
    <section class="ModalConfirmation__container flex flex-col">
      <div
        v-if="question || note"
        class="mb-6"
      >
        <h3
          v-if="question"
          class="font-semibold"
        >
          {{ question }}
        </h3>

        <div
          v-if="note"
          class="mt-3 text-grey-darker text-lg"
          :class="note ? 'mb-8' : ''"
        >
          {{ note }}
        </div>
      </div>

      <slot />

      <div class="mt-4 flex flex-row">
        <button
          v-if="showCancelButton"
          class="ModalConfirmation__cancel-button blue-button"
          @click="emitCancel"
        >
          {{ cancelButton }}
        </button>

        <button
          class="ModalConfirmation__continue-button action-button py-4 px-8"
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
    showCancelButton: {
      type: Boolean,
      required: false,
      default: true
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

    emitClose () {
      this.$emit('close')
    },

    emitContinue () {
      this.$emit('continue')
    }
  }
}
</script>
