<template>
  <Portal
    :to="portalTarget"
  >
    <div
      class="PluginManagerModalWindow"
      @click="emitClose()"
    >
      <Transition name="PluginManagerModalWindow">
        <div class="PluginManagerModalWindow__wrapper flex items-center justify-center absolute">
          <div
            :class="containerClasses"
            class="PluginManagerModalWindow__container flex flex-col shadow mx-auto rounded-lg relative transition text-theme-text-content"
            @click.stop="void 0"
          >
            <div class="PluginManagerModalWindow__container__actions">
              <ButtonClose
                :disabled="!allowClose"
                icon-class="text-grey"
                class="PluginManagerModalWindow__close-button p-6"
                @click="emitClose()"
              />
            </div>

            <section class="PluginManagerModalWindow__container__header">
              <slot name="header" />
            </section>

            <section class="PluginManagerModalWindow__container__content">
              <slot name="content" />
            </section>

            <!-- eslint-disable vue/no-v-html -->
            <slot name="footer">
              <footer
                v-if="message"
                class="PluginManagerModalWindow__container__footer--warning"
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
  name: 'PluginManagerModalWindow',

  components: {
    ButtonClose
  },

  props: {
    containerClasses: {
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

  mounted () {
    document.addEventListener('keyup', this.onEscKey, { once: true })
  },

  destroyed () {
    document.removeEventListener('keyup', this.onEscKey)
  },

  methods: {
    emitClose () {
      if (!this.allowClose) {
        return
      }

      this.$emit('close')
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
.PluginManagerModalWindow-enter,
.PluginManagerModalWindow-leave-active {
  opacity: 0;
  transform: scale(1.1);
}

.PluginManagerModalWindow {
  @apply table fixed z-50 pin-t pin-l w-full h-full;
  background-color: rgba(0, 0, 0, .5);
  transition: opacity .3s ease;
}
.PluginManagerModalWindow__wrapper {
  @apply pin
}
.PluginManagerModalWindow__container__actions {
  @apply absolute pin-r block text-right my-4 mr-4
}
.PluginManagerModalWindow__container__header {
  @apply flex px-10 py-8 rounded-t-lg bg-theme-secondary-feature;
}

.PluginManagerModalWindow__container__content {
  @apply overflow-hidden px-10 py-8 rounded-b-lg bg-theme-modal
}

.PluginManagerModalWindow__container__footer--warning {
  @apply px-10 py-8 bg-yellow-lighter text-grey-darkest rounded-lg mt-2 text-sm;
}
</style>
