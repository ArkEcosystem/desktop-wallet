<template>
	<div class="WalletBusiness mx-4 overflow-hidden">
		<div class="flex flex-row pb-5 border-b border-dashed border-theme-line-separator">
			<div class="flex flex-col justify-center pl-4">
				<span class="font-bold">
					{{ $t("WALLET_BUSINESS.HEADER") }}
				</span>
				<span>{{ $t("WALLET_BUSINESS.DESCRIPTION") }}</span>
			</div>

			<div class="flex-1 flex flex-row items-center ml-4">
				<ButtonModal
					:label="$t('WALLET_BUSINESS.BUTTON_REGISTER_BRIDGECHAIN')"
					class="blue-button mr-2 py-2 px-4"
				>
					<template slot-scope="{ toggle, isOpen }">
						<TransactionModal
							v-if="isOpen"
							:type="bridgechainRegistration.type"
							:group="bridgechainRegistration.group"
							@cancel="closeTransactionModal(toggle, isOpen)"
							@sent="closeTransactionModal(toggle, isOpen)"
						/>
					</template>
				</ButtonModal>
			</div>
		</div>

		<WalletBusinessBridgechains class="mt-4" />
	</div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from "@config";

import { ButtonModal } from "@/components/Button";
import { TransactionModal } from "@/components/Transaction";

import WalletBusinessBridgechains from "./WalletBusinessBridgechains";

@Component({
    name: "WalletBusiness",

    components: {
		ButtonModal,
		TransactionModal,
		WalletBusinessBridgechains,
	}
})
export default class WalletBusiness extends Vue {
    bridgechainRegistration = {
        type: TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_REGISTRATION,
        group: TRANSACTION_GROUPS.MAGISTRATE,
    };

    closeTransactionModal(toggleMethod, isOpen) {
        if (isOpen) {
            toggleMethod();
        }
    }
}
</script>
