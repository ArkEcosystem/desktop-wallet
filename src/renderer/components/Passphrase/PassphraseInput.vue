<template>
	<InputField
		:label="label"
		:helper-text="helperText || error"
		:is-dirty="$v.model.$dirty"
		:is-disabled="isDisabled"
		:is-focused="isFocused"
		:is-invalid="isInvalid"
		:warning-text="warning"
		class="PassphraseInput"
	>
		<div slot-scope="{ inputClass }" :class="inputClass" class="flex flex-row">
			<input
				ref="input"
				v-model="model"
				:name="name"
				:disabled="isDisabled"
				:type="passphraseIsVisible ? 'text' : 'password'"
				class="flex flex-grow mr-2 bg-transparent PassphraseInput__input text-theme-page-text"
				@blur="onBlur"
				@focus="onFocus"
			/>

			<button
				:title="$t(passphraseIsVisible ? 'PASSPHRASE_INPUT.HIDE' : 'PASSPHRASE_INPUT.SHOW')"
				class="flex items-center flex-shrink-0 mr-2 PassphraseInput__visibility-button text-grey-dark hover:text-blue focus:text-blue"
				type="button"
				@click="toggleVisible"
			>
				<SvgIcon :name="passphraseIsVisible ? 'passphrase-hide' : 'passphrase-show'" view-box="0 0 20 20" />
			</button>

			<ButtonModal
				ref="button-qr"
				:label="''"
				class="flex flex-shrink-0 PassphraseInput__qr-button text-grey-dark hover:text-blue focus:text-blue"
				icon="qr"
				view-box="0 0 20 20"
			>
				<template slot-scope="{ toggle, isOpen }">
					<ModalQrCodeScanner v-if="isOpen" :toggle="toggle" @close="toggle" @decoded="onDecode" />
				</template>
			</ButtonModal>
		</div>
	</InputField>
</template>

<script>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { required } from "vuelidate/lib/validators";

import { ButtonModal } from "@/components/Button";
import { InputField } from "@/components/Input";
import { ModalQrCodeScanner } from "@/components/Modal";
import SvgIcon from "@/components/SvgIcon";
import WalletService from "@/services/wallet";

@Component({
	name: "PassphraseInput",

	components: {
		ButtonModal,
		InputField,
		ModalQrCodeScanner,
		SvgIcon,
	},
})
export default class PassphraseInput extends Vue {
	@Prop({
		type: String,
		required: false,
		default: null,
	})
	address;

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
		default: false,
	})
	notBip39Warning;

	@Prop({
		type: String,
		required: false,
		default() {
			return this.$t("PASSPHRASE_INPUT.LABEL");
		},
	})
	label;

	@Prop({
		type: String,
		required: false,
		default: "passphrase",
	})
	name;

	@Prop({
		type: Number,
		required: true,
	})
	pubKeyHash;

	@Prop({
		type: String,
		required: false,
		default: null,
	})
	publicKey;

	@Prop({
		type: String,
		required: false,
		default: () => "",
	})
	value;

	inputValue = null;
	isFocused = false;
	passphraseIsVisible = null;

	@Watch("value")
	onValue(value) {
		this.inputValue = value;
	}

	data(vm) {
		return {
			inputValue: vm.value,
			passphraseIsVisible: vm.isVisible,
		};
	}

	get error() {
		if (this.$v.model.$dirty) {
			if (!this.$v.model.required) {
				return this.$t("VALIDATION.REQUIRED", [this.label]);
			} else if (!this.$v.model.isValid) {
				return this.$t("VALIDATION.NOT_VALID", [this.label]);
			} else if (!this.$v.model.matchAddress) {
				return this.$t("VALIDATION.NOT_MATCH", [this.label, "address"]);
			} else if (!this.$v.model.matchPublicKey) {
				return this.$t("VALIDATION.NOT_MATCH", [this.label, "address"]);
			}
		}

		return null;
	}

	get warning() {
		if (this.$v.model.$dirty) {
			if (this.notBip39Warning && !this.isBip39) {
				return this.$t("VALIDATION.WARNING_NOT_BIP39", [this.label]);
			}
		}

		return null;
	}

	get isInvalid() {
		return this.$v.model.$dirty && !!this.error;
	}

	get isBip39() {
		return (
			this.notBip39Warning && WalletService.isBip39Passphrase(this.inputValue, this.session_profile.bip39Language)
		);
	}

	get model() {
		return this.inputValue;
	}

	set model(value) {
		this.updateInputValue(value);
		this.$emit("input", value);
	}

	blur() {
		this.$refs.input.blur();
	}

	async focus() {
		await this.$nextTick();
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

	onDecode(value, toggle) {
		this.model = this.qr_getPassphrase(value);

		// Check if we were unable to retrieve a passphrase from the qr
		if ((this.inputValue === "" || this.inputValue === undefined) && this.inputValue !== value) {
			this.$error(this.$t("MODAL_QR_SCANNER.DECODE_FAILED", { data: value }));
		}
		toggle();
	}

	updateInputValue(value) {
		this.inputValue = value;
		// Inform Vuelidate that the value changed
		this.$v.model.$touch();
	}

	async toggleVisible() {
		this.passphraseIsVisible = !this.passphraseIsVisible;
		await this.focus();
	}

	validations() {
		return {
			model: {
				required,
				isValid(value) {
					return WalletService.validatePassphrase(value, this.pubKeyHash);
				},
				matchAddress(value) {
					if (this.address) {
						return WalletService.verifyPassphrase(this.address, value, this.pubKeyHash);
					}
					return true;
				},
				matchPublicKey(value) {
					if (this.publicKey) {
						const generatedPublicKey = WalletService.getPublicKeyFromPassphrase(value);
						return generatedPublicKey === this.publicKey;
					}
					return true;
				},
			},
		};
	}
}
</script>

<style lang="postcss" scoped>
.PassphraseInput__input::placeholder {
	@apply .text-transparent;
}
.InputField--invalid .PassphraseInput__qr-button,
.InputField--invalid .PassphraseInput__visibility-button {
	@apply .text-red-dark;
}
.InputField--warning .PassphraseInput__qr-button,
.InputField--warning .PassphraseInput__visibility-button {
	@apply .text-orange-dark;
}
</style>
