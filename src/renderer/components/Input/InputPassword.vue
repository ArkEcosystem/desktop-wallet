<template>
	<InputField
		:label="label"
		:helper-text="helperText || error"
		:is-dirty="$v.model.$dirty"
		:is-disabled="isDisabled"
		:is-focused="isFocused"
		:is-invalid="isInvalid"
		class="InputPassword"
	>
		<div slot-scope="{ inputClass }" :class="inputClass" class="flex flex-row">
			<input
				ref="input"
				v-model="model"
				:name="name"
				:disabled="isDisabled"
				:type="passwordIsVisible ? 'text' : 'password'"
				class="flex flex-grow mr-2 bg-transparent InputPassword__input text-theme-page-text"
				@blur="onBlur"
				@focus="onFocus"
			/>

			<button
				:title="$t(passwordIsVisible ? 'PASSWORD_INPUT.HIDE' : 'PASSWORD_INPUT.SHOW')"
				class="flex items-center flex-shrink-0 mr-2 InputPassword__visibility-button text-grey-dark hover:text-blue focus:text-blue"
				type="button"
				@click="toggleVisible"
			>
				<SvgIcon :name="passwordIsVisible ? 'passphrase-hide' : 'passphrase-show'" view-box="0 0 20 20" />
			</button>
		</div>
	</InputField>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { required } from "vuelidate/lib/validators";

import { InputField } from "@/components/Input";
import SvgIcon from "@/components/SvgIcon";

@Component({
	name: "InputPassword",

	components: {
		InputField,
		SvgIcon,
	},

	watch: {
		value(value) {
			// @ts-ignore
			this.inputValue = value;
		},
	},
})
export default class InputPassword extends Vue {
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
	isDisabled;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isVisible;

	@Prop({
		type: Boolean,
		required: false,
		default: true,
	})
	isRequired;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isCreate;

	@Prop({
		type: Number,
		required: false,
		default: 0,
	})
	minLength;

	@Prop({
		type: String,
		required: false,
		default: "password",
	})
	name;

	@Prop({
		type: String,
		required: false,
		default: () => "",
	})
	value;

	@Prop({
		type: String,
		required: false,
		default() {
			// @ts-ignore
			return this.$t("PASSWORD_INPUT.LABEL");
		},
	})
	label;

	@Prop({
		type: Boolean,
		required: false,
		default: true,
	})
	giveFeedback;

	@Prop({
		type: String,
		required: false,
		default: null,
	})
	confirm;

	inputValue = null;
	isFocused = false;
	passwordIsVisible = null;

	data(vm) {
		return {
			inputValue: vm.value,
			passwordIsVisible: vm.isVisible,
		};
	}

	get error() {
		let error = null;

		if (this.$v.model.$dirty) {
			if (!this.$v.model.required) {
				// @ts-ignore
				error = this.$t("VALIDATION.REQUIRED", [this.label]);
			} else if (!this.$v.model.isValid) {
				// @ts-ignore
				error = this.passwordFeedback();
			} else if (!this.$v.model.isConfirmed) {
				// @ts-ignore
				error = this.$t("VALIDATION.PASSWORD.NO_MATCH");
			}
		}

		return error;
	}

	get isInvalid() {
		return this.$v.model.$dirty && !!this.error;
	}

	get model() {
		return this.inputValue;
	}

	set model(value) {
		this.inputValue = value;
		// Inform Vuelidate that the value changed
		this.$v.model.$touch();
		this.$emit("input", value);
	}

	blur() {
		// @ts-ignore
		this.$refs.input.blur();
	}

	async focus() {
		await this.$nextTick();
		// @ts-ignore
		this.$refs.input.focus();
	}

	onBlur() {
		this.isFocused = false;
	}

	onFocus() {
		this.isFocused = true;
		this.$emit("focus");
	}

	reset() {
		this.$v.$reset();
	}

	touch() {
		this.$v.model.$touch();
	}

	async toggleVisible() {
		// @ts-ignore
		this.passwordIsVisible = !this.passwordIsVisible;
		await this.focus();
	}

	passwordFeedback() {
		// @ts-ignore
		if (!this.giveFeedback || (!this.isRequired && !this.model.length)) {
			return "";
		}

		// @ts-ignore
		if (this.minLength && this.model.length < this.minLength) {
			return this.$t("VALIDATION.PASSWORD.TOO_SHORT", [this.minLength]);
		}

		// @ts-ignore
		if (!this.model.match(/[a-z]/)) {
			return this.$t("VALIDATION.PASSWORD.LOWER_CASE");
		}

		// @ts-ignore
		if (!this.model.match(/[A-Z]/)) {
			return this.$t("VALIDATION.PASSWORD.UPPER_CASE");
		}

		// @ts-ignore
		if (!this.model.match(/[0-9]/)) {
			return this.$t("VALIDATION.PASSWORD.NUMBERS");
		}

		// @ts-ignore
		if (!this.model.match(/\W|_/)) {
			return this.$t("VALIDATION.PASSWORD.SPECIAL_CHARACTERS");
		}

		return "";
	}

	validations = {
		model: {
			isConfirmed(value) {
				// @ts-ignore
				return !this.confirm || value === this.confirm;
			},
			required(value) {
				// @ts-ignore
				if (this.isRequired) {
					return required(value);
				}

				return true;
			},
			isValid(value) {
				if (!value) {
					return false;
				}

				// @ts-ignore
				if (!this.isRequired && !value.length) {
					return true;
				}

				// @ts-ignore
				if (!this.isCreate) {
					return true;
				}

				// @ts-ignore
				if (this.minLength && value.length < this.minLength) {
					return false;
				}

				const containsLowercase = /[a-z]/.test(value);
				const containsUppercase = /[A-Z]/.test(value);
				const containsNumbers = /[0-9]/.test(value);
				const containsSpecial = /\W|_/.test(value);

				return containsLowercase && containsUppercase && containsNumbers && containsSpecial;
			},
		},
	};
}
</script>

<style lang="postcss" scoped>
.InputPassword__input::placeholder {
	@apply .text-transparent;
}

.InputField--invalid .InputPassword__qr-button {
	@apply .text-red-dark;
}
.InputField--invalid .InputPassword__visibility-button {
	@apply .text-red-dark;
}
</style>
