<template>
	<div class="Search flex relative w-full h-full overflow-none bg-theme-feature rounded-lg p-10">
		<header class="Search__header flex relative items-baseline w-full">
			<SearchInput class="mr-5" />
			<SearchFilterButton @click="toggleFilter">
				<SearchFilter v-show="showFilter" :outside-click="showFilter" class="-mt-1 mr-5" @close="hideFilter" />
			</SearchFilterButton>
		</header>
	</div>
</template>

<script>
import { Component,Vue } from "vue-property-decorator";

import { SearchFilter, SearchFilterButton, SearchInput } from "@/components/Search";

@Component({
    name: "SearchPage",

    components: {
		SearchInput,
		SearchFilter,
		SearchFilterButton,
	}
})
export default class SearchPage extends Vue {
    showFilter = false;

    beforeRouteEnter(to, from, next) {
		next((vm) => {
			vm.$synchronizer.focus();
			vm.$synchronizer.pause("market");
		});
	}

    toggleFilter() {
        this.showFilter = !this.showFilter;
    }

    hideFilter() {
        this.showFilter = false;
    }
}
</script>
