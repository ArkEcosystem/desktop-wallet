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
			class="InputAddress text-left"
		>
			<div slot-scope="{ inputClass }" :class="inputClass" class="flex flex-row">
				<input
					ref="input"
					v-model="model"
					:name="name"
					:disabled="isDisabled"
					type="text"
					class="InputAddress__input flex flex-grow bg-transparent text-theme-page-text"
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
					class="InputAddress__qr-button flex flex-shrink-0 text-grey-dark hover:text-blue"
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
import { Vue, Component, Prop } from "vue-property-decorator";
import Cycled from "cycled";
import { orderBy, unionBy } from "lodash";
import { required } from "vuelidate/lib/validators";

import { ButtonModal } from "@/components/Button";
import { MenuDropdown } from "@/components/Menu";
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
			this.updateInputValue(val);
		},

		isFocused() {
			if (this.isFocused && this.hasSuggestions) {
				this.openDropdown();
			}
		},

		async inputValue() {
			this.dropdownValue = null;
			if (this.isFocused && this.hasSuggestions) {
				this.openDropdown();
			}

			if (this.invalid) {
				this.notice = null;
			} else {
				const knownAddress = this.wallet_name(this.inputValue);

				if (knownAddress) {
					this.notice = this.$t("INPUT_ADDRESS.KNOWN_ADDRESS", { address: knownAddress });
				} else if (await this.checkNeoAddress(this.inputValue)) {
					this.notice = this.$t("INPUT_ADDRESS.NEO_ADDRESS");
				} else {
					this.notice = null;
				}
			}
		},
	}
})
export default class InputAddress extends Vue {
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
        default: true,
    })
    isRequired;

    @Prop({
        type: String,
        required: false,
        default() {
            return this.$t("INPUT_ADDRESS.LABEL");
        },
    })
    label;

    @Prop({
        type: String,
        required: false,
        default: "address",
    })
    name;

    @Prop({
        type: Number,
        required: true,
    })
    pubKeyHash;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    showSuggestions;

    @Prop({
        type: String,
        required: true,
    })
    value;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    isInvalid;

    @Prop({
        type: String,
        required: false,
        default: null,
    })
    warningText;

    inputValue = vm.value;
    dropdownValue = null;
    isFocused = false;
    neoCheckedAddressess = {};
    notice = null;

    get currentProfile() {
        return this.session_profile;
    }

    get error() {
        let error = null;

        if (!this.isDisabled && this.$v.model.$dirty && !(this.hasSuggestions && this.isFocused)) {
            if (!this.$v.model.required) {
                error = this.$t("INPUT_ADDRESS.ERROR.REQUIRED");
            } else if (!this.$v.model.isValid) {
                error = this.$t("INPUT_ADDRESS.ERROR.NOT_VALID");
            }
        }

        return error;
    }

    get hasSuggestions() {
        return !isEmpty(this.suggestions);
    }

    get invalid() {
        return this.$v.model.$dirty && (this.isInvalid || !!this.error);
    }

    get TODO_model() {}

    get suggestions() {
        if (!this.currentProfile || !this.showSuggestions) {
            return [];
        }

        const ledgerWallets = this.$store.getters["ledger/isConnected"]
            ? this.$store.getters["ledger/wallets"]
            : [];
        const wallets = [...this.$store.getters["wallet/byProfileId"](this.currentProfile.id), ...ledgerWallets];
        const contacts = this.$store.getters["wallet/contactsByProfileId"](this.currentProfile.id);

        const source = unionBy(wallets, contacts, "address").filter((wallet) => wallet && !!wallet.address);

        const addresses = source.map((wallet) => {
            const address = {
                name: null,
                address: wallet.address,
            };

            const walletName = this.wallet_name(wallet.address);
            if (walletName && walletName !== wallet.address) {
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

            if (searchValue && searchValue.includes(this.inputValue.toLowerCase())) {
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
        this.$refs.input.blur();
    }

    focus() {
        this.$refs.input.focus();
    }

    //*
             * Checks if there is a NEO wallet with the same address and memoizes the result
             * @param {String}
             * @result {Boolean}

    checkNeoAddress(address) {
        const wasChecked = Object.prototype.hasOwnProperty.call(this.neoCheckedAddressess, address);
        if (!wasChecked) {
            this.neoCheckedAddressess[address] = await WalletService.isNeoAddress(address);
        }
        return this.neoCheckedAddressess[address];
    }

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
        } else if (this.$refs.dropdown.isOpen) {
            this.closeDropdown();
        }

        this.isFocused = false;

        // If the user selects a suggestion and leaves the input
        if (this.dropdownValue) {
            this.onEnter();
        }
    }

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

    onDecodeQR(value, toggle) {
        this.model = this.qr_getAddress(value);

        // Check if we were unable to retrieve an address from the qr
        if ((this.inputValue === "" || this.inputValue === undefined) && this.inputValue !== value) {
            this.$error(this.$t("MODAL_QR_SCANNER.DECODE_FAILED", { data: value }));
        }
        toggle();
    }

    closeDropdown() {
        this.$refs.dropdown.close();
    }

    openDropdown() {
        this.$refs.dropdown.open();
    }

    updateInputValue(value) {
        this.inputValue = value;

        this.$eventBus.emit("change");

        // Inform Vuelidate that the value changed
        this.$v.model.$touch();
    }

    __setSuggestion(value) {
        if (!this.hasSuggestions) {
            return;
        }

        this.dropdownValue = value;
        this.$nextTick(() => {
            this.$refs.input.setSelectionRange(this.inputValue.length, this.dropdownValue.length);
        });
    }

    reset() {
        this.model = "";
        this.$nextTick(() => {
            this.$v.$reset();
        });
    }

    validations = {
		model: {
			required(value) {
				return this.isRequired ? required(value) : true;
			},

			isValid(value) {
				if (!this.isRequired && value.replace(/\s+/, "") === "") {
					return true;
				}

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
