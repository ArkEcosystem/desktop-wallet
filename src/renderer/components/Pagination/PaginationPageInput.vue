<template>
  <div
    v-show="isVisible"
    class="Pagination__Input"
  >
    <input
      v-model.trim="query"
      v-tooltip="{
        show: hasError,
        content: $t('PAGINATION.NO_RESULTS'),
        trigger: 'manual',
        placement: 'bottom-start',
        classes: 'search-tip'
      }"
      :placeholder="placeholder"
      :class="{ 'text-grey': nightMode }"
      class="search-input"
      type="number"
      min="1"
      step="1"
      @keyup.enter="search"
    >

    <button
      :disabled="!hasInput"
      class="control-button text-theme-button-close"
      @click="search"
    >
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
    </button>

    <button
      class="control-button text-theme-button-close"
      @click="emitClose"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="13px"
        height="13px"
      >
        <path
          fill-rule="evenodd"
          fill="currentColor"
          d="M8.8,6.5l2.7-2.7c0.6-0.6,0.6-1.7,0-2.3c-0.6-0.6-1.7-0.6-2.3,0L6.5,4.2L3.8,1.5c-0.6-0.6-1.7-0.6-2.3,0c-0.6,0.6-0.6,1.7,0,2.3l2.7,2.7L1.5,9.2c-0.6,0.6-0.6,1.7,0,2.3c0.6,0.6,1.7,0.6,2.3,0l2.7-2.7l2.7,2.7c0.6,0.6,1.7,0.6,2.3,0c0.6-0.6,0.6-1.7,0-2.3L8.8,6.5z"
        />
      </svg>
    </button>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'

export default {
  name: 'PaginationPageInput',

  props: {
    isVisible: {
      type: Boolean,
      required: true
    },

    pageCount: {
      type: Number,
      required: true
    },

    isMobile: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  data: () => ({
    query: null,
    placeholder: null,
    hasError: false
  }),

  computed: {
    ...mapGetters('ui', ['nightMode']),

    hasInput () {
      return !!this.query
    }
  },

  watch: {
    isMobile (showMobile) {
      this.setPlaceholder(showMobile)
    }
  },

  mounted () {
    this.setPlaceholder()
  },

  methods: {
    search () {
      if (!this.query) {
        return
      }

      const pageNumber = parseInt(this.query, 10)

      if (!pageNumber || pageNumber < 1 || pageNumber > this.pageCount) {
        this.hasError = true
        setTimeout(() => (this.hasError = false), 1500)
      } else {
        this.emitPageChange(pageNumber)
      }
    },

    setPlaceholder (showMobile) {
      this.placeholder = showMobile
        ? this.$i18n.t('PAGINATION.PLACEHOLDER.SHORT')
        : this.$i18n.t('PAGINATION.PLACEHOLDER.LONG')
    },

    emitPageChange (page) {
      this.$emit('page-change', page)
    },

    emitClose () {
      this.$emit('close')
    }
  }
}
</script>

<style>
.Pagination__Input {
  @apply .flex .items-center .absolute .pin .z-10 .bg-theme-button .px-3 .rounded;
}

.Pagination__Input input[type=number]::-webkit-inner-spin-button,
.Pagination__Input input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
}

.control-button {
  @apply .flex .flex-none .p-2;
}

.control-button:disabled {
  @apply .cursor-default;
}

.search-input {
  @apply .w-full .flex-auto .bg-transparent .p-2;
}

.search-input::placeholder {
  color: var(--color-theme-text-placeholder);
}
</style>
