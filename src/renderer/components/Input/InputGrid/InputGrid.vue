<template>
	<div class="InputGrid">
		<slot>
			<div class="InputGrid__container">
				<button v-if="selectedItem" class="mr-3">
					<InputGridItem v-bind="activeItem" :is-selected="!isModalOpen" :is-for-modal="false" />
				</button>

				<slot name="more">
					<button v-if="modalHeaderText" @click="openModal">
						<InputGridItem
							:title="$t('INPUT_GRID.MORE')"
							:is-selected="false"
							class="p-1 text-4xl text-center align-middle border-2 border-theme-line-separator text-theme-option-button-text hover:text-theme-button-text"
							text-content="..."
						/>
					</button>

					<InputGridModal
						v-if="isModalOpen"
						:container-classes="modalContainerClasses"
						:items="items"
						:item-key="itemKey"
						:selected="selectedItem"
						:modal-header-text="modalHeaderText"
						@close="closeModal"
						@select="select"
					/>
				</slot>
			</div>
		</slot>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { flatten } from "@/utils";

import InputGridItem from "./InputGridItem";
import InputGridModal from "./InputGridModal";

/**
 * The InputGrid displays a grid of items. One of those items could be selected
 * by clicking on it.
 */
@Component({
	name: "InputGrid",

	components: {
		InputGridItem,
		InputGridModal,
	},
})
export default class InputGrid extends Vue {
	@Prop({
		type: [Array, Object],
		required: true,
	})
	// @ts-ignore
	items;

	// Attributes that would be yielded when using the `item` slot
	@Prop({
		type: Array,
		required: false,
		default: () => ["title", "imagePath"],
	})
	// @ts-ignore	// @ts-ignore
	itemAttrs;

	@Prop({
		type: String,
		required: true,
	})
	// @ts-ignore
	itemKey;

	@Prop({
		type: Object,
		required: false,
		default: null,
	})
	// @ts-ignore
	selected;

	@Prop({
		type: String,
		required: false,
		default: null,
	})
	// @ts-ignore
	modalContainerClasses;

	@Prop({
		type: String,
		required: false,
		default: null,
	})
	// @ts-ignore
	modalHeaderText;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	// @ts-ignore
	autoSelectFirst;

	isModalOpen = null;

	selectedItem = undefined;

	data() {
		return {
			selectedItem: this.selected,
		};
	}

	get allItems() {
		return flatten(Object.values(this.items));
	}

	get activeItem() {
		return this.allItems.find((item) => {
			// @ts-ignore
			if (!this.selectedItem || this.selectedItem.onlyLetter) {
				return item.onlyLetter;
			}

			// @ts-ignore
			if (this.selectedItem.pluginId) {
				// @ts-ignore
				return item.name === this.selectedItem.name;
			}

			// @ts-ignore
			return item.title === this.selectedItem.title;
		});
	}

	mounted() {
		if (this.autoSelectFirst && !this.selected) {
			this.select(this.allItems[0]);
		}
	}

	// @ts-ignore
	itemSlotAttrs(item) {
		// @ts-ignore
		return this.itemAttrs.reduce((itemAttrs, attr) => {
			itemAttrs[attr] = item[attr];
			return itemAttrs;
		}, {});
	}

	openModal() {
		// @ts-ignore
		this.isModalOpen = true;
	}

	closeModal() {
		// @ts-ignore
		this.isModalOpen = false;
	}

	// @ts-ignore
	select(item) {
		this.selectedItem = item;
		this.$emit("input", this.activeItem);
	}
}
</script>

<style lang="postcss" scoped>
.InputGrid__container {
	@apply flex items-center;
}
</style>
