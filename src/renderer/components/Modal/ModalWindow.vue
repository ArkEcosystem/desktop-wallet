<template>
  <Portal :to="portalTarget">
    <div
      class="ModalWindow"
      :class="{
        'ModalWindow--maximized': isMaximized,
        'ModalWindow--minimized': !isMaximized,
        [modalClasses]: true
      }"
      @mousedown.left="onBackdropClick"
    >
      <Transition name="ModalWindow">
        <div class="ModalWindow__wrapper flex items-center justify-center absolute">
          <div
            :class="[{
              [containerClasses]: isMaximized,
              [containerClassesMinimized]: !isMaximized,
            }]"
            class="ModalWindow__container flex flex-col mx-auto rounded-lg relative transition text-theme-text-content"
            @change="onChange"
            @mousedown.stop="void 0"
          >
            <section class="ModalWindow__container__content">
              <div class="ModalWindow__container__actions">
                <span
                  v-if="canResize"
                  class="mr-6"
                >
                  <ButtonClose
                    :icon-name="isMaximized ? 'minus' : 'resize'"
                    icon-class="text-grey"
                    class="ModalWindow__resize-button p-6"
                    @click="toggleMaximized()"
                  />
                </span>

                <ButtonClose
                  :disabled="!allowClose"
                  icon-class="text-grey"
                  class="ModalWindow__close-button p-6"
                  @click="emitClose(true)"
                />
              </div>

              <header
                v-if="$slots.header || title"
                :class="headerClasses"
              >
                <slot name="header">
                  <h2>{{ title }}</h2>
                </slot>
              </header>

              <article
                :class="isMaximized ? 'mt-3' : 'mt-12'"
                class="content flex-1"
              >
                <slot :is-maximized="isMaximized" />
              </article>
            </section>

            <!-- eslint-disable vue/no-v-html -->
            <slot name="footer">
              <footer
                v-if="message"
                class="ModalWindow__container__footer--warning"
              >
                <p v-html="message" />
              </footer>
            </slot>

            <ModalCloseConfirmation
              v-if="showConfirmationModal"
              @cancel="showConfirmationModal = false"
              @confirm="emitCloseAfterConfirm"
            />
          </div>
        </div>
      </Transition>
    </div>
  </Portal>
</template>

<script>
import { ButtonClose } from '@/components/Button'
import ModalCloseConfirmation from './ModalCloseConfirmation'

export default {
  name: 'ModalWindow',

  components: {
    ButtonClose,
    ModalCloseConfirmation
  },

  props: {
    canResize: {
      type: Boolean,
      required: false,
      default: false
    },
    modalClasses: {
      type: String,
      required: false,
      default: ''
    },
    headerClasses: {
      type: String,
      required: false,
      default: ''
    },
    containerClasses: {
      type: String,
      required: false,
      default: ''
    },
    containerClassesMinimized: {
      type: String,
      required: false,
      default: ''
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    message: {
      type: String,
      required: false,
      default: ''
    },
    allowBackdropClick: {
      type: Boolean,
      required: false,
      default: true
    },
    confirmClose: {
      type: Boolean,
      required: false,
      default: false
    },
    allowClose: {
      type: Boolean,
      required: false,
      default: true
    },
    portalTarget: {
      type: String,
      required: false,
      default: 'modal'
    }
  },

  data: () => ({
    isMaximized: true,
    showConfirmationModal: false,
    hasChanged: false
  }),

  mounted () {
    document.addEventListener('keyup', this.onEscKey, false)
    this.$eventBus.on('change', this.onChange)
  },

  destroyed () {
    document.removeEventListener('keyup', this.onEscKey)
  },

  methods: {
    toggleMaximized () {
      this.isMaximized = !this.isMaximized
    },

    onBackdropClick () {
      if (this.allowBackdropClick) {
        this.emitClose()
      }
    },

    emitClose (force = false) {
      if (!this.allowClose) {
        return
      }

      if (this.confirmClose && this.hasChanged) {
        this.showConfirmationModal = true
        return
      }

      if (force || this.isMaximized) {
        this.$emit('close')
      }
    },

    emitCloseAfterConfirm () {
      this.showConfirmationModal = false
      this.$emit('close')
    },

    onEscKey (event) {
      if (event.key === 'Escape') {
        this.emitClose()
      }
    },

    onChange () {
      this.hasChanged = true
    }
  }
}
</script>

<style lang="postcss" scoped>
.ModalWindow-enter,
.ModalWindow-leave-active {
  opacity: 0;
  transform: scale(1.1);
}

.ModalWindow--maximized {
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  display: table;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  transition: opacity .3s ease;
  backdrop-filter: blur(4px);
}

.ModalWindow--maximized .ModalWindow__wrapper {
  @apply pin;
}
.ModalWindow--minimized .ModalWindow__wrapper {
  @apply pin-r pin-b mr-5 mb-5;
}

.ModalWindow__container__actions {
  @apply absolute pin-x pin-t flex justify-end m-2 p-2 z-10;
}

.ModalWindow--maximized .ModalWindow__container__content {
  @apply overflow-y-auto p-16 pt-16 bg-theme-modal shadow rounded-lg;
}
.ModalWindow--minimized .ModalWindow__container__content {
  @apply overflow-y-auto px-8 pt-2 pb-5 bg-theme-modal shadow rounded-lg;
}
.ModalWindow--minimized .ModalWindow__container {
  height: 200px !default;
  @apply overflow-hidden;
}
</style>

<style lang="postcss">
.ModalWindow__container__footer {
  @apply p-8 rounded-lg mt-2 text-sm shadow;
}
.ModalWindow__container__footer--warning {
  @apply ModalWindow__container__footer bg-yellow-lighter text-grey-darkest;
}
.ModalWindow__container__footer--error {
  @apply ModalWindow__container__footer bg-theme-error text-white;
}
.ModalWindow--minimized .ModalWindow__container__footer {
  @apply hidden;
}
</style>
