<template>
	<InputField
		:label="label"
		:helper-text="helperText"
		:is-dirty="isDirty"
		:is-disabled="isDisabled"
		:is-focused="isFocused"
		:is-invalid="isInvalid"
		:warning-text="warning"
		:is-read-only="isReadOnly"
		class="InputText"
	>
		<div slot-scope="{ inputClass }" :class="inputClass" class="flex items-baseline">
			<slot name="left" />
			<input
				ref="input"
				v-model="model"
				:class="[
					{
						'InputText__input--read-only': isReadOnly,
						'InputText__input--large': isLarge,
					},
				]"
				:name="name"
				:disabled="isDisabled || isReadOnly"
				:type="type"
				:value="value"
				:maxlength="maxlength"
				:placeholder="placeholder"
				class="flex-1 InputText__input"
				@focus="onFocus"
				@blur="onBlur"
			/>
			<slot name="right" />
		</div>
	</InputField>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import WalletService from "@/services/wallet";

import InputField from "./InputField";

@Component({
	name: "InputText",

	components: {
		InputField,
	},

	model: {
		prop: "value",
		event: "input",
	},
})
export default class InputText extends Vue {
	@Prop({
		type: String,
		required: true,
	})
	label;

	@Prop({
		type: String,
		required: false,
		default: "",
	})
	placeholder;

	@Prop({
		type: String,
		required: true,
	})
	name;

	@Prop({
		type: String,
		required: false,
		default: "text",
	})
	type;

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
	isLarge;

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

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isReadOnly;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	bip39Warning;

	@Prop({
		type: Number,
		required: false,
		default: undefined,
	})
	maxlength;

	@Prop({
		type: [String, Number],
		required: false,
		default: undefined,
	})
	value;

	inputValue = null;
	isFocused = false;

	@Watch("value")
	onValue(value) {
		// @ts-ignore
		this.inputValue = value;
	}

	// @ts-ignore
	data(vm) {
		return {
			inputValue: vm.value,
		};
	}

	get isDirty() {
		// @ts-ignore
		return !!this.inputValue;
	}

	get isWarning() {
		// @ts-ignore
		return !!this.isDirty && !!this.warning;
	}

	get warning() {
		// @ts-ignore
		if (this.$v.model.$dirty) {
			// @ts-ignore
			if (this.$v.model.isBip39) {
				return this.$t("VALIDATION.WARNING_BIP39", [this.label.split(" - ")[0]]);
			}
		}

		return null;
	}

	onFocus() {
		// @ts-ignore
		this.isFocused = true;
		// @ts-ignore
		this.$emit("focus");
	}

	onBlur() {
		// @ts-ignore
		this.isFocused = false;
	}

	focus() {
		// @ts-ignore
		this.$refs.input.focus();
	}

	blur() {
		// @ts-ignore
		this.$refs.input.blur();
	}

	reset() {
		// @ts-ignore
		this.model = "";
		// @ts-ignore
		this.$nextTick(() => {
			// @ts-ignore
			this.$v.$reset();
		});
	}

	validations = {
		model: {
			isBip39(value) {
				// @ts-ignore
				if (!this.bip39Warning) {
					return false;
				}

				const trimmed = value
					.toLowerCase()
					.split(" ")
					.filter((word) => !!word.length)
					.join(" ");

				// @ts-ignore
				return WalletService.isBip39Passphrase(trimmed, this.session_profile.bip39Language);
			},
		},
	};
}
</script>

<style lang="postcss" scoped>
.InputText__input {
	@apply .bg-transparent .text-theme-page-text .h-full;
}

.InputText__input::placeholder {
	@apply .text-transparent;
	transition: color 0s;
}

.InputField--focused .InputText__input::placeholder {
	@apply .text-theme-page-text-light;
	transition: color 0.1s;
}

.InputText__input--large {
	@apply .text-xl;
}

.InputText__input--read-only {
	cursor: text;
}
</style>
