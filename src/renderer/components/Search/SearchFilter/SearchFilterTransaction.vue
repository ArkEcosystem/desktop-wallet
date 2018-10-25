<template>
  <div class="flex">
    <SearchFilterItem :label="$t('SEARCH.WALLETS')">
      <!-- TODO: Add wallets dropdown -->
      Wallets
    </SearchFilterItem>

    <SearchFilterItem :label="$t('SEARCH.PERIOD')">
      <!-- TODO: Add date input -->
      Period
    </SearchFilterItem>
  </div>
</template>

<script>
import SearchFilterItem from './SearchFilterItem'

export default {
  name: 'SearchFilterTransaction',

  components: {
    SearchFilterItem
  }
}
</script>
