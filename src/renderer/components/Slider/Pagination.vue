<template>
  <div class="Slider-pagination">
    <div
      v-for="page in pageCount"
      :key="page"
      class="Slider-pagination__page"
      :class="{
        'bg-theme-button': currentIndex + 1 !== page,
        'bg-theme-button-active': currentIndex + 1 === page
      }"
      @click="goToPage(page)"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',

  inject: ['sliderImage'],

  computed: {
    pageCount () {
      return this.sliderImage.pageCount
    },

    currentIndex () {
      return this.sliderImage.getCurrentIndex
    }
  },

  methods: {
    goToPage (page) {
      this.$emit('paginationclick', page)
    }
  }
}
</script>

<style scoped>
.Slider-pagination {
  @apply .flex .mt-4 .justify-center;
}

.Slider-pagination__page {
  @apply .rounded-full .p-1 .mx-1 .cursor-pointer;
}
</style>
