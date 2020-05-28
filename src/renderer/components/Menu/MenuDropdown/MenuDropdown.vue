<template>
	<div :class="[{ open: isOpen }, 'relative']">
		<button
			v-if="!hasDefaultSlot"
			:disabled="isDisabled"
			class="w-full appearance-none text-inherit"
			@click.stop="handlerWrapperClick"
		>
			<slot
				:active-value="activeValue"
				:value="activeValue"
				:item="entries[activeValue]"
				:is-open="isOpen"
				:placeholder="placeholder"
				:prefix="prefix"
				:icon-disabled="isOnlySelectedItem"
				name="handler"
			>
				<MenuDropdownHandler
					:value="activeValue"
					:item="entries[activeValue]"
					:placeholder="placeholder"
					:prefix="prefix"
					:icon-disabled="isOnlySelectedItem"
				/>
			</slot>
		</button>

		<div
			v-if="isOpen && (hasDefaultSlot || hasItems)"
			v-click-outside.stop="close"
			:class="[
				{
					'bottom-0 pb-10': pinAbove,
					'inset-x-0': pinToInputWidth,
				},
				containerClasses,
			]"
			:style="{ right: adjustedPosition.x, top: pinAbove ? null : adjustedPosition.y }"
			class="absolute z-20 min-w-full MenuDropdown__container"
		>
			<ul
				class="flex flex-col py-2 overflow-y-auto rounded shadow pointer-events-auto MenuDropdown bg-theme-feature max-h-2xs"
			>
				<slot>
					<MenuDropdownItem
						v-for="(item, entryValue) in entries"
						:key="entryValue"
						:value="entryValue"
						:item="item.toString()"
						:is-active="isHighlighting ? entryValue === activeValue : false"
						@click="select"
					>
						<slot name="item" v-bind="{ item, value: entryValue, activeValue }" />
					</MenuDropdownItem>
				</slot>
			</ul>
		</div>
	</div>
</template>

<script>
import { zipObject } from "lodash";
import { Component, Model, Prop, Vue, Watch } from "vue-property-decorator";

import { isEmpty } from "@/utils";

import MenuDropdownHandler from "./MenuDropdownHandler";
import MenuDropdownItem from "./MenuDropdownItem";

@Component({
	name: "MenuDropdown",

	components: {
		MenuDropdownItem,
		MenuDropdownHandler,
	},
})
export default class MenuDropdown extends Vue {
	@Model("select", {
		type: String,
		required: false,
		default: null,
	})
	value;

	@Prop({
		type: String,
		required: false,
		default: "",
	})
	containerClasses;

	@Prop({
		type: String,
		required: false,
		default: null,
	})
	placeholder;

	@Prop({
		type: [Array, Object],
		required: false,
		default: () => [],
	})
	items;

	@Prop({
		type: Object,
		required: false,
		default: () => {},
	})
	position;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	pinAbove;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	pinToInputWidth;

	@Prop({
		type: String,
		required: false,
		default: "",
	})
	prefix;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isDisabled;

	@Prop({
		type: Boolean,
		required: false,
		default: true,
	})
	isHighlighting;

	isOpen = true;
	activeValue = null;

	@Watch("value")
	onValueChanged(value) {
		this.activeValue = value;
	}

	data(vm) {
		return {
			activeValue: vm.value,
		};
	}

	get adjustedPosition() {
		return {
			x: "0",
			y: "120%",
			...this.position,
		};
	}

	get entries() {
		return Array.isArray(this.items) ? zipObject(this.items, this.items) : this.items;
	}

	get hasDefaultSlot() {
		return !!this.$slots.default;
	}

	get hasItems() {
		return !isEmpty(this.items);
	}

	get isOnlySelectedItem() {
		if (Object.keys(this.entries).length > 1) {
			return false;
		}
		if (
			Object.keys(this.entries).length === 1 &&
			this.entries[this.activeValue] !== Object.values(this.entries)[0]
		) {
			return false;
		}

		return true;
	}

	mounted() {
		this.isOpen = this.hasDefaultSlot;
	}

	select(item) {
		this.activeValue = item;
		this.isOpen = false;

		this.$emit("select", item);
	}

	handlerWrapperClick() {
		this.toggle();
		this.$emit("click");
	}

	toggle() {
		this.isOpen = !this.isOpen;
	}

	open() {
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}
}
</script>

<style lang="postcss">
.MenuDropdown .MenuDropdownItem:last-child .MenuDropdownItem__container {
	border: none;
}
</style>
