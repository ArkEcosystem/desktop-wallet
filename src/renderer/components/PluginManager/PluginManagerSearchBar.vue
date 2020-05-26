<template>
	<div class="flex items-center w-full">
		<SvgIcon name="search" view-box="0 0 14 14" class="mr-2 text-theme-page-text-light" />

		<input
			ref="search"
			:value="query"
			class="w-full h-8 bg-transparent text-theme-page-text"
			:placeholder="$t('PAGES.PLUGIN_MANAGER.SEARCH')"
			@keyup.esc="onEscKey"
			@input="update"
		/>
	</div>
</template>

<script>
import { debounce } from "lodash";
import { Component, Vue } from "vue-property-decorator";

import SvgIcon from "@/components/SvgIcon";

@Component({
	name: "PluginManagerSearchBar",

	components: {
		SvgIcon,
	},

	watch: {
		query() {
			this.emitSearch();
		},
	},
})
export default class PluginManagerSearchBar extends Vue {
	query = null;

	update() {
		return debounce(function (event) {
			this.query = event.target.value;
		}, 500);
	}

	emitSearch() {
		const query = this.query ? this.query.toLowerCase() : null;

		if (!query || query.length >= 3) {
			this.$emit("search", query);
		}
	}

	onEscKey() {
		this.query = null;
		this.$refs.search.blur();
	}
}
</script>
