<template>
	<ModalWindow :title="modalHeaderText" :container-classes="containerClasses" @close="emitClose">
		<section class="flex flex-col InputGridModal">
			<div class="p-1 overflow-y-auto InputGridModal__container">
				<div
					v-for="(categoryItems, category) in items"
					:key="category"
					class="InputGridModal__container__category"
				>
					<h4 class="w-full mt-5 mb-2">
						{{ category }}
					</h4>

					<div class="InputGrid__container__category__items">
						<button v-for="item in categoryItems" :key="item[itemKey]" @click="click(item)">
							<!--
                Here we could reuse the `item` scope of the `InputGrid` component
                or provide a new slot, but currently is not necessary at all.
              -->

							<InputGridItem v-bind="item" :is-selected="isClicked(item)" />
						</button>
					</div>
				</div>
			</div>

			<div class="mt-5">
				<button :disabled="!clicked" class="blue-button" @click="emitSelect">
					{{ $t("COMMON.DONE") }}
				</button>
			</div>
		</section>
	</ModalWindow>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

// @ts-ignore
import ModalWindow from "@/components/Modal/ModalWindow";

import InputGridItem from "./InputGridItem";

/**
 * This component only emits the `selected` event when the background has been
 * confirmed.
 */
@Component({
	name: "InputGridModal",

	components: {
		InputGridItem,
		ModalWindow,
	},
})
export default class InputGridModal extends Vue {
	@Prop({
		type: String,
		required: false,
		default: "InputGridModal",
	})
	containerClasses;

	@Prop({
		type: [Array, Object],
		required: true,
	})
	items;

	@Prop({
		type: String,
		required: true,
	})
	itemKey;

	@Prop({
		type: Object,
		required: false,
		default: null,
	})
	selected;

	@Prop({
		type: String,
		required: false,
		default() {
			// @ts-ignore
			return this.$t("INPUT_GRID_MODAL.TITLE");
		},
	})
	modalHeaderText;

	clicked = undefined;

	data() {
		return {
			clicked: this.selected,
		};
	}

	click(item) {
		this.clicked = item;
	}

	isClicked(item) {
		// @ts-ignore
		return this.clicked.pluginId ? this.clicked.name === item.name : this.clicked.title === item.title;
	}

	emitClose() {
		this.$emit("close");
	}

	emitSelect() {
		this.$emit("select", this.clicked);
		this.emitClose();
	}
}
</script>

<style scoped>
.InputGridModal__container {
	width: 28.5rem; /* 5 * 4.5rem (columns) + 4 * 1rem (gaps) + 2rem (gap from scrollbar) */
	height: 50vh;
}
.InputGrid__container__category__items {
	display: grid;
	/* Maximum 5 columns */
	grid-template-columns: repeat(auto-fill, 4.5rem);
	grid-gap: 1rem;
}
</style>
