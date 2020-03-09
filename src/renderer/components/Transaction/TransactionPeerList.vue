<template>
  <InputEditableList
    v-model="items"
    :title="title"
    :max-items="maxItems"
    :show-count="showCount"
    :readonly="readonly"
    :required="required"
    :helper-text="helperText"
    :is-invalid="isInvalid"
    :no-items-message="$t('TRANSACTION.BRIDGECHAIN.NO_SEED_NODES')"
    @remove="emitRemove"
  >
    <div
      slot-scope="{ item }"
      class="flex flex-1"
      :class="{ 'text-red': item.isInvalid }"
    >
      {{ item.ip }}
    </div>
  </InputEditableList>
</template>

<script>
import { InputEditableList } from '@/components/Input'

export default {
  name: 'TransactionPeerList',

  components: {
    InputEditableList
  },

  props: {
    title: {
      type: String,
      required: false,
      default: 'Peers'
    },

    items: {
      type: Array,
      required: true
    },

    maxItems: {
      type: Number,
      required: false,
      default: null
    },

    showCount: {
      type: Boolean,
      required: false,
      default: false
    },

    readonly: {
      type: Boolean,
      required: false,
      default: false
    },

    required: {
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
    }
  },

  methods: {
    emitRemove (index) {
      this.$emit('remove', index)
    }
  }
}
</script>
