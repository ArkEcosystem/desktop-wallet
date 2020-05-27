<template>
	<div class="InputEditableList" :class="{ 'InputEditableList--invalid': isInvalid || requiredAndEmpty }">
		<div class="relative inline-flex items-end w-full appearance-none InputField__wrapper">
			<label
				v-show="title"
				class="absolute truncate pointer-events-none InputField__label text-theme-page-text-light"
				>{{ title }}
				<span v-if="showCount && items.length"
					>- {{ items.length }}<span v-if="maxItems"> / {{ maxItems }}</span></span
				>
			</label>
		</div>

		<div class="InputEditableList__list">
			<div v-for="(item, key) of items" :key="key" class="flex py-2 select-none InputEditableList__list__item">
				<slot :item="item" />

				<ButtonClose
					v-if="!readonly"
					icon-class="text-grey"
					class="InputEditableList__list__item__remove flex-inline"
					@click="emitRemove(key)"
				/>
			</div>
		</div>

		<div v-if="requiredAndEmpty" class="InputEditableList__no-items">
			{{ noItemsMessage }}
		</div>

		<p v-if="helperText" class="InputEditableList__helper-text">
			{{ helperText }}
		</p>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { ButtonClose } from "@/components/Button";

@Component({
	name: "InputEditableList",

	components: {
		ButtonClose,
	},
})
export default class InputEditableList extends Vue {
	@Prop({
		type: String,
		required: false,
		default: null,
	})
	title;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	showCount;

	@Prop({
		type: Number,
		required: false,
		default: null,
	})
	maxItems;

	@Prop({
		type: Array,
		required: true,
	})
	value;

	@Prop({
		type: Boolean,
		required: false,
		default: true,
	})
	required;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	readonly;

	@Prop({
		type: String,
		required: false,
		default: null,
	})
	helperText;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isInvalid;

	@Prop({
		type: String,
		required: false,
		default: function () {
			// @ts-ignore
			return this.$t("INPUT_EDITABLE_LIST.NO_ITEMS");
		},
	})
	noItemsMessage;

	items = null;

	@Watch("value")
	onValue(newValue) {
		// @ts-ignore
		this.items = newValue;
	}

	data(vm) {
		return {
			items: vm.value,
		};
	}

	get requiredAndEmpty() {
		// @ts-ignore
		return this.required && (!this.items || !this.items.length);
	}

	emitRemove(index) {
		this.$emit("remove", index);
	}
}
</script>

<style scoped>
.InputEditableList__list {
	@apply .overflow-y-auto;
}
.InputEditableList__list .ButtonClose {
	@apply .mr-0 !important;
}
.InputEditableList--invalid .InputEditableList__no-items,
.InputEditableList--invalid .InputField__label,
.InputEditableList--invalid .InputEditableList__helper-text {
	@apply .text-red-dark;
}
.InputField__label {
	font-weight: 600;
	bottom: 0;
	transform: scale(0.75);
}
</style>
