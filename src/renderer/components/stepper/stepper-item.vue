<template>
  <section
    :class="{ 'border-b': !isLastItem }"
    class="stepper-item py-3">
    <header
      :class="isActive ? 'text-xl font-bold' : 'text-theme-page-text-light'"
      class="stepper-item-header pointer-events-none capitalize py-2">
      <slot name="header">
        {{ title }}
      </slot>
    </header>

    <transition
      :duration="{ enter: '100ms', leave: '200ms' }"
      name="stepper-item"
      mode="out-in">
      <article
        v-if="isActive"
        class="stepper-item-content my-2 flex flex-col">
        <div class="max-h-xs overflow-y-auto my-2">
          <slot />
        </div>

        <footer class="stepper-item-footer my-4">
          <slot name="footer">
            <button
              v-if="isBackVisible"
              class="back-button blue-button"
              @click="$emit('back')">
              Back
            </button>

            <button
              v-if="isNextVisible || isNextEnabled"
              :disabled="!isNextEnabled"
              class="next-button blue-button"
              @click="$emit('next')">
              {{ isLastItem ? 'Done' : 'Next' }}
            </button>
          </slot>
        </footer>
      </article>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'StepperItem',

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
    },

    isComplete: {
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
    toggle (step) {
      this.isActive = step.toString() === this.step.toString()
    }
  }
}
</script>

<style lang="postcss" scoped>
.stepper-item-header,
.stepper-item-content {
  transition: all .3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.stepper-item-enter-active,
.stepper-item-leave-active {
  max-height: calc(config('maxHeight.xs') + 50px);
  overflow: hidden;
}

.stepper-item-enter,
.stepper-item-leave-to {
  max-height: 0;
}
</style>
