<template>
  <div
    v-click-outside="closePageInput"
    class="Pagination mx-5 sm:mx-10 mt-5 md:mt-10"
  >
    <div class="PaginationBar--small relative">
      <PaginationPageInput
        :is-visible="showPageInput"
        :page-count="pageCount"
        :is-mobile="isMobile"
        class="Pagination__Input"
        @page-change="emitPageChange"
        @close="closePageInput"
      />

      <PaginationSearchButton
        :class="{ 'opacity-0': showPageInput }"
        class="w-full justify-center"
        :hover-scale="false"
        @click="openPageInput"
      >
        {{ $t('PAGINATION.PAGE') }} {{ currentPage }} {{ $t('PAGINATION.OF') }} {{ pageCount }}
      </PaginationSearchButton>
    </div>

    <div class="flex justify-center">
      <PaginationNavigationButton
        :is-visible="showFirst"
        type="first"
        class="mr-2"
        @click="emitFirst"
      />

      <PaginationNavigationButton
        :is-visible="showPrevious"
        type="previous"
        class="mr-2"
        @click="emitPrevious"
      />

      <div class="PaginationBar--large relative">
        <PaginationPageInput
          :is-visible="showPageInput"
          :page-count="pageCount"
          :is-mobile="isMobile"
          class="Pagination__Input"
          @page-change="emitPageChange"
          @close="closePageInput"
        />

        <div
          :class="{ 'opacity-0': showPageInput }"
          class="hidden md:flex px-3 bg-theme-button rounded"
        >
          <PaginationSearchButton
            :is-visible="pageButtons[0] !== 1"
            @click="openPageInput"
          />

          <button
            v-for="page in pageButtons"
            :key="page"
            :disabled="page === currentPage"
            :class="{ 'active': page === currentPage }"
            class="Pagination__Button transition"
            @click="emitPageChange(page)"
          >
            <span>{{ page }}</span>
          </button>

          <PaginationSearchButton
            :is-visible="pageButtons[pageButtons.length - 1] !== pageCount"
            @click="openPageInput"
          />
        </div>

        <div class="flex md:hidden bg-theme-button rounded">
          <PaginationSearchButton
            :hover-scale="false"
            :class="{ 'opacity-0': showPageInput }"
            @click="openPageInput"
          >
            {{ $t('PAGINATION.PAGE') }} {{ currentPage }} {{ $t('PAGINATION.OF') }} {{ pageCount }}
          </PaginationSearchButton>
        </div>
      </div>

      <PaginationNavigationButton
        :is-visible="showNext"
        type="next"
        class="ml-2"
        @click="emitNext"
      />

      <PaginationNavigationButton
        :is-visible="showLast"
        type="last"
        class="ml-2"
        @click="emitLast"
      />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  PaginationNavigationButton,
  PaginationPageInput,
  PaginationSearchButton
} from '@/components/Pagination'

export default {
  name: 'Pagination',

  components: {
    PaginationNavigationButton,
    PaginationPageInput,
    PaginationSearchButton
  },

  props: {
    meta: {
      type: Object,
      required: true
    },

    currentPage: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    pageInputVisible: false,
    mobileView: false
  }),

  computed: {
    showPageInput () {
      return this.pageInputVisible
    },

    buttonCount () {
      return this.currentPage < 100 ? 7 : 5
    },

    pageCount () {
      return this.meta.pageCount
    },

    next () {
      return this.meta.next
    },

    previous () {
      return this.meta.previous
    },

    self () {
      return this.meta.self
    },

    first () {
      return this.meta.first
    },

    last () {
      return this.meta.last
    },

    showFirst () {
      return (this.first !== this.previous && !this.pageButtons.includes(1)) || (this.first !== this.self && this.isMobile)
    },

    showPrevious () {
      return this.currentPage > 1
    },

    showNext () {
      return this.currentPage < this.pageCount
    },

    showLast () {
      return (this.last !== this.next && !this.pageButtons.includes(this.pageCount)) || (this.last !== this.self && this.isMobile)
    },

    subRangeLength () {
      return Math.floor(this.buttonCount / 2)
    },

    pageButtons () {
      let buttons

      if (this.pageCount <= this.buttonCount) {
        buttons = Array.apply(null, Array(this.pageCount)).map((_, i) => i + 1)
      } else if (this.currentPage <= this.subRangeLength + 1) {
        buttons = Array.apply(null, Array(this.buttonCount)).map((_, i) => i + 1)
      } else if (this.currentPage >= this.pageCount - this.subRangeLength) {
        buttons = Array.apply(null, Array(this.buttonCount)).map((_, i) => {
          return this.pageCount - this.buttonCount + i + 1
        })
      } else {
        buttons = Array.apply(null, Array(this.buttonCount)).map((_, i) => {
          return this.currentPage - this.subRangeLength + i
        })
      }

      return buttons
    },

    isMobile () {
      return this.mobileView
    }
  },

  mounted () {
    const WIDTH_THRESHOLD = 768
    const widthQuery = window.matchMedia(`(max-width: ${WIDTH_THRESHOLD}px)`)

    widthQuery.addListener(e => this.setMobileView(e.matches))

    this.setMobileView(window.innerWidth < WIDTH_THRESHOLD)
  },

  methods: {
    emitFirst () {
      this.emitPageChange(1)
    },

    emitPrevious () {
      this.emitPageChange(this.currentPage - 1)
    },

    emitNext () {
      this.emitPageChange(this.currentPage + 1)
    },

    emitLast () {
      this.emitPageChange(this.pageCount)
    },

    emitPageChange (page) {
      this.$emit('page-change', page)
    },

    openPageInput () {
      this.pageInputVisible = true
    },

    closePageInput () {
      this.pageInputVisible = false
    },

    setMobileView (isMobile) {
      this.mobileView = !!isMobile
    }
  }
}
</script>

<style>
.Pagination {
  @apply .flex .flex-col .flex-no-wrap .justify-center;
}

.Pagination__Button {
  @apply .text-theme-button-text .p-3 .cursor-pointer .flex .flex-no-wrap .items-center;
}

button[class*="Pagination__Button--"] {
  @apply .flex-1;
}

.Pagination__Button.active {
  @apply .bg-theme-button-active .text-theme-button-text;
}

.Pagination__Button:not(:disabled):hover {
  @apply .bg-blue .text-white .rounded;
  box-shadow: 0 5px 15px rgba(9, 100, 228, 0.34);
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.Pagination__Button:disabled {
  @apply .text-theme-button-text;
}

.PaginationBar--small {
  @apply .hidden .bg-theme-button .rounded .mb-2;
}

.PaginationBar--small {
  @apply .flex;
}

.PaginationBar--large {
  @apply .hidden;
}

@media (min-width: 450px) {
  button[class*="Pagination__Button--"] {
    @apply .flex-none;
  }

  .PaginationBar--small {
    @apply .hidden;
  }

  .PaginationBar--large {
    @apply .flex;
  }
}
</style>
