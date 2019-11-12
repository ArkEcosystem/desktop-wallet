<template>
  <div class="InputEditableList">
    <ListDivided
      v-if="title"
      :is-floating-label="true"
    >
      <ListDividedItem
        :label="title"
        class="pb-0"
      />
    </ListDivided>

    <div class="InputEditableList__list">
      <div
        v-for="(item, key) of items"
        :key="key"
        class="flex py-2 select-none"
      >
        <slot :item="item" />

        <ButtonClose
          v-if="!readonly"
          icon-class="text-grey"
          class="flex-inline"
          @click="emitRemove(key)"
        />
      </div>
    </div>

    <div
      v-if="!items || !items.length"
      class="mt-2 text-center"
    >
      {{ $t('INPUT_EDITABLE_LIST.NO_ITEMS') }}
    </div>
  </div>
</template>

<script>
import { ButtonClose } from '@/components/Button'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'

export default {
  name: 'InputEditableList',

  components: {
    ButtonClose,
    ListDivided,
    ListDividedItem
  },

  props: {
    title: {
      type: String,
      required: false,
      default: null
    },

    value: {
      type: Array,
      required: true
    },

    isRequired: {
      type: Boolean,
      required: false,
      default: true
    },

    readonly: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: vm => ({
    inputValue: vm.value
  }),

  computed: {
    items: {
      get () {
        return this.inputValue
      },

      set (value) {
        this.inputValue = value
        this.$v.items.$touch()
        this.$emit('input', value)
      }
    }
  },

  watch: {
    value (newValue) {
      this.inputValue = newValue
    }
  },

  methods: {
    emitRemove (index) {
      this.$emit('remove', index)
    }
  },

  validations: {
    items: {
      required (value) {
        return this.isRequired ? value.length : true
      }
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
</style>
