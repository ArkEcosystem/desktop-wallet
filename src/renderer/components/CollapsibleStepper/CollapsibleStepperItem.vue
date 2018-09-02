<template>
  <section
    :class="{
      'flex-1': isActive,
      'pt-2': !isFirstItem,
      'pb-2 border-b': !isLastItem
    }"
    class="CollapsibleStepperItem"
  >
    <header
      :class="isActive ? 'text-xl font-bold' : 'text-theme-page-text-light'"
      class="CollapsibleStepperItem__header pointer-events-none capitalize py-2 flex-no-shrink"
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
      <div
        v-if="isActive"
        class="CollapsibleStepperItem__content flex flex-col justify-between h-full"
      >

        <!-- Content of the stepper -->
        <!-- FIXME: overflow-visible instead of overflow-y-auto to display the dropdowns, how to show scrollbars when necessary -->
        <article class="max-h-xs overflow-y-auto flex flex-grow">
          <slot />
        </article>

        <!-- FIXME position -->
        <footer class="CollapsibleStepperItem__footer my-4 flex flex-no-shrink self-start">
          <!-- Default footer -->
          <slot name="footer">
            <button
              v-if="!isFirstItem && isBackVisible"
              class="CollapsibleStepperItem__footer__back-button blue-button"
              @click="emitBack"
            >
              {{ $t('COMMON.BACK') }}
            </button>

            <button
              v-if="isNextVisible || isNextEnabled"
              :disabled="!isNextEnabled"
              class="CollapsibleStepperItem__footer__next-button blue-button"
              @click="emitNext"
            >
              {{ isLastItem ? $t('COMMON.DONE') : $t('COMMON.NEXT') }}
            </button>
          </slot>
        </footer>

      </div>
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
    isFirstItem: false,
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
/* Add the margin to separate back and next/done only when they exist together */
.CollapsibleStepperItem__footer__back-button ~ .CollapsibleStepperItem__footer__next-button  {
  margin-left: 0.5rem;
}
</style>
