<template>
	<div class="overflow-hidden MenuTab bg-theme-feature">
		<nav class="MenuTab__nav bg-theme-feature-item-alternative text-theme-feature-item-alternative-text">
			<div class="inline-flex items-center justify-start MenuTab__nav__items">
				<button
					v-for="item in items"
					:key="item.tab"
					:class="{
						'MenuTab__nav__item--active': item.isActive,
						'MenuTab__nav__item--disabled': item.isDisabled,
						'MenuTab__nav__item--clickable': !!item.onClick,
					}"
					:disabled="item.isDisabled"
					class="flex items-center justify-center px-5 py-4 font-semibold appearance-none cursor-pointer MenuTab__nav__item text-inherit bg-theme-feature-item-alternative hover:bg-theme-feature-item-hover hover:text-theme-feature-item-selected-text"
					@click="item.onClick ? item.onClick() : switchToTab(item.tab)"
				>
					<template v-if="item.$slots.header">
						<VNodes :vnodes="item.$slots.header" />
					</template>

					<template v-else>
						{{ item.label }}
					</template>
				</button>
			</div>
		</nav>
		<section class="p-5 overflow-y-auto MenuTab__content">
			<slot />
		</section>
	</div>
</template>

<script>
import { Component, Model, Vue, Watch } from "vue-property-decorator";

import VNodes from "@/components/utils/VNodes";

@Component({
	name: "MenuTab",

	components: {
		VNodes,
	},
})
export default class MenuTab extends Vue {
	@Model("input", {
		type: [String, Number],
		required: false,
		default: null,
	})
	tab;

	activeTab = null;
	items = [];

	@Watch("tab")
	onTabChanged() {
		this.switchToTab(this.tab);
	}

	data(vm) {
		return {
			activeTab: vm.tab,
		};
	}

	mounted() {
		this.collectItems();
		this.switchToTab(this.activeTab);
	}

	collectItems() {
		this.items = this.$children.filter((child) => {
			return child.$options.name === "MenuTabItem";
		});
	}

	switchToTab(newTab) {
		this.resetScroll();
		this.items.forEach((item) => item.toggle(item.tab === newTab));
		this.activeTab = newTab;
		this.$emit("input", this.activeTab);
	}

	resetScroll() {
		if (this.$el.scrollTop > 0) {
			this.$el.scrollTo(0, 0);
		}
	}
}
</script>

<style lang="postcss" scoped>
.MenuTab {
	@apply .flex .flex-col .h-full;
}

.MenuTab .MenuTab__nav__item {
	@apply .self-stretch;
}

.MenuTab .MenuTab__nav__item--active {
	@apply .bg-theme-switch-button .text-theme-button-text;
}

.MenuTab .MenuTab__nav__item--clickable {
	@apply .bg-theme-voting-banner-background .text-theme-page-text .opacity-75;
}

.MenuTab .MenuTab__nav__item--disabled {
	@apply .text-theme-feature-item-alternative-text .opacity-50;
}

.MenuTab .MenuTab__nav__item--disabled:hover {
	@apply .bg-transparent;
}
</style>
