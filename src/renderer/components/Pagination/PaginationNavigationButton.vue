<template>
  <button
    v-if="isVisible"
    :class="`Pagination__Button--${type} pager-button`"
    @click="emitClick"
  >
    <span
      v-if="type === 'next'"
      class="mr-1 hidden lg:inline"
    >
      {{ $t(`PAGINATION.${type.toUpperCase()}`) }}
    </span>

    <svg
      class="inline"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="13px"
      height="13px"
    >
      <path
        v-if="type === 'first'"
        fill-rule="evenodd"
        fill="currentColor"
        d="M8.1,6.5l3.7-4c0.3-0.3,0.3-0.9,0-1.3c-0.3-0.3-0.9-0.3-1.2,0L6.3,5.9c-0.3,0.3-0.3,0.9,0,1.2l4.3,4.6c0.2,0.2,0.4,0.3,0.6,0.3c0.2,0,0.4-0.1,0.6-0.3c0.3-0.3,0.3-0.9,0-1.3L8.1,6.5z M3.1,6.5l3.7-4c0.3-0.3,0.3-0.9,0-1.3c-0.3-0.3-0.9-0.3-1.2,0L1.3,5.9c-0.3,0.3-0.3,0.9,0,1.2l4.3,4.6C5.7,11.9,5.9,12,6.1,12c0.2,0,0.4-0.1,0.6-0.3c0.3-0.3,0.3-0.9,0-1.3L3.1,6.5z"
      />

      <path
        v-if="type === 'previous'"
        fill-rule="evenodd"
        fill="currentColor"
        d="M6.1,6.5l3.7-4c0.3-0.3,0.3-0.9,0-1.3c-0.3-0.3-0.9-0.3-1.2,0L4.3,5.9c-0.3,0.3-0.3,0.9,0,1.2l4.3,4.6C8.7,11.9,8.9,12,9.1,12c0.2,0,0.4-0.1,0.6-0.3c0.3-0.3,0.3-0.9,0-1.3L6.1,6.5z"
      />

      <path
        v-else-if="type === 'next'"
        fill-rule="evenodd"
        fill="currentColor"
        d="M9.7,5.9L5.5,1.3c-0.3-0.3-0.9-0.3-1.2,0c-0.3,0.3-0.3,0.9,0,1.3l3.7,4l-3.7,4c-0.3,0.3-0.3,0.9,0,1.3C4.4,11.9,4.6,12,4.9,12c0.2,0,0.4-0.1,0.6-0.3l4.3-4.6C10.1,6.8,10.1,6.2,9.7,5.9z"
      />

      <path
        v-else-if="type === 'last'"
        fill-rule="evenodd"
        fill="currentColor"
        d="M6.7,5.9L2.5,1.3c-0.3-0.3-0.9-0.3-1.2,0c-0.3,0.3-0.3,0.9,0,1.3l3.7,4l-3.7,4c-0.3,0.3-0.3,0.9,0,1.3C1.4,11.9,1.6,12,1.9,12c0.2,0,0.4-0.1,0.6-0.3l4.3-4.6C7.1,6.8,7.1,6.2,6.7,5.9z M11.7,5.9L7.5,1.3c-0.3-0.3-0.9-0.3-1.2,0s-0.3,0.9,0,1.3l3.7,4l-3.7,4c-0.3,0.3-0.3,0.9,0,1.3C6.4,11.9,6.6,12,6.9,12c0.2,0,0.4-0.1,0.6-0.3l4.3-4.6C12.1,6.8,12.1,6.2,11.7,5.9z"
      />
    </svg>

    <span
      v-if="type === 'previous'"
      class="ml-1 hidden lg:inline"
    >
      {{ $t(`PAGINATION.${type.toUpperCase()}`) }}
    </span>
  </button>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'PaginationNavigationButton',

  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },

  methods: {
    emitClick () {
      this.$emit('click')
    }
  }
}
</script>
