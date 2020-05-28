<template>
	<div
		v-click-outside.capture="emitClose"
		:class="isSidebarExpanded ? 'WalletSidebarFilters--expanded' : 'WalletSidebarFilters--collapsed'"
		class="absolute z-20 rounded-lg WalletSidebarFilters"
	>
		<div class="p-10 font-bold rounded-lg shadow bg-theme-settings">
			<WalletSidebarFiltersSearchInput
				v-model="filters.searchQuery"
				:placeholder="
					hasContacts
						? $t('WALLET_SIDEBAR.SEARCH.PLACEHOLDER_CONTACTS')
						: $t('WALLET_SIDEBAR.SEARCH.PLACEHOLDER_WALLETS')
				"
				@input="setSearchQuery"
			/>
		</div>

		<MenuOptions class="mt-2 font-bold rounded-lg shadow WalletSidebarFilters__sorting">
			<div class="py-5 mx-10 mb-2 select-none text-theme-settings-heading">
				{{ $t("WALLET_SIDEBAR.SORT.BY") }}
			</div>
			<MenuOptionsItem
				v-for="option in $options.sortOptions"
				:key="option"
				:title="`${$t('WALLET_SIDEBAR.SORT.' + option.toUpperCase().replace('-', '_'))}`"
				:class="stringifiedSortOrder === option ? 'WalletSidebarFilters__sorting__order--selected' : ''"
				@click="setSort(option)"
			/>
		</MenuOptions>

		<MenuOptions class="mt-2 font-medium rounded-lg shadow WalletSidebarFilters__settings">
			<MenuOptionsItem
				:title="
					hasContacts
						? $t('WALLET_SIDEBAR.FILTERS.HIDE_EMPTY_CONTACTS')
						: $t('WALLET_SIDEBAR.FILTERS.HIDE_EMPTY_WALLETS')
				"
				@click="toggleSelect('hide-empty')"
			>
				<div slot="controls" class="pointer-events-none">
					<ButtonSwitch
						ref="hide-empty"
						:is-active="currentFilters.hideEmpty"
						background-color="var(--theme-settings-switch)"
						@change="setHideEmpty"
					/>
				</div>
			</MenuOptionsItem>
			<MenuOptionsItem
				v-if="hasLedger && !hasContacts"
				:title="$t('WALLET_SIDEBAR.FILTERS.HIDE_LEDGER')"
				@click="toggleSelect('hide-ledger')"
			>
				<div slot="controls" class="pointer-events-none">
					<ButtonSwitch
						ref="hide-ledger"
						:is-active="currentFilters.hideLedger"
						background-color="var(--theme-settings-switch)"
						@change="setHideLedger"
					/>
				</div>
			</MenuOptionsItem>
		</MenuOptions>
	</div>
</template>

<script>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { ButtonSwitch } from "@/components/Button";
import { MenuOptions, MenuOptionsItem } from "@/components/Menu";

import WalletSidebarFiltersSearchInput from "./WalletSidebarFiltersSearchInput";

@Component({
	name: "WalletSidebarFilters",

	components: {
		ButtonSwitch,
		MenuOptions,
		MenuOptionsItem,
		WalletSidebarFiltersSearchInput,
	},
})
export default class WalletSidebarFilters extends Vue {
	sortOptions = ["name-asc", "name-desc", "balance-asc", "balance-desc"];

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	hasContacts;

	// Show the Ledger options or not
	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	hasLedger;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isSidebarExpanded;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	outsideClick;

	@Prop({
		type: Object,
		required: true,
	})
	filters;

	@Prop({
		type: String,
		required: false,
		default: "",
	})
	searchQuery;

	@Prop({
		type: Object,
		required: false,
		default: () => ({ field: "name", type: "asc" }),
	})
	sortOrder;

	currentSearchQuery = undefined;

	currentFilters = undefined;

	currentSortOrder = undefined;

	@Watch("filters")
	onFiltersChanged(filters) {
		this.currentFilters = filters;
	}

	@Watch("searchQuery")
	onSearchQueryChanged(query) {
		this.currentSearchQuery = query;
	}

	data() {
		return {
			currentSearchQuery: this.searchQuery,
			currentFilters: this.filters,
			currentSortOrder: this.sortOrder,
		};
	}

	get stringifiedSortOrder() {
		return Object.values(this.currentSortOrder).join("-");
	}

	setSearchQuery(query) {
		this.currentSearchQuery = query;
		this.emitSearch();
	}

	setHideEmpty(isHidden) {
		this.setFilter("hideEmpty", isHidden);
	}

	setHideLedger(isHidden) {
		this.setFilter("hideLedger", isHidden);
	}

	setFilter(filter, value) {
		Vue.set(this.currentFilters, filter, value);
		this.emitFilter();
	}

	setSort(value) {
		const [field, type] = value.split("-");
		this.currentSortOrder = { field, type };
		this.emitSort();
	}

	toggleSelect(name) {
		this.$refs[name].toggle();
	}

	emitFilter() {
		this.$emit("filter", this.currentFilters);
	}

	emitSearch() {
		this.$emit("search", this.currentSearchQuery);
	}

	emitSort() {
		this.$emit("sort", this.currentSortOrder);
	}

	emitClose(context) {
		this.$emit("close", context);
	}
}
</script>

<style lang="postcss" scoped>
.WalletSidebarFilters {
	width: 380px;
	/* The collapsed sidebar uses `.w-1/8` */
	right: calc(12.5% - 0.5rem);
	top: 0.75rem;
	transition: right 0.4s;
}

.WalletSidebarFilters--expanded {
	/* The expanded sidebar uses `.w-1/3` */
	right: calc(33.33333% - 1.25rem);
}

.WalletSidebarFilters__sorting .MenuOptionsItem {
	transition: color 0.2s;
}
.WalletSidebarFilters__sorting__order--selected {
	color: var(--theme-settings-heading) !important;
}

.WalletSidebarFilters .MenuOptions {
	@apply .rounded-lg;
}
/* To not render the bubble arrow */
.WalletSidebarFilters .MenuOptions:after {
	border-width: 0px;
}
</style>
