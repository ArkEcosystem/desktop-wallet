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
import { Component, Prop,Vue } from "vue-property-decorator";

import InputText from "./InputText";

@Component({
    name: "InputPublicKey",

    components: {
		InputText,
	},

    model: {
		prop: "value",
		event: "input",
	},

    watch: {
		value(value) {
			this.inputValue = value;
		},
	}
})
export default class InputPublicKey extends Vue {
    @Prop({
        type: Boolean,
        required: false,
        default: true,
    })
    isRequired;

    @Prop({
        type: String,
        required: false,
        default: "",
    })
    value;

    inputValue = vm.value;
    get TODO_model() {}

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
        this.model = "";
        this.$nextTick(() => {
            this.$v.$reset();
        });
    }

    validations = {
		model: {
			isValid(value) {
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
</script>
