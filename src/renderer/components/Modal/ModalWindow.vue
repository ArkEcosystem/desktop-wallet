<template>
  <Portal :to="portalTarget">
    <div
      class="modal-backdrop"
      @click="emitClose"
    >
      <Transition name="ModalWindow">
        <div class="container mx-auto h-full flex justify-center items-center">
          <div
            :class="containerClasses"
            class="ModalWindow__container flex flex-col shadow mx-auto rounded-lg overflow-hidden relative transition bg-theme-modal text-theme-text-content"
            @click.stop="void 0"
          >
            <div class="absolute top-0 right-0 mt-6 mr-6">
              <ButtonClose
                :disabled="!allowClose"
                icon-class="text-grey"
                class="p-6"
                @click="emitClose"
              />
            </div>

            <section class="px-16 py-16">
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

export default {
  name: 'ModalWindow',

  components: {
    ButtonClose
  },

  props: {
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
      requred: false,
      default: true
    },
    portalTarget: {
      type: String,
      required: false,
      default: 'modal'
    }
  },

  mounted () {
    document.addEventListener('keyup', this.onEscKey, { once: true })
  },

  destroyed () {
    document.removeEventListener('keyup', this.onEscKey)
  },

  methods: {
    emitClose () {
      if (this.allowClose) {
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

<style scoped>
.ModalWindow-enter,
.ModalWindow-leave-active {
  opacity: 0;
  transform: scale(1.1);
}
</style>

<style>
.ModalWindow__container__footer--warning {
  @apply .px-10 .py-8 .bg-yellow-lighter .text-grey-darkest
}
</style>
