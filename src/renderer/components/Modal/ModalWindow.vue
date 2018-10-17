<template>
  <transition name="ModalWindow">
    <div
      class="ModalWindow__mask fixed z-50 pin-t pin-l table w-full h-full"
      @click="emitClose"
    >
      <div class="flex items-center justify-center absolute pin">
        <div
          :class="containerClasses"
          class="ModalWindow__container flex flex-col shadow mx-auto rounded-lg overflow-hidden relative transition bg-theme-modal text-theme-text-content"
          @click.stop="void 0"
        >

          <button
            class="absolute pin-t pin-r p-6"
            @click="emitClose"
          >
            <svg class="fill-current text-grey h-4 w-4">
              <path
                fill-rule="evenodd"
                d="M15.000,1.500 L13.500,-0.000 L7.500,5.999 L1.500,-0.000 L-0.000,1.500 L6.000,7.499 L-0.000,13.500 L1.500,15.000 L7.500,9.000 L13.500,15.000 L15.000,13.500 L9.000,7.499 L15.000,1.500 Z"
              />
            </svg>
          </button>

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
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ModalWindow',

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

<style scoped>
.ModalWindow__mask {
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

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
