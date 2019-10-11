<template>
  <InputEditableList
    v-model="items"
    :title="title"
    :readonly="readonly"
    @remove="emitRemove"
  >
    <div
      slot-scope="{ item }"
      class="flex-1"
    >
      <span>
        {{ item.publicKey | truncateMiddle(20) }}
      </span>

      <span v-if="item.address">
        ({{ item.address | truncateMiddle(10) }})
      </span>
    </div>
  </InputEditableList>
</template>

<script>
import { InputEditableList } from '@/components/Input'
/* eslint-disable-next-line no-unused-vars */
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

    readonly: {
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
