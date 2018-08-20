<template>
  <transition
    name="popup"
    enter-class="popup-transition"
    leave-active-class="popup-transition">
    <div
      class="popup-mask fixed z-50 pin-t pin-l table w-full h-full"
      @click="$emit('close')">
      <div class="flex items-center justify-center absolute pin">
        <div
          class="popup-container flex flex-col shadow mx-auto rounded overflow-hidden relative transition bg-white text-theme-text-content"
          @click.stop="void 0">

          <button
            class="absolute pin-t pin-r p-4"
            @click="$emit('close')">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              class="fill-current text-grey h-4 w-4">
              <path
                fill-rule="evenodd"
                d="M15.000,1.500 L13.500,-0.000 L7.500,5.999 L1.500,-0.000 L-0.000,1.500 L6.000,7.499 L-0.000,13.500 L1.500,15.000 L7.500,9.000 L13.500,15.000 L15.000,13.500 L9.000,7.499 L15.000,1.500 Z"/>
            </svg>
          </button>

          <section class="px-10 py-8">

            <header
              v-if="$slots['header'] || title">
              <slot name="header">
                <h1>{{ title }}</h1>
              </slot>
            </header>

            <article class="content flex-1 mt-3">
              <slot />
            </article>

          </section>

          <footer
            v-if="$slots['footer'] || message"
            class="px-10 py-8 bg-yellow-lighter text-grey-darkest">
            <slot name="footer">
              <p v-html="message" />
            </slot>
          </footer>

        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PopupModal',

  props: {
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
  }
}
</script>

<style scoped>
.popup-mask {
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.popup-transition {
  opacity: 0;
  transform: scale(1.1);
}
</style>
