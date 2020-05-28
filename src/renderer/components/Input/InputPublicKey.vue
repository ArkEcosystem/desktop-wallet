<template>
	<InputText
		ref="publicKey"
		v-model="$v.model.$model"
		:is-invalid="!!error"
		:helper-text="error"
		:label="publicKeyLabel"
		:maxlength="66"
		class="InputPublicKey"
		name="publicKey"
	/>
</template>

<script lang="ts">
import { Identities } from "@arkecosystem/crypto";
import { Component, Model, Prop, Vue, Watch } from "vue-property-decorator";

import InputText from "./InputText";

@Component({
	name: "InputPublicKey",

	components: {
		InputText,
	},
})
export default class InputPublicKey extends Vue {
	@Model("input", {
		type: String,
		required: false,
		default: "",
	})
	value;

	@Prop({
		type: Boolean,
		required: false,
		default: true,
	})
	isRequired;

	inputValue = null;

	@Watch("value")
	onValue(value) {
		// @ts-ignore
		this.inputValue = value;
	}

	data(vm) {
		return {
			inputValue: vm.value,
		};
	}

	get model() {
		return this.inputValue;
	}

	set model(value) {
		this.inputValue = value;
		this.$v.model.$touch();
		this.$emit("input", value);
	}

	get publicKeyLabel() {
		return this.$t("INPUT_PUBLIC_KEY.TITLE");
	}

	get error() {
		if (this.$v.model.$dirty && this.$v.model.$invalid) {
			if (!this.$v.model.isValid) {
				return this.$t("INPUT_PUBLIC_KEY.ERROR.NOT_VALID");
			}
		}

		return null;
	}

	reset() {
		// @ts-ignore
		this.model = "";
		this.$nextTick(() => {
			this.$v.$reset();
		});
	}

	validations() {
		return {
			model: {
				isValid(value) {
					// @ts-ignore
					if (!this.isRequired && value.replace(/\s+/, "") === "") {
						return true;
					}

					try {
						Identities.Address.fromPublicKey(value);

						return true;
					} catch (error) {
						//
					}

					return false;
				},
			},
		};
	}
}
</script>
