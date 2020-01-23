<template>
  <div class="Search flex relative w-full h-full overflow-none bg-theme-feature rounded-lg p-10">
    <header class="Search__header flex relative items-baseline w-full">
      <SearchInput class="mr-5" />
      <SearchFilterButton
        @click="toggleFilter"
      >
        <SearchFilter
          v-show="showFilter"
          :outside-click="showFilter"
          class="-mt-1 mr-5"
          @close="hideFilter"
        />
      </SearchFilterButton>
    </header>
  </div>
</template>

<script>
import SearchInput from '@/components/Search/SearchInput'
import SearchFilter from '@/components/Search/SearchFilter'
import SearchFilterButton from '@/components/Search/SearchFilterButton'

export default {
  name: 'SearchPage',

  components: {
    SearchInput,
    SearchFilter,
    SearchFilterButton
  },

  data: () => ({
    showFilter: false
  }),

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$synchronizer.focus()
      vm.$synchronizer.pause('market')
    })
  },

  methods: {
    toggleFilter () {
      this.showFilter = !this.showFilter
    },

    hideFilter () {
      this.showFilter = false
    }
  }
}
</script>
