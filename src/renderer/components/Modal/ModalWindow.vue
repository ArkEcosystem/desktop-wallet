<template>
  <Portal
    :to="portalTarget"
  >
    <div
      slot-scope="{ setBlurFilter }"
      class="ModalWindow"
      :class="{
        'ModalWindow--maximized': isMaximized,
        'ModalWindow--minimized': !isMaximized
      }"
      @click="emitClose()"
    >
      <Transition name="ModalWindow">
        <div class="ModalWindow__wrapper flex items-center justify-center absolute">
          <div
            :class="containerClasses"
            class="ModalWindow__container flex flex-col shadow mx-auto rounded-lg relative transition bg-theme-modal text-theme-text-content"
            @click.stop="void 0"
          >
            <div class="ModalWindow__container__actions">
              <span
                v-if="canResize"
                class="mr-4"
              >
                <ButtonClose
                  :icon-name="isMaximized ? 'minus' : 'resize'"
                  icon-class="text-grey"
                  class="ModalWindow__resize-button p-6"
                  @click="toggleMaximized(setBlurFilter)"
                />
              </span>

              <ButtonClose
                :disabled="!allowClose"
                icon-class="text-grey"
                class="ModalWindow__close-button p-6"
                @click="emitClose(true)"
              />
            </div>

            <section class="ModalWindow__container__content">
              <header
                v-if="$slots.header || title"
              >
                <slot name="header">
                  <h2>{{ title }}</h2>
                </slot>
              </header>

              <article class="content flex-1 mt-3">
                <slot />
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
          </div>
        </div>
      </Transition>
    </div>
  </Portal>
</template>

<script>
import { ButtonClose } from '@/components/Button'
import { isFunction } from 'lodash'

export default {
  name: 'ModalWindow',

  components: {
    ButtonClose
  },

  props: {
    canResize: {
      type: Boolean,
      required: false,
      default: false
    },
    containerClasses: {
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
    isMaximized: true
  }),

  mounted () {
    document.addEventListener('keyup', this.onEscKey, { once: true })
  },

  destroyed () {
    document.removeEventListener('keyup', this.onEscKey)
  },

  methods: {
    toggleMaximized (callback) {
      this.isMaximized = !this.isMaximized
      isFunction(callback) && callback(this.isMaximized)
    },

    emitClose (force = false) {
      if (!this.allowClose) {
        return
      }

      if (force || this.isMaximized) {
        this.$emit('close')
      }
    },

    onEscKey (event) {
      if (event.keyCode === 27) {
        this.emitClose()
      }
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
}

.ModalWindow--maximized .ModalWindow__wrapper {
  @apply pin
}
.ModalWindow--minimized .ModalWindow__wrapper {
  @apply pin-r pin-b mr-5 mb-5
}

.ModalWindow__container__actions {
  @apply absolute pin-x block text-right m-4
}

.ModalWindow--maximized .ModalWindow__container__content {
  @apply overflow-hidden px-16 pt-10 pb-16
}
.ModalWindow--minimized .ModalWindow__container__content {
  @apply overflow-y-auto px-10 pt-2 pb-5
}
.ModalWindow--minimized .ModalWindow__container {
  height: 200px;
  @apply overflow-hidden
}
</style>

<style lang="postcss">
.ModalWindow__container__footer--warning {
  @apply .px-10 .py-8 .bg-yellow-lighter .text-grey-darkest
}
</style>
