import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from "@config";

import mixin from "./mixin";

export default {
	name: "TransactionFormBusinessRegistration",

	transactionGroup: TRANSACTION_GROUPS.MAGISTRATE,

	transactionType: TRANSACTION_TYPES.GROUP_2.BUSINESS_REGISTRATION,

	mixins: [mixin],

	methods: {
		async buildTransaction(transactionData, isAdvancedFee = false, returnObject = false) {
			return this.$client.buildBusinessRegistration(transactionData, isAdvancedFee, returnObject);
		},

		transactionError() {
			this.$error(this.$t("TRANSACTION.ERROR.VALIDATION.BUSINESS_REGISTRATION"));
		},
	},
};
