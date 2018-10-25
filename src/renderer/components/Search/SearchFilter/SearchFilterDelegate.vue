<template>
  <SearchFilterItem :label="$t('SEARCH.DELEGATE')">
    Delegate
  </SearchFilterItem>
</template>

<script>
import SearchFilterItem from './SearchFilterItem'

export default {
  name: 'SearchFilterDelegate',

  components: {
    SearchFilterItem
  }
}
</script>
