<template>
	<SearchFilterItem :label="$t('SEARCH.DELEGATE')">
		Delegate
	</SearchFilterItem>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import SearchFilterItem from "./SearchFilterItem";

@Component({
    name: "SearchFilterDelegate",

    components: {
		SearchFilterItem,
	}
})
export default class SearchFilterDelegate extends Vue {}
</script>
