<template>
	<SearchFilterItem :label="$t('SEARCH.DELEGATE')">
		Delegate
	</SearchFilterItem>
</template>

<script>
import { Component,Vue } from "vue-property-decorator";

import SearchFilterItem from "./SearchFilterItem";

@Component({
    name: "SearchFilterDelegate",

    components: {
		SearchFilterItem,
	}
})
export default class SearchFilterDelegate extends Vue {}
</script>
