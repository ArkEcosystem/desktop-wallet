<template>
	<MenuDropdown
		ref="dropdown"
		:items="suggestions"
		:value="dropdownValue"
		:pin-to-input-width="true"
		class="InputDelegate__MenuDropdown"
		@select="onDropdownSelect"
		@click="focus"
	>
		<InputField
			slot="handler"
			:label="label"
			:helper-text="error || getHelperText()"
			:is-dirty="$v.model.$dirty"
			:is-focused="isFocused"
			:is-invalid="invalid"
			class="text-left InputDelegate"
		>
			<div slot-scope="{ inputClass }" :class="inputClass" class="flex flex-row">
				<input
					ref="input"
					v-model="model"
					:name="name"
					type="text"
					class="flex flex-grow bg-transparent InputDelegate__input text-theme-page-text"
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
					class="flex flex-shrink-0 InputDelegate__qr-button text-grey-dark hover:text-blue"
					icon="qr"
					view-box="0 0 20 20"
					@click.stop
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
import { orderBy } from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { required } from "vuelidate/lib/validators";

import { ButtonModal } from "@/components/Button";
import { MenuDropdown } from "@/components/Menu";
// @ts-ignore
import ModalQrCodeScanner from "@/components/Modal/ModalQrCodeScanner";
import { isEmpty } from "@/utils";

// @ts-ignore
import InputField from "./InputField";

@Component({
	name: "InputDelegate",

	components: {
		ButtonModal,
		InputField,
		ModalQrCodeScanner,
		MenuDropdown,
	},
})
export default class InputDelegate extends Vue {
	@Prop({
		type: String,
		required: false,
		default() {
			// @ts-ignore
			return this.$t("SEARCH.DELEGATE");
		},
	})
	label;

	@Prop({
		type: String,
		required: false,
		default: "delegate",
	})
	name;

	@Prop({
		type: String,
		required: false,
		default: () => "",
	})
	helperText;

	@Prop({
		type: String,
		required: true,
		default: () => "",
	})
	value;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isInvalid;

	inputValue = null;
	dropdownValue = null;
	isFocused = false;

	@Watch("value")
	onValueChanged(val) {
		// @ts-ignore
		this.updateInputValue(val);
	}

	@Watch("isFocused")
	onIsFocusedChanged() {
		// @ts-ignore
		if (this.isFocused && this.hasSuggestions) {
			// @ts-ignore
			this.openDropdown();
		}
	}

	@Watch("inputValue")
	onInputValueChanged() {
		// @ts-ignore
		this.dropdownValue = null;
		// @ts-ignore
		if (this.isFocused && this.hasSuggestions) {
			// @ts-ignore
			this.openDropdown();
		}
	}

	data(vm) {
		return {
			inputValue: vm.value,
		};
	}

	get currentProfile() {
		// @ts-ignore
		return this.session_profile;
	}

	get delegates() {
		return Object.values(this.$store.getters["delegate/bySessionNetwork"] || {});
	}

	get error() {
		// @ts-ignore
		if (this.$v.model.$dirty && (!this.hasSuggestions || !this.$refs.dropdown.isOpen)) {
			if (!this.$v.model.required) {
				return this.$t("INPUT_DELEGATE.ERROR.REQUIRED");
			} else if (!this.$v.model.isValid) {
				// @ts-ignore
				if (this.inputValue.length <= 20) {
					return this.$t("INPUT_DELEGATE.ERROR.USERNAME_NOT_FOUND", [this.inputValue]);
					// @ts-ignore
				} else if (this.inputValue.length <= 34) {
					// @ts-ignore
					return this.$t("INPUT_DELEGATE.ERROR.ADDRESS_NOT_FOUND", [this.wallet_truncate(this.inputValue)]);
				} else {
					return this.$t("INPUT_DELEGATE.ERROR.PUBLIC_KEY_NOT_FOUND", [
						// @ts-ignore
						this.wallet_truncate(this.inputValue),
					]);
				}
			} else {
				this.$emit("valid", true);
			}
		} else {
			this.$emit("valid", false);
		}

		return null;
	}

	get hasSuggestions() {
		return !isEmpty(this.suggestions);
	}

	get invalid() {
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
		if (!this.currentProfile) {
			return [];
		}

		const delegates = this.delegates.map((object) => {
			const delegate = {
				name: null,
				// @ts-ignore
				username: object.username,
				// @ts-ignore
				address: object.address,
				// @ts-ignore
				publicKey: object.publicKey,
			};

			// @ts-ignore
			delegate.name = `${object.username} (${this.wallet_truncate(object.address)})`;

			return delegate;
		});

		const results = orderBy(delegates, (object) => {
			return object.name || object.address.toLowerCase();
		});

		return results.reduce((delegates, delegate) => {
			Object.values(delegate).forEach((prop) => {
				// @ts-ignore
				if (prop.toLowerCase().includes(this.inputValue.toLowerCase())) {
					delegates[delegate.username] = delegate.name;
				}
			});

			return delegates;
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

	getHelperText() {
		// @ts-ignore
		return !this.$refs.dropdown || !this.$refs.dropdown.isOpen ? this.helperText : "";
	}

	blur() {
		// @ts-ignore
		this.$refs.input.blur();
	}

	focus() {
		// @ts-ignore
		this.$refs.input.focus();
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

	onDecodeQR(value, toggle) {
		// @ts-ignore
		const address = this.qr_getAddress(value);

		// Check if we were unable to retrieve an address from the qr
		if ((address === "" || address === undefined) && address !== value) {
			// @ts-ignore
			this.$error(this.$t("MODAL_QR_SCANNER.DECODE_FAILED", { data: value }));
		}

		const delegate = this.$store.getters["delegate/byAddress"](address);
		this.model = delegate ? delegate.username : address;

		this.$nextTick(() => {
			this.closeDropdown();
			toggle();
		});
	}

	closeDropdown() {
		// @ts-ignore
		this.$refs.dropdown.close();
	}

	openDropdown() {
		// @ts-ignore
		this.$refs.dropdown.open();
	}

	updateInputValue(value) {
		this.inputValue = value;
		// Inform Vuelidate that the value changed
		this.$v.model.$touch();
	}

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

	validations() {
		return {
			model: {
				required,
				isValid(value) {
					// @ts-ignore
					return !!this.$store.getters["delegate/search"](value);
				},
			},
		};
	}
}
</script>

<style lang="postcss" scoped>
.InputDelegate__MenuDropdown .MenuDropdown__container {
	@apply .z-30;
}
.InputDelegate__MenuDropdown .MenuDropdownItem__container {
	@apply .text-left;
}
.InputDelegate__input::placeholder {
	@apply .text-transparent;
}

.InputField--invalid .InputDelegate__qr-button {
	@apply .text-red-dark;
}
</style>
