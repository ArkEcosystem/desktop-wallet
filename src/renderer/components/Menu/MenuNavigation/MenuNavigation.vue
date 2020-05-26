<template>
	<nav class="MenuNavigation bg-theme-feature">
		<slot />
	</nav>
</template>

<script>
import { Component, Prop, Provide, Vue, Watch } from "vue-property-decorator";

@Component({
	name: "MenuNavigation",

	model: {
		prop: "id",
		event: "input",
	},
})
export default class MenuNavigation extends Vue {
	@Prop({
		type: [Number, String],
		required: false,
		default: null,
	})
	id;

	items = [];
	activeId = null;

	@Watch("id")
	onId(value) {
		if (this.activeId !== value) {
			this.activateItem(value);
		}
	}

	data(vm) {
		return {
			activeId: vm.id,
		};
	}

	mounted() {
		this.collectItems();

		if (this.activeId) {
			this.activateItem(this.activeId);
		}
	}

	collectItems() {
		this.items = this.collections_filterChildren("MenuNavigationItem") || [];
	}

	activateItem(itemId) {
		this.items.forEach((item) => item.toggle(item.id === itemId));
		this.activeId = itemId;
	}

	@Provide('switchToItem')
	switchToItem(itemId) {
		if (this.activeId !== itemId) {
			this.activateItem(itemId);
			this.$emit("input", this.activeId);
		}
	}
}
</script>
