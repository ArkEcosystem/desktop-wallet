<template>
	<ModalWindow container-classes="w-2/5" @close="emitClose">
		<section class="flex flex-col">
			<h2 class="mb-1">
				{{ $t("MODAL_ADDITIONAL_LEDGERS.TITLE") }}
			</h2>

			<p>{{ $t("MODAL_ADDITIONAL_LEDGERS.INFO", { quantity: currentLedgerQuantity }) }}</p>

			<InputText
				ref="input-quantity"
				key="quantity"
				v-model="$v.form.quantity.$model"
				:helper-text="quantityError"
				:is-invalid="$v.form.quantity.$dirty && $v.form.quantity.$invalid"
				:label="$t('MODAL_ADDITIONAL_LEDGERS.QUANTITY')"
				:title="$t('MODAL_ADDITIONAL_LEDGERS.QUANTITY')"
				class="mt-3"
				name="quantity"
			/>

			<div v-if="quantityWarning" class="pl-2 mt-4 border-l-4 border-theme-button-text">
				<span class="font-bold text-theme-button-text">
					{{ $t("WALLET_DELEGATES.VOTE_INFO") }}
				</span>
				<strong>
					{{ quantityWarning }}
				</strong>
			</div>

			<div class="flex mt-5">
				<ButtonGeneric :label="$t('MODAL_ADDITIONAL_LEDGERS.CANCEL')" class="mr-5" @click="emitClose" />
				<ButtonGeneric
					:disabled="$v.form.$invalid"
					:label="$t('MODAL_ADDITIONAL_LEDGERS.LOAD')"
					@click="submit"
				/>
			</div>
		</section>
	</ModalWindow>
</template>

<script>
import { Component, Prop,Vue } from "vue-property-decorator";
import { minValue, numeric, required } from "vuelidate/lib/validators";

import { ButtonGeneric } from "@/components/Button";
import { InputText } from "@/components/Input";
import ModalWindow from "@/components/Modal/ModalWindow";
import { StoreBinding } from "@/enums";

@Component({
    name: "ModalAdditionalLedgers",

    components: {
		ButtonGeneric,
		InputText,
		ModalWindow,
	}
})
export default class ModalAdditionalLedgers extends Vue {
    @Prop({
        type: Number,
        required: false,
        default: 50,
    })
    largeQuantity;

    form = {
        quantity: "",
    };

    get currentLedgerQuantity() {
        return this.$store.getters["ledger/wallets"].length;
    }

    get quantityError() {
        if (this.$v.form.quantity.$dirty) {
            if (!this.$v.form.quantity.required) {
                return this.$t("VALIDATION.REQUIRED", [this.$refs["input-quantity"].label]);
            } else if (!this.$v.form.quantity.numeric) {
                return this.$t("VALIDATION.NOT_NUMERIC", [this.$refs["input-quantity"].label]);
            } else if (!this.$v.form.quantity.minValue) {
                return this.$t("VALIDATION.MUST_BE_GREATER_THAN", [0]);
            }
        }

        return null;
    }

    get quantityWarning() {
        if (this.$v.form.quantity.$dirty && this.$v.form.quantity.$model > this.largeQuantity) {
            return this.$t("MODAL_ADDITIONAL_LEDGERS.LARGE_QUANTITY");
        }

        return null;
    }

    submit() {
        this.$store.dispatch(StoreBinding.LedgerReloadWallets, {
            clearFirst: true,
            forceLoad: true,
            quantity: this.form.quantity,
        });

        this.emitClose(true);
    }

    emitClose(closeMenu = false) {
        this.$emit("close", closeMenu);
    }

    validations = {
		form: {
			quantity: {
				numeric,
				required,
				minValue: minValue(1),
			},
		},
	};
}
</script>
