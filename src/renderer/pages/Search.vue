<template>
  <section class="flex relative w-full h-full overflow-none bg-theme-feature rounded-lg p-10">
    <SearchInput />
  </section>
</template>

<script>
import { SearchInput } from '@/components/Search'

export default {
  name: 'SearchPage',

  components: {
    SearchInput
  }
}
</script>
