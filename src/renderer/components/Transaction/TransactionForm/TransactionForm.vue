<template>
	<Component :is="activeComponent" v-bind="$attrs" @cancel="emitCancel" @next="emitBuilt" />
</template>

<script>
/* eslint-disable vue/no-unused-components */
import { TRANSACTION_GROUPS } from "@config";
import { Component, Prop,Vue } from "vue-property-decorator";

import TransactionFormBridgechain from "./TransactionFormBridgechain";
import TransactionFormBusiness from "./TransactionFormBusiness";
import TransactionFormDelegateRegistration from "./TransactionFormDelegateRegistration";
import TransactionFormDelegateResignation from "./TransactionFormDelegateResignation";
import TransactionFormIpfs from "./TransactionFormIpfs";
import TransactionFormMultiSign from "./TransactionFormMultiSign";
import TransactionFormMultiSignature from "./TransactionFormMultiSignature";
import TransactionFormSecondSignature from "./TransactionFormSecondSignature";
import TransactionFormTransfer from "./TransactionFormTransfer";
import TransactionFormVote from "./TransactionFormVote";

@Component({
    name: "TransactionForm",

    components: {
		TransactionFormDelegateRegistration,
		TransactionFormDelegateResignation,
		TransactionFormIpfs,
		TransactionFormMultiSign,
		TransactionFormMultiSignature,
		TransactionFormTransfer,
		TransactionFormVote,
		TransactionFormSecondSignature,
		...TransactionFormBusiness,
		...TransactionFormBridgechain,
	}
})
export default class TransactionForm extends Vue {
    @Prop({
        type: Number,
        required: false,
        default: TRANSACTION_GROUPS.STANDARD,
    })
    group;

    @Prop({
        type: Number,
        required: true,
    })
    type;

    activeComponent = null;

    // TODO: Fetch fees remotely
    mounted() {
		const group = this.type === -1 ? TRANSACTION_GROUPS.STANDARD : this.group;
		const component = Object.values(this.$options.components).find((component) => {
			if ((component.transactionGroup || TRANSACTION_GROUPS.STANDARD) !== group) {
				return false;
			}

			return component.transactionType === this.type;
		});

		if (!component) {
			throw new Error(`[TransactionForm] - Form for type ${this.type} (group ${group}) not found.`);
		}

		this.activeComponent = component.name;
	}

    emitBuilt(transaction) {
        this.$emit("built", transaction);
    }

    emitCancel(reason) {
        this.$emit("cancel", reason);
    }
}
</script>
