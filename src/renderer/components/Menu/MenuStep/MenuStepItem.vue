<template>
  <Collapse
    ref="collapse"
    :id="step"
    :is-disabled="isDisabled"
    :class="{
      'pt-2': !isFirstItem,
      'pb-2 border-b': !isLastItem
    }"
    class="MenuStepItem"
    @open="emitOpen"
    @close="emitClose"
  >
    <header
      slot="handler"
      slot-scope="{ isOpen, isDisabled }"
      :class="{
        'text-xl font-bold': isOpen,
        'text-theme-page-text-light': !isOpen
      }"
      class="MenuStepItem__header capitalize py-2 flex-no-shrink"
    >
      <slot
        :title="title"
        name="header"
      >
        {{ title }}
      </slot>
    </header>
    <section class="MenuStepItem__content flex flex-col h-full mt-2 relative">
      <div class="flex-1">
        <slot />
      </div>

      <footer class="MenuStepItem__footer mt-3 py-4">
        <button
          v-if="!isFirstItem && isBackVisible"
          class="MenuStepItem__footer__back-button blue-button mr-1"
          @click="emitBack"
        >
          {{ $t('COMMON.BACK') }}
        </button>

        <button
          v-if="isNextVisible || isNextEnabled"
          :disabled="!isNextEnabled"
          class="MenuStepItem__footer__next-button blue-button"
          @click="emitNext"
        >
          {{ isLastItem ? $t('COMMON.DONE') : $t('COMMON.NEXT') }}
        </button>
      </footer>
    </section>
  </Collapse>
</template>

<script>
import Collapse from '@/components/Collapse'

export default {
  name: 'MenuStepItem',

  components: {
    Collapse
  },

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
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => ({
    isFirstItem: false,
    isLastItem: false
  }),

  methods: {
    emitBack () {
      this.$emit('back')
    },

    emitNext () {
      this.$emit('next')
    },

    emitOpen () {
      this.$emit('open')
    },

    emitClose () {
      this.$emit('close')
    }
  }
}
</script>
