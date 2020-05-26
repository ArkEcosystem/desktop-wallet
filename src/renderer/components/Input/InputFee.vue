<template>
	<div class="relative inline-block w-full InputFee">
		<div class="w-full">
			<div class="absolute w-full InputFee__gradient" />
			<div :style="rangeTrackStyle" class="absolute z-30 w-full InputFee__range-track" />
			<div :style="hiddenGradientStyle" class="absolute z-10 w-full InputFee__hidden-gradient" />
		</div>

		<div class="absolute z-20 InputFee__currency-input-container">
			<InputCurrency
				ref="input"
				:currency="currency"
				:label="$t('TRANSACTION.FEE')"
				:value="fee"
				:custom-error="insufficientFundsError"
				:not-valid-error="notValidError"
				:maximum-amount="feeChoiceMax"
				:maximum-error="maximumError"
				:minimum-amount="feeChoiceMin"
				:minimum-error="minimumError"
				:warning-text="warningText"
				:is-disabled="isDisabled"
				:wallet-network="walletNetwork"
				class="w-full InputField--dirty"
				@change="onChange"
				@raw="onRawInput"
			/>
		</div>

		<input
			:value="fee"
			:max="feeChoiceMax"
			:min="feeChoiceMin"
			:step="step"
			:disabled="isDisabled"
			type="range"
			class="z-10 w-full py-2 m-0"
			name="fee"
			@input="onSlider($event.target.value)"
		/>
		<p class="absolute z-30 InputFee__choices">
			<button
				v-for="choice in Object.keys(feeChoices)"
				:key="choice"
				:class="{ 'InputFee__choice--active': choice === chosenFee }"
				:disabled="isDisabled"
				class="text-xs font-semibold cursor-pointer InputFee__choice"
				@click="onChoice(choice)"
			>
				{{ $t(`INPUT_FEE.${choice}`) }}
			</button>
		</p>

		<div v-if="isStaticFee && !isAdvancedFee" class="mt-6 mb-4">
			{{ $t(`INPUT_FEE.UNIQUE`, { fee: parseFloat(fee) }) }}
		</div>
	</div>
</template>

<script lang="ts">
import { V1 } from "@config";
import { Component, Prop, Vue } from "vue-property-decorator";

import InputCurrency from "./InputCurrency";

/**
 * This component, like \`InputCurrency\`, uses a String value internally to
 * avoid several problems, such as showing the exponential notation, although
 * it emits a Number always
 */
@Component({
	name: "InputFee",

	components: {
		InputCurrency,
	},
})
export default class InputFee extends Vue {
	@Prop({
		type: String,
		required: true,
	})
	currency;

	@Prop({
		type: Number,
		required: true,
	})
	transactionType;

	@Prop({
		type: Number,
		required: false,
		default: 1,
	})
	transactionGroup;

	@Prop({
		type: Boolean,
		required: false,
		default: true,
	})
	showInsufficientFunds;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isDisabled;

	@Prop({
		type: Object,
		required: false,
		default: null,
	})
	wallet;

	@Prop({
		type: Object,
		required: false,
		default: null,
	})
	walletNetwork;

	chosenFee = "AVERAGE";
	step = 1e-8;
	fee = 0;

	get currentWallet() {
		// @ts-ignore
		return this.wallet || this.wallet_fromRoute;
	}

	get hiddenGradientStyle() {
		return {
			width: `${100 - this.rangePercentage}%`,
		};
	}

	get rangeTrackStyle() {
		return {
			width: `${this.rangePercentage}%`,
		};
	}

	get rangePercentage() {
		const percent =
			// @ts-ignore
			(this.currency_toBuilder(this.fee).minus(this.feeChoiceMin).valueOf() /
				(this.feeChoiceMax - this.feeChoiceMin)) *
			100;
		return percent > 100 ? 100 : percent < 0 ? 0 : percent;
	}

	get notValidError() {
		return this.$t("INPUT_FEE.ERROR.NOT_VALID");
	}

	get maxV1fee() {
		const defaultMaxV1Fee = V1.fees[`GROUP_${this.transactionGroup}`][this.transactionType];
		const staticFee = this.$store.getters["transaction/staticFee"](this.transactionType, this.transactionGroup);
		return staticFee || defaultMaxV1Fee;
	}

	get isStaticFee() {
		if (this.feeChoices.MAXIMUM.isEqualTo(this.feeChoices.AVERAGE)) {
			return this.feeChoices.AVERAGE.isEqualTo(this.fee);
		}
		return false;
	}

	get isAdvancedFee() {
		return this.chosenFee === "ADVANCED";
	}

	get feeNetwork() {
		// @ts-ignore
		return this.walletNetwork || this.session_network;
	}

	get feeStatistics() {
		if (!this.feeNetwork) {
			throw new Error("No active network to fetch fees");
		}

		const { feeStatistics } = this.feeNetwork;
		if (feeStatistics) {
			let transactionStatistics;
			if (feeStatistics[0]) {
				transactionStatistics = Object.values(feeStatistics).find(
					// @ts-ignore
					(feeConfig) => feeConfig.type === this.transactionType,
				);
			} else if (feeStatistics[this.transactionGroup]) {
				transactionStatistics = Object.values(feeStatistics[this.transactionGroup]).find(
					// @ts-ignore
					(feeConfig) => feeConfig.type === this.transactionType,
				);
			}

			if (transactionStatistics) {
				return transactionStatistics.fees;
			}
		}

		return {
			avgFee: this.maxV1fee,
			maxFee: this.maxV1fee,
			minFee: 1,
		};
	}

	get lastFee() {
		return this.$store.getters["session/lastFeeByType"](this.transactionType, this.transactionGroup);
	}

	get feeChoiceMin() {
		// @ts-ignore
		return this.currency_subToUnit(1);
	}

	get feeChoiceMax() {
		return this.isAdvancedFee ? this.feeChoices.MAXIMUM.multipliedBy(10) : this.feeChoices.MAXIMUM;
	}

	get feeChoices() {
		const { avgFee, maxFee, minFee } = this.feeStatistics;

		// If any of the fees are higher than the maximum V1 fee, than use the maximum.
		// @ts-ignore
		const average = this.currency_subToUnit(avgFee < this.maxV1fee ? avgFee : this.maxV1fee);
		// @ts-ignore
		const minimum = this.currency_subToUnit(minFee < this.maxV1fee ? minFee : this.maxV1fee);
		// @ts-ignore
		const maximum = this.currency_subToUnit(maxFee < this.maxV1fee ? maxFee : this.maxV1fee);

		const fees = {
			MINIMUM: minimum,
			AVERAGE: average,
			MAXIMUM: maximum,
			INPUT: average,
			ADVANCED: average,
		};

		// @ts-ignore
		return this.lastFee ? Object.assign({}, { LAST: this.currency_subToUnit(this.lastFee) }, fees) : fees;
	}

	get minimumError() {
		// @ts-ignore
		const min = this.feeChoiceMin;
		// @ts-ignore
		const fee = this.currency_format(min, { currency: this.currency, currencyDisplay: "code" });
		return this.$t("INPUT_FEE.ERROR.LESS_THAN_MINIMUM", { fee });
	}

	get maximumError() {
		if (!this.isAdvancedFee) {
			const max = this.feeChoices.MAXIMUM;
			// @ts-ignore
			const fee = this.currency_format(max, { currency: this.currency, currencyDisplay: "code" });
			return this.$t("INPUT_FEE.ERROR.MORE_THAN_MAXIMUM", { fee });
		}
		return null;
	}

	get insufficientFundsError() {
		if (!this.showInsufficientFunds) {
			return null;
		}

		if (!this.currentWallet) {
			return null;
		}

		// @ts-ignore
		const funds = this.currency_subToUnit(this.currentWallet.balance);
		if (funds.isLessThan(this.fee)) {
			// @ts-ignore
			const balance = this.formatter_networkCurrency(this.currentWallet.balance);
			return this.$t("TRANSACTION_FORM.ERROR.NOT_ENOUGH_BALANCE", { balance });
		}
		return null;
	}

	get warningText() {
		if (this.isAdvancedFee) {
			return this.$t("INPUT_FEE.ADVANCED_NOTICE");
		}
		if (this.feeChoices.AVERAGE.isGreaterThan(this.fee)) {
			return this.$t("INPUT_FEE.LOW_FEE_NOTICE");
		}
		return null;
	}

	created() {
		// Fees should be synchronized only when this component is active
		// @ts-ignore
		this.$synchronizer.appendFocus("fees");

		// @ts-ignore
		if (this.lastFee && this.session_profile.defaultChosenFee === "LAST") {
			// @ts-ignore
			this.onChoice(this.session_profile.defaultChosenFee);
		} else {
			this.emitFee(this.feeChoices.AVERAGE);
		}
	}

	beforeDestroy() {
		// @ts-ignore
		this.$synchronizer.removeFocus("fees");
	}

	focusInput() {
		// @ts-ignore
		this.$refs.input.focus();
	}

	onChoice(choice) {
		this.chosenFee = choice;
		if (["INPUT", "ADVANCED"].includes(this.chosenFee)) {
			this.focusInput();
		}

		const fee = this.feeChoices[choice];
		this.emitFee(fee);
	}

	onChange(fee) {
		fee = fee.toString();
		this.emitFee(fee);
	}

	onRawInput(fee) {
		if (!["INPUT", "ADVANCED"].includes(this.chosenFee)) {
			this.chosenFee = "INPUT";
		}

		fee = fee.toString();
		this.$set(this.feeChoices, this.chosenFee, fee);
	}

	onSlider(fee) {
		if (!["INPUT", "ADVANCED"].includes(this.chosenFee)) {
			this.chosenFee = "INPUT";
		}

		this.$set(this.feeChoices, this.chosenFee, fee);
		this.emitFee(fee);
	}

	setFee(fee) {
		// @ts-ignore
		fee = this.currency_toBuilder(fee).toString();

		this.fee = fee;
		this.$v.fee.$touch();
	}

	emitFee(fee) {
		this.setFee(fee);
		this.$emit("input", this.fee);
	}

	validations = {
		fee: {
			isValid() {
				// @ts-ignore
				if (this.$refs.input) {
					// @ts-ignore
					return !this.$refs.input.$v.$invalid && !this.insufficientFundsError;
				}
				return false;
			},
		},
	};
}
</script>

<style>
.InputFee .InputField__input {
	border-bottom-width: 0px !important;
}
.InputFee .InputCurrency input {
	/* This width is necessary to display error messages in 1 line */
	width: 10rem;
	flex-grow: 0;
}
.InputFee .InputField__helper {
	margin-top: 1.2rem;
}
</style>

<style lang="postcss" scoped>
.InputFee {
	--margin-top: 2rem;
	--height: 3rem;
	--bg-colour: var(--theme-modal);
	--total-height: calc(var(--margin-top) + var(--height));
	--range-handler-height: 1rem;
	--range-handler-border: 0.35rem;
	--range-track-hidden-height: 0.6rem;
	--range-track-height: 0.4rem;
	--range-track-border: 0.25rem;
	--gradient-height: 3.6rem;
	--gradient-top: -50%;
	margin-top: var(--margin-top);
	margin-bottom: 0.9rem;
	height: var(--height);
}
/* The gradient and the layer that hides it have the same height */
.InputFee__gradient,
.InputFee__hidden-gradient {
	height: var(--gradient-height);
	top: var(--gradient-top);
}
.InputFee__gradient {
	left: 0;
	background: linear-gradient(115deg, var(--theme-fee-gradient-start) 5%, var(--theme-fee-gradient-end));
}
.InputFee__hidden-gradient {
	right: 0;
	background-color: var(--bg-colour);
}
.InputFee__range-track {
	height: var(--range-track-height);
	top: calc((var(--gradient-top) - var(--range-track-height)) * -1);
	left: 0;
	background-color: var(--theme-fee-range-track-active);
	z-index: 10;
	box-shadow: 0 2px 8px var(--theme-fee-range-shadow);
}

input[type="range"] {
	/* Hides the slider so that custom slider can be made */
	-webkit-appearance: none;
	margin-top: calc(var(--range-handler-height));
	background: transparent;
	cursor: pointer;
}
input[type="range"]::-webkit-slider-runnable-track {
	/* This height increases the area that can be clicked and dragged, although only the border is visible */
	height: var(--range-track-hidden-height);
	background-color: var(--bg-colour);
	margin-bottom: calc((var(--total-height) - var(--gradient-height)) * -1);
	border-top: var(--theme-fee-range-track) solid var(--range-track-border);
}
input[type="range"]::-webkit-slider-thumb {
	-webkit-appearance: none;
	margin-top: calc(var(--range-handler-height) / -2);
	bottom: 0px;
	height: var(--range-handler-height);
	width: var(--range-handler-height);
	border-radius: 30%;
	border: var(--range-handler-border) solid var(--theme-fee-handler-outside);
	background-color: var(--theme-fee-handler-inside);
	position: relative;
	z-index: 30;
	box-shadow: 0 2px 12px var(--theme-fee-range-shadow);
}

.InputFee__currency-input-container {
	left: 0;
	top: -50%;
}

.InputFee__choices {
	right: 0;
	top: 0;
}

.InputFee__choice {
	margin-left: 0.3rem;
	margin-right: 0.2rem;
	transition: opacity 0.3s;
	@apply .text-theme-page-text-light;
}
.InputFee__choice:hover {
	opacity: 0.5;
}
.InputFee__choice--active {
	@apply .rounded .bg-theme-button-special-choice .text-white .p-1;
}
</style>
