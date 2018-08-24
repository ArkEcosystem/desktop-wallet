<template>
  <section
    :class="{ 'border-b': !isLastItem }"
    class="CollapsibleStepperItem py-3"
  >
    <header
      :class="isActive ? 'text-xl font-bold' : 'text-theme-page-text-light'"
      class="CollapsibleStepperItem__header pointer-events-none capitalize py-2"
    >
      <!-- Default header -->
      <slot name="header">
        {{ title }}
      </slot>
    </header>

    <transition
      :duration="{ enter: '100ms', leave: '200ms' }"
      name="CollapsibleStepperItem__transition"
      mode="out-in"
    >
      <article
        v-if="isActive"
        class="CollapsibleStepperItem__content my-2 flex flex-col"
      >

        <!-- Content of the stepper -->
        <div class="max-h-xs overflow-y-auto my-2">
          <slot />
        </div>

        <footer class="CollapsibleStepperItem__footer my-4">

          <!-- Default footer -->
          <slot name="footer">
            <button
              v-if="isBackVisible"
              class="CollapsibleStepperItem__footer__back-button blue-button"
              @click="emitBack"
            >
              {{ $t('common.Back') }}
            </button>

            <button
              v-if="isNextVisible || isNextEnabled"
              :disabled="!isNextEnabled"
              class="CollapsibleStepperItem__footer__next-button blue-button"
              @click="emitNext"
            >
              {{ isLastItem ? $t('common.Done') : $t('common.Next') }}
            </button>
          </slot>

        </footer>
      </article>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'CollapsibleStepperItem',

  props: {
    title: {
      type: String,
      required: true
    },

    step: {
      type: [Number, String],
      required: true
    },

    isBackVisible: {
      type: Boolean,
      required: false,
      default: true
    },

    isNextVisible: {
      type: Boolean,
      required: false,
      default: true
    },

    isNextEnabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => ({
    isActive: null,
    isLastItem: false
  }),

  methods: {
    toggle (isActive) {
      this.isActive = isActive
    },

    emitBack () {
      this.$emit('back')
    },

    emitNext () {
      this.$emit('next')
    }
  }
}
</script>

<style lang="postcss" scoped>
.CollapsibleStepperItem__header,
.CollapsibleStepperItem__content {
  transition: all .3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.CollapsibleStepperItem__transition-enter-active,
.CollapsibleStepperItem__transition-leave-active {
  max-height: calc(config('maxHeight.xs') + 50px);
  overflow: hidden;
}

.CollapsibleStepperItem__transition-enter,
.CollapsibleStepperItem__transition-leave-to {
  max-height: 0;
}
</style>
