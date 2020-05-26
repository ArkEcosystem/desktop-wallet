<template>
	<nav class="MenuNavigation bg-theme-feature">
		<slot />
	</nav>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({
	name: "MenuNavigation",

	model: {
		prop: "id",
		event: "input",
	},

	watch: {
		id(value) {
			if (this.activeId !== value) {
				this.activateItem(value);
			}
		},
	},
})
export default class MenuNavigation extends Vue {
	provide() {
		return {
			switchToItem: this.switchToItem,
		};
	}

	@Prop({
		type: [Number, String],
		required: false,
		default: null,
	})
	id;

	items = [];
	activeId = null;

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

	switchToItem(itemId) {
		if (this.activeId !== itemId) {
			this.activateItem(itemId);
			this.$emit("input", this.activeId);
		}
	}
}
</script>
