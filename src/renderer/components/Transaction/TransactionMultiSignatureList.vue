<template>
  <InputEditableList
    v-model="items"
    :title="title"
    :show-count="showCount"
    :readonly="readonly"
    :required="required"
    :helper-text="helperText"
    :is-invalid="isInvalid"
    :no-items-message="$t('TRANSACTION.MULTI_SIGNATURE.NO_SIGNATURES')"
    @remove="emitRemove"
  >
    <div
      slot-scope="{ item }"
      class="flex-1"
    >
      <span>
        {{ formatItem(item.publicKey, 20) }}
      </span>

      <span v-if="item.address">
        ({{ formatItem(item.address) }})
      </span>
    </div>
  </InputEditableList>
</template>

<script>
import { InputEditableList } from '@/components/Input'
import truncateMiddle from '@/filters/truncate-middle'

export default {
  name: 'TransactionMultiSignatureList',

  components: {
    InputEditableList
  },

  props: {
    title: {
      type: String,
      required: false,
      default: 'Public Keys'
    },

    items: {
      type: Array,
      required: true
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
    },

    formatItem (value, limit = 10) {
      return truncateMiddle(value, limit)
    }
  }
}
</script>
