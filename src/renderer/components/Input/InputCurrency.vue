<template>
	<InputField
		:label="label"
		:helper-text="helperText || error"
		:is-dirty="$v.model.$dirty"
		:is-disabled="isDisabled"
		:is-focused="isFocused"
		:is-invalid="isInvalid"
		:warning-text="warningText"
		class="InputCurrency"
	>
		<div slot-scope="{ inputClass }" :class="inputClass" class="flex flex-row">
			<input
				ref="input"
				v-model.trim="model"
				:disabled="isDisabled"
				:name="name"
				autocomplete="off"
				class="flex flex-grow bg-transparent InputCurrency__input text-theme-page-text"
				type="text"
				@blur="onBlur"
				@change="onChange"
				@focus="onFocus"
			/>
			<div
				v-if="isMarketEnabled && alternativeCurrency"
				:title="alternativeCurrency"
				class="flex items-center flex-shrink-0 ml-4 InputCurrency__alternative-amount text-grey-dark"
			>
				{{ alternativeAmount }}
			</div>
		</div>
	</InputField>
</template>

<script lang="ts">
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { MARKET } from "@config";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
// @ts-ignore
import { required } from "vuelidate/lib/validators";

import InputField from "./InputField";

/**
 * This component uses a String value internally to avoid several problems, such
 * as showing the exponential notation, although it emits a Number always.
 * It also support a `raw` event, that can be used by other components to receive
 * the internal String value.
 */
@Component({
	name: "InputCurrency",

	components: {
		InputField,
	},

	model: {
		prop: "value",
		event: "input",
	},
})
export default class InputCurrency extends Vue {
	@Prop({
		type: String,
		required: false,
		default: null,
	})
	// @ts-ignore
	alternativeCurrency;

	@Prop({
		type: String,
		required: true,
	})
	// @ts-ignore
	currency;

	@Prop({
		type: String,
		required: false,
		default: null,
	})
	// @ts-ignore
	helperText;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	// @ts-ignore
	isDisabled;

	@Prop({
		type: String,
		required: false,
		default() {
			// @ts-ignore
			return this.$t("INPUT_CURRENCY.LABEL");
		},
	})
	// @ts-ignore
	label;

	@Prop({
		type: String,
		required: false,
		default: "amount",
	})
	// @ts-ignore
	name;

	// @ts-ignore
	@Prop({
		type: BigNumber,
		required: true,
	})
	// @ts-ignore
	maximumAmount;

	@Prop({
		type: String,
		required: false,
		default: null,
	})
	// @ts-ignore
	maximumError;

	// @ts-ignore
	@Prop({
		type: BigNumber,
		required: true,
	})
	// @ts-ignore
	minimumAmount;

	@Prop({
		type: String,
		required: false,
		default: null,
	})
	// @ts-ignore
	minimumError;

	@Prop({
		type: String,
		required: false,
		default: null,
	})
	// @ts-ignore
	customError;

	@Prop({
		type: String,
		required: false,
		default: null,
	})
	// @ts-ignore
	warningText;

	@Prop({
		type: String,
		required: false,
		default: null,
	})
	// @ts-ignore
	notValidError;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	// @ts-ignore
	required;

	// @ts-ignore
	@Prop({
		type: [Number, String, BigNumber],
		required: true,
	})
	// @ts-ignore
	value;

	@Prop({
		type: Object,
		required: false,
		default: null,
	})
	// @ts-ignore
	walletNetwork;

	inputValue = null;
	isFocused = false;

	@Watch("value", { immediate: true })
	onValue(val) {
		// @ts-ignore
		this.updateInputValue(val);
	}

	// @ts-ignore
	data(vm) {
		return {
			inputValue: vm.value,
		};
	}

	get alternativeAmount() {
		const amount = this.checkAmount(this.inputValue) ? this.inputValue : 0;

		// @ts-ignore
		return this.currency_format(amount * this.price, { currency: this.alternativeCurrency });
	}

	get error() {
		// @ts-ignore
		if (!this.isDisabled && this.$v.model.$dirty) {
			if (!this.currencyValidator(this.currency)) {
				return "INVALID CURRENCY";
			} else if (this.alternativeCurrency && !this.currencyValidator(this.alternativeCurrency)) {
				return "INVALID CURRENCY";
				// @ts-ignore
			} else if (this.required && !this.$v.model.isRequired) {
				return this.$t("INPUT_CURRENCY.ERROR.REQUIRED");
				// @ts-ignore
			} else if (!this.$v.model.isNumber) {
				if (this.notValidError) {
					return this.notValidError;
				} else {
					return this.$t("INPUT_CURRENCY.ERROR.NOT_VALID");
				}
				// @ts-ignore
			} else if (!this.$v.model.isLessThanMaximum) {
				if (this.maximumError) {
					return this.maximumError;
				} else {
					// @ts-ignore
					const amount = this.currency_format(this.maximumAmount, { currency: this.currency });
					return this.$t("INPUT_CURRENCY.ERROR.NOT_ENOUGH_AMOUNT", { amount });
				}
				// @ts-ignore
			} else if (!this.$v.model.isMoreThanMinimum) {
				if (this.minimumError) {
					return this.minimumError;
				} else {
					// @ts-ignore
					const amount = this.currency_format(this.minimumAmount, { currency: this.currency });
					return this.$t("INPUT_CURRENCY.ERROR.LESS_THAN_MINIMUM", { amount });
				}
			} else if (this.customError) {
				return this.customError;
			}
		}

		return null;
	}

	get formattedValue() {
		if (this.checkAmount(this.inputValue)) {
			// @ts-ignore
			return this.currency_format(this.inputValue, { currency: this.currency });
		}

		return this.inputValue;
	}

	get decimalSeparator() {
		// @ts-ignore
		const example = this.currency_format(9.9, { currency: this.currency });
		return example.match(/9(.)9/)[1];
	}

	get thousandSeparator() {
		return this.decimalSeparator === "." ? "," : ".";
	}

	get isInvalid() {
		// @ts-ignore
		return this.$v.model.$dirty && !!this.error;
	}

	get isMarketEnabled() {
		// @ts-ignore
		return this.session_network.market.enabled;
	}

	get model() {
		return this.isFocused ? this.inputValue : this.formattedValue;
	}

	set model(value) {
		if (this.updateInputValue(value)) {
			this.emitInput(value);
		}
	}

	get price() {
		return this.$store.getters["market/lastPrice"];
	}

	// @ts-ignore
	checkAmount(amount) {
		const bigNum = BigNumber.make(amount);
		if (!bigNum.isNaN()) {
			return bigNum.isPositive() && bigNum.isFinite();
		} else {
			return !!(typeof amount === "string" && amount.match(/^\s*[0-9.,]+([,. _]+[0-9]+)*\s*$/));
		}
	}

	// @ts-ignore
	emitInput(value) {
		this.$emit("raw", value);
		const numeric = value ? this.sanitizeNumeric(value) : "0";
		this.$emit("input", isNaN(numeric) ? "0" : numeric);
	}

	focus() {
		// @ts-ignore
		this.$refs.input.focus();
	}

	onBlur() {
		this.isFocused = false;
		this.$emit("blur");
	}

	// @ts-ignore
	onChange(event) {
		const value = event.target.value;
		const numeric = value ? this.sanitizeNumeric(value) : "0";
		this.$emit("change", isNaN(numeric) ? "0" : numeric);
	}

	onFocus() {
		this.isFocused = true;
		// @ts-ignore
		this.$v.model.$touch();
		this.$emit("focus");
	}

	// @ts-ignore
	sanitizeNumeric(value) {
		let numeric = value.toString();
		let includesThousandSeparator = numeric.includes(this.thousandSeparator);

		// On tiny numbers with exponential notation (1e-8), use their exponent as the number of decimals
		if (numeric.includes("e-")) {
			return Number(numeric).toFixed(numeric.toString().split("-")[1]);
		} else {
			if (numeric.startsWith(".")) {
				numeric = `0${numeric}`;
			} else if (numeric.startsWith(",")) {
				numeric = `0.${numeric.slice(1)}`;
				// The separator has been modified
				includesThousandSeparator = false;
			}

			const dot = numeric.includes(".");
			const colon = numeric.includes(",");

			if (dot && colon) {
				numeric = numeric.replace(/,/g, ".");
				// If only includes 1 kind of ambiguous separator, convert it to '.'
			}
			if (dot || colon) {
				numeric = numeric.replace(/[.,]+/, ".");
			}

			// These characters are always thousand separators
			const nonAmbiguousSeparators = /[ _]/g;
			let hasNonAmbiguosAndDecimalSeparators = false;

			if (numeric.match(nonAmbiguousSeparators)) {
				numeric = numeric.replace(nonAmbiguousSeparators, "");
				// So, if there is other separator, it is for the decimals
				if (dot || colon) {
					hasNonAmbiguosAndDecimalSeparators = true;
				}
			}

			const digits = numeric.split(".");

			if (digits.length === 1) {
				return digits[0];
			} else {
				const last = digits.slice(-1)[0];

				// Cases like "1 000,001" should be treated like 1000.001 independently of the locale
				if (last.length === 3 && includesThousandSeparator && !hasNonAmbiguosAndDecimalSeparators) {
					return `${digits.slice(0, -1).join("")}${last}`;
				} else {
					return `${digits.slice(0, -1).join("")}.${last}`;
				}
			}
		}
	}

	// @ts-ignore
	updateInputValue(value) {
		if (value === "") {
			// @ts-ignore
			this.inputValue = "";
			return true;
		} else if (value && this.checkAmount(value)) {
			this.inputValue = this.sanitizeNumeric(value);

			// Inform Vuelidate that the value changed
			// @ts-ignore
			this.$v.model.$touch();
			return true;
		}
		return false;
	}

	// @ts-ignore
	currencyValidator(currency) {
		const currentNetwork = this.walletNetwork || this.$store.getters["session/network"];
		const currencies = [
			currentNetwork.token,
			currentNetwork.subunit,
			currentNetwork.symbol,
			...Object.keys(MARKET.currencies),
			...Object.values(MARKET.currencies).map((currency) => currency.symbol),
		];
		return currencies.includes(currency);
	}

	reset() {
		// @ts-ignore
		this.inputValue = "";
		this.$nextTick(() => {
			// @ts-ignore
			this.$v.model.$reset();
		});
	}

	validations() {
		return {
			model: {
				// @ts-ignore
				isNumber() {
					// @ts-ignore
					return this.inputValue && this.checkAmount(this.inputValue);
				},
				// @ts-ignore
				isMoreThanMinimum() {
					// @ts-ignore
					return !this.minimumAmount.isGreaterThan(this.inputValue);
				},
				// @ts-ignore
				isLessThanMaximum() {
					// @ts-ignore
					return !this.maximumAmount.isLessThan(this.inputValue);
				},
				// @ts-ignore
				isRequired(value) {
					// @ts-ignore
					if (this.required) {
						return required(value);
					}

					return true;
				},
			},
		};
	};
}
</script>

<style lang="postcss" scoped>
.InputCurrency__input::placeholder {
	@apply .text-transparent;
}

.InputCurrency__alternative-amount {
	min-width: 5rem;
	justify-content: flex-end;
}
.InputField--invalid .InputCurrency__alternative-amount {
	@apply .text-red-dark;
}
</style>
