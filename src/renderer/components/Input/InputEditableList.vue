<template>
  <div
    class="InputEditableList"
    :class="{ 'InputEditableList--invalid': isInvalid || requiredAndEmpty }"
  >
    <div
      class="InputField__wrapper relative appearance-none inline-flex items-end w-full"
    >
      <label
        v-show="title"
        class="InputField__label absolute pointer-events-none text-theme-page-text-light truncate"
      >
        {{ title }}<span v-if="showCount && items.length"> - {{ items.length }}<span v-if="maxItems"> / {{ maxItems }}</span></span>
      </label>
    </div>

    <div class="InputEditableList__list">
      <div
        v-for="(item, key) of items"
        :key="key"
        class="InputEditableList__list__item flex py-2 select-none"
      >
        <slot :item="item" />

        <ButtonClose
          v-if="!readonly"
          icon-class="text-grey"
          class="InputEditableList__list__item__remove flex-inline"
          @click="emitRemove(key)"
        />
      </div>
    </div>

    <div
      v-if="requiredAndEmpty"
      class="InputEditableList__no-items"
    >
      {{ noItemsMessage }}
    </div>

    <p
      v-if="helperText"
      class="InputEditableList__helper-text"
    >
      {{ helperText }}
    </p>
  </div>
</template>

<script>
import { ButtonClose } from '@/components/Button'

export default {
  name: 'InputEditableList',

  components: {
    ButtonClose
  },

  props: {
    title: {
      type: String,
      required: false,
      default: null
    },

    showCount: {
      type: Boolean,
      required: false,
      default: false
    },

    maxItems: {
      type: Number,
      required: false,
      default: null
    },

    value: {
      type: Array,
      required: true
    },

    required: {
      type: Boolean,
      required: false,
      default: true
    },

    readonly: {
      type: Boolean,
      required: false,
      default: false
    },

    helperText: {
      type: String,
      required: false,
      default: null
    },

    isInvalid: {
      type: Boolean,
      required: false,
      default: false
    },

    noItemsMessage: {
      type: String,
      required: false,
      default: function () {
        return this.$t('INPUT_EDITABLE_LIST.NO_ITEMS')
      }
    }
  },

  data: vm => ({
    items: vm.value
  }),

  computed: {
    requiredAndEmpty () {
      return this.required && (!this.items || !this.items.length)
    }
  },

  watch: {
    value (newValue) {
      this.items = newValue
    }
  },

  methods: {
    emitRemove (index) {
      this.$emit('remove', index)
    }
  }
}
</script>

<style scoped>
.InputEditableList__list {
  @apply .overflow-y-auto;
}
.InputEditableList__list .ButtonClose {
  @apply .mr-0 !important;
}
.InputEditableList--invalid .InputEditableList__no-items,
.InputEditableList--invalid .InputField__label,
.InputEditableList--invalid .InputEditableList__helper-text {
  @apply .text-red-dark;
}
.InputField__label {
    font-weight: 600;
    bottom: 0;
    transform: scale(.75);
}
</style>
