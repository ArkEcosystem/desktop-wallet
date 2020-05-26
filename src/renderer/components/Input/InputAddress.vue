<template>
	<MenuDropdown
		ref="dropdown"
		:items="suggestions"
		:value="dropdownValue"
		:pin-to-input-width="true"
		class="InputAddress__MenuDropdown"
		@select="onDropdownSelect"
		@click="focus"
	>
		<InputField
			slot="handler"
			:label="label"
			:helper-text="helperText || error || notice"
			:is-dirty="$v.model.$dirty"
			:is-disabled="isDisabled"
			:is-focused="isFocused"
			:is-invalid="invalid"
			:warning-text="warningText"
			class="text-left InputAddress"
		>
			<div slot-scope="{ inputClass }" :class="inputClass" class="flex flex-row">
				<input
					ref="input"
					v-model="model"
					:name="name"
					:disabled="isDisabled"
					type="text"
					class="flex flex-grow bg-transparent InputAddress__input text-theme-page-text"
					@blur="onBlur"
					@focus="onFocus"
					@click.self.stop
					@keyup.up="onKeyUp"
					@keyup.down="onKeyDown"
					@keyup.esc="onEsc"
					@keyup.enter="onEnter"
				/>
				<ButtonModal
					ref="button-qr"
					:label="''"
					class="flex flex-shrink-0 InputAddress__qr-button text-grey-dark hover:text-blue"
					icon="qr"
					view-box="0 0 20 20"
				>
					<template slot-scope="{ toggle, isOpen }">
						<ModalQrCodeScanner v-if="isOpen" :toggle="toggle" @close="toggle" @decoded="onDecodeQR" />
					</template>
				</ButtonModal>
			</div>
		</InputField>
	</MenuDropdown>
</template>

<script lang="ts">
import Cycled from "cycled";
import { orderBy, unionBy } from "lodash";
import { Component, Prop, Vue } from "vue-property-decorator";
// @ts-ignore
import { required } from "vuelidate/lib/validators";

import { ButtonModal } from "@/components/Button";
import { MenuDropdown } from "@/components/Menu";
// @ts-ignore
import ModalQrCodeScanner from "@/components/Modal/ModalQrCodeScanner";
import truncate from "@/filters/truncate";
import WalletService from "@/services/wallet";
import { isEmpty } from "@/utils";

import InputField from "./InputField";

@Component({
	name: "InputAddress",

	components: {
		ButtonModal,
		InputField,
		ModalQrCodeScanner,
		MenuDropdown,
	},

	watch: {
		value(val) {
			// @ts-ignore
			this.updateInputValue(val);
		},

		isFocused() {
			// @ts-ignore
			if (this.isFocused && this.hasSuggestions) {
				// @ts-ignore
				this.openDropdown();
			}
		},

		async inputValue() {
			// @ts-ignore
			this.dropdownValue = null;
			// @ts-ignore
			if (this.isFocused && this.hasSuggestions) {
				// @ts-ignore
				this.openDropdown();
			}

			// @ts-ignore
			if (this.invalid) {
				// @ts-ignore
				this.notice = null;
			} else {
				// @ts-ignore
				const knownAddress = this.wallet_name(this.inputValue);

				if (knownAddress) {
					// @ts-ignore
					this.notice = this.$t("INPUT_ADDRESS.KNOWN_ADDRESS", { address: knownAddress });
					// @ts-ignore
				} else if (await this.checkNeoAddress(this.inputValue)) {
					// @ts-ignore
					this.notice = this.$t("INPUT_ADDRESS.NEO_ADDRESS");
				} else {
					// @ts-ignore
					this.notice = null;
				}
			}
		},
	},
})
export default class InputAddress extends Vue {
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
		type: Boolean,
		required: false,
		default: true,
	})
	// @ts-ignore
	isRequired;

	@Prop({
		type: String,
		required: false,
		default() {
			// @ts-ignore
			return this.$t("INPUT_ADDRESS.LABEL");
		},
	})
	// @ts-ignore
	label;

	@Prop({
		type: String,
		required: false,
		default: "address",
	})
	// @ts-ignore
	name;

	@Prop({
		type: Number,
		required: true,
	})
	// @ts-ignore
	pubKeyHash;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	// @ts-ignore
	showSuggestions;

	@Prop({
		type: String,
		required: true,
	})
	// @ts-ignore
	value;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	// @ts-ignore
	isInvalid;

	@Prop({
		type: String,
		required: false,
		default: null,
	})
	// @ts-ignore
	warningText;

	inputValue = null;
	dropdownValue = null;
	isFocused = false;
	neoCheckedAddressess = {};
	notice = null;

	// @ts-ignore
	data(vm) {
		return {
			inputValue: vm.value,
		};
	}

	get currentProfile() {
		// @ts-ignore
		return this.session_profile;
	}

	get error() {
		let error = null;

		// @ts-ignore
		if (!this.isDisabled && this.$v.model.$dirty && !(this.hasSuggestions && this.isFocused)) {
			// @ts-ignore
			if (!this.$v.model.required) {
				// @ts-ignore
				error = this.$t("INPUT_ADDRESS.ERROR.REQUIRED");
				// @ts-ignore
			} else if (!this.$v.model.isValid) {
				// @ts-ignore
				error = this.$t("INPUT_ADDRESS.ERROR.NOT_VALID");
			}
		}

		return error;
	}

	get hasSuggestions() {
		return !isEmpty(this.suggestions);
	}

	get invalid() {
		// @ts-ignore
		return this.$v.model.$dirty && (this.isInvalid || !!this.error);
	}

	get model() {
		return this.dropdownValue || this.inputValue;
	}

	set model(value) {
		this.updateInputValue(value);
		this.$emit("input", value);
	}

	get suggestions() {
		if (!this.currentProfile || !this.showSuggestions) {
			return [];
		}

		const ledgerWallets = this.$store.getters["ledger/isConnected"] ? this.$store.getters["ledger/wallets"] : [];
		const wallets = [...this.$store.getters["wallet/byProfileId"](this.currentProfile.id), ...ledgerWallets];
		const contacts = this.$store.getters["wallet/contactsByProfileId"](this.currentProfile.id);

		const source = unionBy(wallets, contacts, "address").filter((wallet) => wallet && !!wallet.address);

		const addresses = source.map((wallet) => {
			const address = {
				name: null,
				address: wallet.address,
			};

			// @ts-ignore
			const walletName = this.wallet_name(wallet.address);
			if (walletName && walletName !== wallet.address) {
				// @ts-ignore
				address.name = `${truncate(walletName, 25)} (${this.wallet_truncate(wallet.address)})`;
			}

			return address;
		});

		const results = orderBy(addresses, (object) => {
			return (object.name || object.address).toLowerCase();
		});

		return results.reduce((wallets, wallet) => {
			const value = wallet.name || wallet.address;
			const searchValue = value.toLowerCase();

			// @ts-ignore
			if (searchValue && searchValue.includes(this.inputValue.toLowerCase())) {
				// @ts-ignore
				wallets[wallet.address] = value;
			}

			return wallets;
		}, {});
	}

	get suggestionsKeys() {
		return new Cycled(Object.keys(this.suggestions));
	}

	mounted() {
		if (this.value) {
			this.updateInputValue(this.value);
		}
	}

	blur() {
		// @ts-ignore
		this.$refs.input.blur();
	}

	focus() {
		// @ts-ignore
		this.$refs.input.focus();
	}

	// @ts-ignore
	async checkNeoAddress(address) {
		const wasChecked = Object.prototype.hasOwnProperty.call(this.neoCheckedAddressess, address);
		if (!wasChecked) {
			// @ts-ignore
			this.neoCheckedAddressess[address] = await WalletService.isNeoAddress(address);
		}
		// @ts-ignore
		return this.neoCheckedAddressess[address];
	}

	// @ts-ignore
	onBlur(event) {
		// Verifies that the element that generated the blur was a dropdown item
		if (event.relatedTarget) {
			const classList = event.relatedTarget.classList;

			const isDropdownItem =
				classList && typeof classList.contains === "function"
					? classList.contains("MenuDropdownItem__button")
					: false;

			if (!isDropdownItem) {
				this.closeDropdown();
			}
			// @ts-ignore
		} else if (this.$refs.dropdown.isOpen) {
			this.closeDropdown();
		}

		this.isFocused = false;

		// If the user selects a suggestion and leaves the input
		if (this.dropdownValue) {
			this.onEnter();
		}
	}

	// @ts-ignore
	onDropdownSelect(value) {
		this.model = value;
		this.$nextTick(() => this.closeDropdown());
	}

	onFocus() {
		this.isFocused = true;
		this.$emit("focus");
	}

	onEnter() {
		if (!this.dropdownValue) {
			return;
		}

		this.model = this.dropdownValue;

		this.$nextTick(() => {
			this.closeDropdown();
			// @ts-ignore
			this.$refs.input.setSelectionRange(this.inputValue.length, this.inputValue.length);
		});
	}

	onEsc() {
		this.dropdownValue = null;
		this.closeDropdown();
	}

	onKeyUp() {
		const next = this.dropdownValue ? this.suggestionsKeys.previous() : this.suggestionsKeys.current();
		this.__setSuggestion(next);
	}

	onKeyDown() {
		const next = this.dropdownValue ? this.suggestionsKeys.next() : this.suggestionsKeys.current();
		this.__setSuggestion(next);
	}

	// @ts-ignore
	onDecodeQR(value, toggle) {
		// @ts-ignore
		this.model = this.qr_getAddress(value);

		// Check if we were unable to retrieve an address from the qr
		if ((this.inputValue === "" || this.inputValue === undefined) && this.inputValue !== value) {
			// @ts-ignore
			this.$error(this.$t("MODAL_QR_SCANNER.DECODE_FAILED", { data: value }));
		}
		toggle();
	}

	closeDropdown() {
		// @ts-ignore
		this.$refs.dropdown.close();
	}

	openDropdown() {
		// @ts-ignore
		this.$refs.dropdown.open();
	}

	// @ts-ignore
	updateInputValue(value) {
		this.inputValue = value;

		this.$eventBus.emit("change");

		// Inform Vuelidate that the value changed
		// @ts-ignore
		this.$v.model.$touch();
	}

	// @ts-ignore
	__setSuggestion(value) {
		if (!this.hasSuggestions) {
			return;
		}

		this.dropdownValue = value;
		this.$nextTick(() => {
			// @ts-ignore
			this.$refs.input.setSelectionRange(this.inputValue.length, this.dropdownValue.length);
		});
	}

	reset() {
		// @ts-ignore
		this.model = "";
		this.$nextTick(() => {
			// @ts-ignore
			this.$v.$reset();
		});
	}

	validations = {
		model: {
			// @ts-ignore
			required(value) {
				// @ts-ignore
				return this.isRequired ? required(value) : true;
			},

			// @ts-ignore
			isValid(value) {
				// @ts-ignore
				if (!this.isRequired && value.replace(/\s+/, "") === "") {
					return true;
				}

				// @ts-ignore
				return WalletService.validateAddress(value, this.pubKeyHash);
			},
		},
	};
}
</script>

<style lang="postcss" scoped>
.InputAddress__MenuDropdown .MenuDropdown__container {
	@apply .z-30;
}
.InputAddress__MenuDropdown .MenuDropdownItem__container {
	@apply .text-left;
}
.InputAddress__input::placeholder {
	@apply .text-transparent;
}

.InputField--invalid .InputAddress__qr-button {
	@apply .text-red-dark;
}
</style>
