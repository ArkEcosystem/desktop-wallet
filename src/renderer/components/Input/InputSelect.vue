<template>
	<MenuDropdown
		ref="dropdown"
		:items="items"
		:is-disabled="isDisabled"
		:value="optionValue"
		class="InputSelect"
		@select="onDropdownSelect"
	>
		<template v-if="hasItemSlot" v-slot:item="itemScope">
			<slot name="input-item" v-bind="itemScope" />
		</template>

		<template v-slot:handler="handlerScope">
			<InputField
				:name="name"
				:label="inputLabel"
				:value="optionText"
				:is-dirty="isDirty"
				:is-disabled="isDisabled"
				:is-focused="isFocused"
				:is-invalid="isInvalid"
			>
				<MenuDropdownHandler
					slot-scope="{ inputClass }"
					:value="handlerScope.value"
					:item="handlerScope.item"
					:class="inputClass"
					:placeholder="label"
					class="InputSelect__input"
					@blur="onBlur"
					@click="onHandlerClick"
				>
					<slot v-if="hasHandlerSlot" name="input-handler" v-bind="handlerScope" />
				</MenuDropdownHandler>
			</InputField>
		</template>
	</MenuDropdown>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue, Watch } from "vue-property-decorator";

import { MenuDropdown, MenuDropdownHandler } from "@/components/Menu";

import InputField from "./InputField";

@Component({
	name: "InputSelect",

	components: {
		InputField,
		MenuDropdown,
		MenuDropdownHandler,
	},
})
export default class InputSelect extends Vue {
	@Model("input", {
		type: String,
		required: false,
		default: undefined,
	})
	value;

	@Prop({
		type: [Array, Object],
		required: true,
		default: () => [],
	})
	items;

	@Prop({
		type: String,
		required: true,
	})
	label;

	@Prop({
		type: String,
		required: true,
	})
	name;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isDisabled;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isInvalid;

	isFocused = false;
	optionValue = null;

	@Watch("value")
	onValue(value) {
		// @ts-ignore
		this.optionValue = value;
	}

	data(vm) {
		return {
			optionValue: vm.value,
		};
	}

	// When the text of the option is empty the label/placeholder is shown instead by the MenuHandler
	get inputLabel() {
		return this.optionText ? this.label : "";
	}

	get hasHandlerSlot() {
		return !!this.$scopedSlots["input-handler"];
	}

	get hasItemSlot() {
		return !!this.$scopedSlots["input-item"];
	}

	get isDirty() {
		return !!this.optionValue;
	}

	get optionText() {
		if (!Array.isArray(this.items)) {
			// @ts-ignore
			return this.items[this.optionValue];
		}

		// Ensure that the value could be valid
		if (this.items.indexOf(this.optionValue) !== -1) {
			return this.optionValue;
		}

		return "";
	}

	emitInput() {
		this.$emit("input", this.optionValue);
	}

	onBlur(event) {
		// To ensure that the code is evaluated after other tasks
		setTimeout(() => {
			// @ts-ignore
			const classList = document.activeElement.classList;

			const isDropdownItem =
				classList && typeof classList.contains === "function"
					? classList.contains("MenuDropdownItem__button")
					: false;

			if (isDropdownItem) {
				event.preventDefault();
			} else {
				// @ts-ignore
				this.$refs.dropdown.close();
			}
		}, 0);
	}

	onHandlerClick() {
		this.isFocused = true;
	}

	onDropdownSelect(selectedValue) {
		this.isFocused = false;
		this.optionValue = selectedValue;

		this.emitInput();
	}
}
</script>
