<template>
	<form class="TransactionFormBridgechainResignation flex flex-col" @submit.prevent>
		<template v-if="!bridgechain.isResigned">
			<ListDivided :is-floating-label="true">
				<ListDividedItem :label="$t('TRANSACTION.SENDER')" item-value-class="w-full">
					<span class="break-words">
						{{ senderLabel }}
					</span>
					<span v-if="senderLabel !== currentWallet.address" class="text-sm text-theme-page-text-light">
						{{ currentWallet.address }}
					</span>
				</ListDividedItem>

				<ListDividedItem :label="$t('WALLET_BUSINESS.BRIDGECHAIN.NAME')">
					{{ bridgechain.name }}
				</ListDividedItem>
			</ListDivided>

			<InputFee
				ref="fee"
				:currency="walletNetwork.token"
				:transaction-group="$options.transactionGroup"
				:transaction-type="$options.transactionType"
				:show-insufficient-funds="true"
				class="TransactionFormBridgechainResignation__fee"
				@input="onFee"
			/>

			<div v-if="!isMultiSignature">
				<div v-if="currentWallet.isLedger" class="TransactionFormBridgechainResignation__ledger-notice mt-10">
					{{ $t("TRANSACTION.LEDGER_SIGN_NOTICE") }}
				</div>

				<InputPassword
					v-else-if="currentWallet.passphrase"
					ref="password"
					v-model="$v.form.walletPassword.$model"
					:label="$t('TRANSACTION.PASSWORD')"
					:is-required="true"
					class="TransactionFormBridgechainResignation__password mt-4"
				/>

				<PassphraseInput
					v-else
					ref="passphrase"
					v-model="$v.form.passphrase.$model"
					:address="currentWallet.address"
					:pub-key-hash="walletNetwork.version"
					class="TransactionFormBridgechainResignation__passphrase mt-4"
				/>
			</div>

			<PassphraseInput
				v-if="currentWallet.secondPublicKey"
				ref="secondPassphrase"
				v-model="$v.form.secondPassphrase.$model"
				:label="$t('TRANSACTION.SECOND_PASSPHRASE')"
				:pub-key-hash="walletNetwork.version"
				:public-key="currentWallet.secondPublicKey"
				class="TransactionFormBridgechainResignation__second-password mt-5"
			/>

			<button
				:disabled="$v.form.$invalid"
				class="TransactionFormBridgechainResignation__next blue-button mt-10 ml-0"
				@click="onSubmit"
			>
				{{ $t("COMMON.NEXT") }}
			</button>

			<ModalLoader ref="modalLoader" :message="$t('ENCRYPTION.DECRYPTING')" :visible="showEncryptLoader" />
			<ModalLoader :message="$t('TRANSACTION.LEDGER_SIGN_WAIT')" :visible="showLedgerLoader" />

			<Portal to="transaction-footer">
				<footer class="ModalWindow__container__footer--warning">
					{{ $t("TRANSACTION.FOOTER_TEXT.BRIDGECHAIN_RESIGNATION") }}
				</footer>
			</Portal>
		</template>
		<template v-else>
			{{ $t("WALLET_BUSINESS.BRIDGECHAIN.NOT_REGISTERED") }}
		</template>
	</form>
</template>

<script>
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from "@config";
import { Component, Prop,Vue } from "vue-property-decorator";

import { InputFee, InputPassword } from "@/components/Input";
import { ListDivided, ListDividedItem } from "@/components/ListDivided";
import { ModalLoader } from "@/components/Modal";
import { PassphraseInput } from "@/components/Passphrase";

import mixin from "../mixin";

@Component({
    name: "TransactionFormBridgechainResignation",

    components: {
		InputFee,
		InputPassword,
		ListDivided,
		ListDividedItem,
		ModalLoader,
		PassphraseInput,
	},

    mixins: [mixin]
})
export default class TransactionFormBridgechainResignation extends Vue {
    transactionGroup = TRANSACTION_GROUPS.MAGISTRATE;
    transactionType = TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_RESIGNATION;

    @Prop({
        type: Object,
        required: true,
    })
    bridgechain;

    form = {
        fee: 0,
        passphrase: "",
        walletPassword: "",
    };

    getTransactionData() {
        const transactionData = {
            bridgechainId: this.bridgechain.genesisHash,
            address: this.currentWallet.address,
            passphrase: this.form.passphrase,
            fee: this.getFee(),
            wif: this.form.wif,
            networkWif: this.walletNetwork.wif,
            multiSignature: this.currentWallet.multiSignature,
        };

        if (this.currentWallet.secondPublicKey) {
            transactionData.secondPassphrase = this.form.secondPassphrase;
        }

        return transactionData;
    }

    buildTransaction(transactionData, isAdvancedFee = false, returnObject = false) {
        return this.$client.buildBridgechainResignation(transactionData, isAdvancedFee, returnObject);
    }

    transactionError() {
        this.$error(this.$t("TRANSACTION.ERROR.VALIDATION.BRIDGECHAIN_RESIGNATION"));
    }

    validations = {
		form: {
			fee: mixin.validators.fee,
			passphrase: mixin.validators.passphrase,
			walletPassword: mixin.validators.walletPassword,
			secondPassphrase: mixin.validators.secondPassphrase,
		},
	};
}
</script>
