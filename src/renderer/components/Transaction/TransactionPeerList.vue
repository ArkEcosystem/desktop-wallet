<template>
  <InputEditableList
    v-model="items"
    :title="title"
    :readonly="readonly"
    @remove="emitRemove"
  >
    <div
      slot-scope="{ item }"
      class="flex flex-1"
    >
      {{ item }}
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
