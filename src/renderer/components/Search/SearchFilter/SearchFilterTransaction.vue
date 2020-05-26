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
import { Vue, Component } from "vue-property-decorator";
import SearchFilterItem from "./SearchFilterItem";

@Component({
    name: "SearchFilterTransaction",

    components: {
		SearchFilterItem,
	}
})
export default class SearchFilterTransaction extends Vue {}
</script>
