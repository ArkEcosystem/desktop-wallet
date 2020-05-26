<template>
	<MenuOptions v-click-outside="emitClose" class="SearchFilter absolute right-0 text-theme-settings-text">
		<ul class="SearchFilter__list flex items-start py-3 px-5">
			<SearchFilterItem :label="$t('SEARCH.SEARCH_BY')">
				<MenuDropdown
					v-model="currentFilter"
					:items="filterComponents"
					:placeholder="$t('SEARCH.SELECT_OPTION')"
				>
					<template slot="handler" slot-scope="handlerProps">
						<MenuDropdownAlternativeHandler v-bind="handlerProps" class="text-theme-settings-text" />
					</template>
				</MenuDropdown>
			</SearchFilterItem>

			<!-- Placeholder -->
			<SearchFilterItem v-if="!currentFilter">
				<span class="block py-2">
					<SvgIcon name="placeholder" view-box="0 0 111 25" class="text-theme-settings-button" />
				</span>
			</SearchFilterItem>

			<Component :is="currentFilter" v-else />
		</ul>
	</MenuOptions>
</template>

<script>
import { Component, Prop,Vue } from "vue-property-decorator";

/* eslint-disable vue/no-unused-components */
import { MenuDropdown, MenuDropdownAlternativeHandler, MenuOptions } from "@/components/Menu";
import SvgIcon from "@/components/SvgIcon";

import SearchFilterDelegate from "./SearchFilterDelegate";
import SearchFilterItem from "./SearchFilterItem";
import SearchFilterTransaction from "./SearchFilterTransaction";

@Component({
    name: "SearchFilter",

    components: {
		MenuOptions,
		MenuDropdown,
		MenuDropdownAlternativeHandler,
		SearchFilterItem,
		SearchFilterTransaction,
		SearchFilterDelegate,
		SvgIcon,
	}
})
export default class SearchFilter extends Vue {
    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    outsideClick;

    currentFilter = null;

    get filterComponents() {
        return {
            SearchFilterTransaction: this.$t("TRANSACTION.TRANSACTION"),
            SearchFilterDelegate: this.$t("SEARCH.DELEGATE"),
        };
    }

    emitClose() {
        if (this.outsideClick) {
            this.$emit("close");
        }
    }
}
</script>

<style lang="postcss" scoped>
.SearchFilter__list > .SearchFilterItem:first-child {
	@apply .border-none;
}
</style>
