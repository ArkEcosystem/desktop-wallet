<template>
  <button
    v-if="isVisible"
    :class="{ 'hover-scale': hoverScale }"
    class="Pagination__Button--search transition"
    @click="emitClick"
  >
    <span v-if="hasDefaultSlot">
      <slot />
    </span>

    <span v-else>...</span>

    <span class="icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="13px"
        height="13px"
      >
        <path
          fill-rule="evenodd"
          fill="currentColor"
          d="M12.7,11l-1-1c0.8-1.1,1.1-2.3,1.1-3.6c0-0.9-0.2-1.7-0.5-2.5C12,3.1,11.5,2.4,11,1.9c-0.6-0.6-1.3-1-2.1-1.4C8.1,0.2,7.3,0,6.4,0C5.5,0,4.7,0.2,3.9,0.5C3.1,0.8,2.4,1.3,1.9,1.9c-0.6,0.6-1,1.3-1.4,2.1C0.2,4.7,0,5.5,0,6.4c0,0.9,0.2,1.7,0.5,2.5c0.3,0.8,0.8,1.5,1.4,2.1c0.6,0.6,1.3,1,2.1,1.4c0.8,0.3,1.6,0.5,2.5,0.5c1.3,0,2.5-0.4,3.6-1.1l1,1c0.2,0.2,0.5,0.3,0.8,0.3c0.3,0,0.6-0.1,0.8-0.3c0.2-0.2,0.3-0.5,0.3-0.8C13,11.5,12.9,11.2,12.7,11zM9.1,9.1c-0.7,0.7-1.6,1.1-2.6,1.1c-1,0-1.9-0.4-2.6-1.1C3.2,8.4,2.8,7.5,2.8,6.5c0-1,0.4-1.9,1.1-2.6c0.7-0.7,1.6-1.1,2.6-1.1c1,0,1.9,0.4,2.6,1.1c0.7,0.7,1.1,1.6,1.1,2.6C10.2,7.5,9.9,8.4,9.1,9.1z"
        />
      </svg>
    </span>
  </button>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'PaginationSearchButton',

  props: {
    isVisible: {
      type: Boolean,
      required: false,
      default: true
    },

    hoverScale: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    hasDefaultSlot () {
      return !!this.$slots.default
    }
  },

  methods: {
    emitClick () {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.Pagination__Button--search {
  @apply .relative .text-theme-button-text .p-3 .cursor-pointer .flex .flex-no-wrap .items-center;;
}

.Pagination__Button--search:hover {
  @apply .bg-blue .text-white .rounded;
  box-shadow: 0 5px 15px rgba(9, 100, 228, 0.34);
}

.Pagination__Button--search .icon {
  @apply .hidden .absolute;
  left: 50%;
}

.Pagination__Button--search .icon svg {
  @apply .relative;
  left: -50%;
}

.Pagination__Button--search:hover span:not(.icon) {
  @apply .opacity-0;
}

.Pagination__Button--search:hover .icon {
  @apply .block;
}

.hover-scale:hover {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
