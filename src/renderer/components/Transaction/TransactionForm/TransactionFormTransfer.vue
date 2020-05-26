<template>
	<form class="flex flex-col TransactionFormTransfer" @submit.prevent>
		<ListDivided v-if="senderLabel" :is-floating-label="true">
			<ListDividedItem :label="$t('TRANSACTION.SENDER')" item-value-class="w-full">
				<span class="break-words">
					{{ senderLabel }}
				</span>
				<span v-if="senderLabel !== currentWallet.address" class="text-sm text-theme-page-text-light">
					{{ currentWallet.address }}
				</span>
			</ListDividedItem>
		</ListDivided>

		<WalletSelection
			v-if="schema && schema.address"
			v-model="$v.wallet.$model"
			:compatible-address="$v.recipientId.$model"
			class="mb-5 TransactionFormTransfer__wallet"
			profile-class="mb-5"
			@select="ensureAvailableAmount"
		/>

		<InputAddress
			ref="recipient"
			v-model="$v.recipientId.$model"
			:label="$t('TRANSACTION.RECIPIENT')"
			:pub-key-hash="walletNetwork.version"
			:show-suggestions="true"
			:is-disabled="!currentWallet"
			:warning-text="recipientWarning"
			name="recipientId"
			class="mb-5 TransactionFormTransfer__recipient"
		/>

		<div class="flex items-baseline mb-5">
			<InputCurrency
				ref="amount"
				v-model="$v.amount.$model"
				:alternative-currency="alternativeCurrency"
				:currency="walletNetwork.token"
				:is-invalid="$v.amount.$dirty && $v.amount.$invalid"
				:label="$t('TRANSACTION.AMOUNT')"
				:minimum-error="amountTooLowError"
				:minimum-amount="minimumAmount"
				:maximum-amount="maximumAvailableAmount"
				:maximum-error="notEnoughBalanceError"
				:required="true"
				:is-disabled="!currentWallet"
				:wallet-network="walletNetwork"
				class="flex-1 mr-3 TransactionFormTransfer__amount"
				@blur="ensureAvailableAmount"
				@input="setSendAll(false, false)"
			/>

			<ButtonGeneric
				v-if="hasAip11"
				:disabled="!isValidRecipient"
				:label="$t('TRANSACTION.BUTTON_ADD')"
				class="h-8 py-1 mt-4 mr-3 TransactionFormTransfer__add flex-inline"
				@click="addRecipient"
			/>

			<InputSwitch
				v-model="isSendAllActive"
				:text="$t('TRANSACTION.SEND_ALL')"
				:is-disabled="isRecipientSendAll || !canSendAll || !currentWallet"
				class="TransactionFormTransfer__send-all"
				@change="setSendAll"
			/>
		</div>

		<TransactionRecipientList
			v-if="hasAip11"
			:items="$v.form.recipients.$model"
			:max-items="maximumRecipients"
			:show-count="true"
			:is-invalid="hasMoreThanMaximumRecipients"
			:required="true"
			class="mt-4 TransactionFormTransfer__recipients"
			@remove="emitRemoveRecipient"
		/>

		<InputText
			ref="vendorField"
			v-model="$v.form.vendorField.$model"
			:label="vendorFieldLabel"
			:bip39-warning="true"
			:helper-text="vendorFieldHelperText"
			:maxlength="vendorFieldMaxLength"
			name="vendorField"
			class="mb-5 TransactionFormTransfer__vendorfield"
		/>

		<div class="mt-4">
			<InputFee
				ref="fee"
				:currency="walletNetwork.token"
				:transaction-type="transactionTypeFee"
				:is-disabled="!currentWallet"
				:wallet="currentWallet"
				:wallet-network="walletNetwork"
				class="TransactionFormTransfer__fee"
				:class="{
					'TransactionFormTransfer__fee--helper': isMultiPayment && insufficientFundsError,
				}"
				@input="onFee"
			/>
			<p v-if="isMultiPayment && insufficientFundsError" class="text-xs text-red-dark text-theme-page-text-light">
				{{ insufficientFundsError }}
			</p>
		</div>

		<div v-if="!isMultiSignature">
			<div v-if="isLedger" class="mt-10 TransactionFormTransfer__ledger-notice">
				{{ $t("TRANSACTION.LEDGER_SIGN_NOTICE") }}
			</div>

			<InputPassword
				v-else-if="currentWallet && currentWallet.passphrase"
				ref="password"
				v-model="$v.form.walletPassword.$model"
				:label="$t('TRANSACTION.PASSWORD')"
				:is-required="true"
				class="mt-4 TransactionFormTransfer__password"
			/>

			<PassphraseInput
				v-else
				ref="passphrase"
				v-model="$v.form.passphrase.$model"
				:address="currentWallet && currentWallet.address"
				:pub-key-hash="walletNetwork.version"
				:is-disabled="!currentWallet"
				class="mt-4 TransactionFormTransfer__passphrase"
			/>
		</div>

		<PassphraseInput
			v-if="currentWallet && currentWallet.secondPublicKey"
			ref="secondPassphrase"
			v-model="$v.form.secondPassphrase.$model"
			:label="$t('TRANSACTION.SECOND_PASSPHRASE')"
			:pub-key-hash="walletNetwork.version"
			:public-key="currentWallet.secondPublicKey"
			class="mt-5 TransactionFormTransfer__second-passphrase"
		/>

		<footer class="flex items-center justify-between mt-10">
			<div class="self-start">
				<button :disabled="!isFormValid" class="TransactionFormTransfer__next blue-button" @click="nextStep">
					{{ $t("COMMON.NEXT") }}
				</button>
			</div>

			<div>
				<button
					v-tooltip="{ content: $t('TRANSACTION.LOAD_FROM_FILE'), toggle: 'hover' }"
					class="flex items-center TransactionFormTransfer__load-tx action-button pull-right"
					@click="loadTransaction"
				>
					<SvgIcon name="load" view-box="0 0 21 15" class="mr-1" />
					{{ $t("COMMON.LOAD") }}
				</button>
			</div>
		</footer>

		<ModalConfirmation
			v-if="showConfirmSendAll"
			:question="$t('TRANSACTION.CONFIRM_SEND_ALL')"
			:title="$t('TRANSACTION.CONFIRM_SEND_ALL_TITLE')"
			:note="$t('TRANSACTION.CONFIRM_SEND_ALL_NOTE')"
			container-classes="SendAllConfirmation"
			portal-target="loading"
			@close="cancelSendAll"
			@cancel="cancelSendAll"
			@continue="enableSendAll"
		/>
		<ModalLoader :message="$t('ENCRYPTION.DECRYPTING')" :visible="showEncryptLoader" />
		<ModalLoader :message="$t('TRANSACTION.LEDGER_SIGN_WAIT')" :visible="showLedgerLoader" />
	</form>
</template>

<script>
import { TRANSACTION_TYPES, VENDOR_FIELD } from "@config";
import { Component, Prop, Vue } from "vue-property-decorator";
import { required } from "vuelidate/lib/validators";

import { ButtonGeneric } from "@/components/Button";
import { InputAddress, InputCurrency, InputFee, InputPassword, InputSwitch, InputText } from "@/components/Input";
import { ListDivided, ListDividedItem } from "@/components/ListDivided";
import { ModalConfirmation, ModalLoader } from "@/components/Modal";
import { PassphraseInput } from "@/components/Passphrase";
import SvgIcon from "@/components/SvgIcon";
import TransactionRecipientList from "@/components/Transaction/TransactionRecipientList";
import WalletSelection from "@/components/Wallet/WalletSelection";
import WalletService from "@/services/wallet";

import mixin from "./mixin";

@Component({
	name: "TransactionFormTransfer",

	components: {
		ButtonGeneric,
		InputAddress,
		InputCurrency,
		InputPassword,
		InputSwitch,
		InputText,
		InputFee,
		ListDivided,
		ListDividedItem,
		ModalConfirmation,
		ModalLoader,
		PassphraseInput,
		SvgIcon,
		TransactionRecipientList,
		WalletSelection,
	},

	mixins: [mixin],

	watch: {
		wallet() {
			this.ensureAvailableAmount();
			this.$v.recipientId.$touch();
			this.$v.amount.$touch();
		},
	},
})
export default class TransactionFormTransfer extends Vue {
	transactionType = TRANSACTION_TYPES.GROUP_1.TRANSFER;

	@Prop({
		type: Object,
		required: false,
		default: () => {},
	})
	schema;

	recipientId = "";
	amount = "";
	isSendAllActive = false;
	previousAmount = "";
	showConfirmSendAll = false;
	wallet = null;

	form = {
		recipients: [],
		fee: 0,
		passphrase: "",
		walletPassword: "",
		vendorField: "",
	};

	get alternativeCurrency() {
		return this.$store.getters["session/currency"];
	}

	get isValidRecipient() {
		if (!this.$v.recipientId.$dirty || this.$v.recipientId.$invalid) {
			return false;
		}

		if (!this.$v.amount.$dirty || this.$v.amount.$invalid) {
			return false;
		}

		return true;
	}

	get isFormValid() {
		if (this.isMultiPayment) {
			return !this.$v.form.$invalid && !this.insufficientFundsError;
		}

		return !this.$v.form.$invalid;
	}

	get isMultiPayment() {
		return this.form.recipients.length > 1;
	}

	get isLedger() {
		return this.currentWallet && !!this.currentWallet.isLedger;
	}

	get hasAip11() {
		return this.walletNetwork.constants && !!this.walletNetwork.constants.aip11 && !this.isLedger;
	}

	get hasMoreThanMaximumRecipients() {
		return this.form.recipients.length > this.maximumRecipients;
	}

	get transactionTypeFee() {
		return this.isMultiPayment ? TRANSACTION_TYPES.GROUP_1.MULTI_PAYMENT : TRANSACTION_TYPES.GROUP_1.TRANSFER;
	}

	// Customize the message to display the minimum amount as subunit
	get amountTooLowError() {
		const { fractionDigits } = this.walletNetwork;
		const minimumAmount = Math.pow(10, -fractionDigits);

		return this.$t("INPUT_CURRENCY.ERROR.LESS_THAN_MINIMUM", {
			amount: this.currency_simpleFormatCrypto(minimumAmount.toFixed(fractionDigits)),
		});
	}

	get notEnoughBalanceError() {
		if (!this.currentWallet) {
			return "";
		}

		return this.$t("TRANSACTION_FORM.ERROR.NOT_ENOUGH_BALANCE", {
			balance: this.formatter_networkCurrency(this.currentWallet.balance),
		});
	}

	get minimumAmount() {
		return this.currency_subToUnit(1);
	}

	get maximumAvailableAmount() {
		if (!this.currentWallet) {
			return this.currency_subToUnit(0);
		}

		if (!this.hasAip11) {
			return this.currency_subToUnit(this.currentWallet.balance).minus(this.form.fee);
		}

		let availableAmount = this.currency_subToUnit(this.currentWallet.balance).minus(this.form.fee);

		for (const recipient of this.form.recipients) {
			if (!recipient.sendAll) {
				availableAmount = availableAmount.minus(this.currency_subToUnit(recipient.amount));
			}
		}

		return availableAmount;
	}

	get totalAmount() {
		const amount = this.currency_toBuilder(0);

		for (const recipient of this.$v.form.recipients.$model) {
			amount.plus(recipient.amount);
		}

		return amount;
	}

	get insufficientFundsError() {
		if (!this.currentWallet) {
			return null;
		}

		const funds = this.currency_unitToSub(this.currency_subToUnit(this.currentWallet.balance));
		const totalAmount = this.currency_unitToSub(this.currency_subToUnit(this.totalAmount).plus(this.form.fee));

		if (funds.isLessThan(totalAmount)) {
			const balance = this.formatter_networkCurrency(this.currentWallet.balance);
			return this.$t("TRANSACTION.ERROR.NOT_ENOUGH_BALANCE", { balance });
		}

		return null;
	}

	get isRecipientSendAll() {
		return this.form.recipients.some((recipient) => !!recipient.sendAll);
	}

	get canSendAll() {
		return this.maximumAvailableAmount > 0;
	}

	get senderLabel() {
		return this.currentWallet ? this.wallet_formatAddress(this.currentWallet.address) : null;
	}

	get senderWallet() {
		return this.wallet;
	}

	get walletNetwork() {
		const sessionNetwork = this.session_network;
		if (!this.currentWallet || !this.currentWallet.id) {
			return sessionNetwork;
		}

		const profile = this.$store.getters["profile/byId"](this.currentWallet.profileId);
		if (!profile || !profile.id) {
			return sessionNetwork;
		}

		return this.$store.getters["network/byId"](profile.networkId) || sessionNetwork;
	}

	get currentWallet() {
		return this.senderWallet || this.wallet_fromRoute;
	}

	set currentWallet(wallet) {
		this.wallet = wallet;
	}

	get vendorFieldLabel() {
		return `${this.$t("TRANSACTION.VENDOR_FIELD")} - ${this.$t("VALIDATION.MAX_LENGTH", [
			this.vendorFieldMaxLength,
		])}`;
	}

	get vendorFieldHelperText() {
		const vendorFieldLength = this.form.vendorField.length;

		if (vendorFieldLength === this.vendorFieldMaxLength) {
			return this.$t("VALIDATION.VENDOR_FIELD.LIMIT_REACHED", [this.vendorFieldMaxLength]);
		} else if (vendorFieldLength) {
			return this.$t("VALIDATION.VENDOR_FIELD.LIMIT_REMAINING", [
				this.vendorFieldMaxLength - vendorFieldLength,
				this.vendorFieldMaxLength,
			]);
		}

		return null;
	}

	get vendorFieldMaxLength() {
		const vendorField = this.walletNetwork.vendorField;

		if (vendorField) {
			return vendorField.maxLength;
		}

		return VENDOR_FIELD.defaultMaxLength;
	}

	get recipientWarning() {
		if (!this.$v.recipientId.$dirty) {
			return null;
		}

		if (this.form.recipients.some((recipient) => recipient.address === this.$v.recipientId.$model)) {
			return this.$t("TRANSACTION.MULTI_PAYMENT.WARNING_DUPLICATE");
		}

		return null;
	}

	get maximumRecipients() {
		if (!this.session_network.constants || !this.session_network.constants.multiPaymentLimit) {
			return 500;
		}

		return this.session_network.constants.multiPaymentLimit;
	}

	mounted() {
		this.populateSchema();

		if (this.currentWallet && this.currentWallet.id) {
			this.$set(this, "wallet", this.currentWallet);
			this.$v.wallet.$touch();
		}
	}

	getTransactionData() {
		const transactionData = {
			address: this.currentWallet.address,
			vendorField: this.form.vendorField,
			passphrase: this.form.passphrase,
			fee: this.getFee(),
			wif: this.form.wif,
			networkWif: this.walletNetwork.wif,
			multiSignature: this.currentWallet.multiSignature,
		};

		if (this.isMultiPayment) {
			transactionData.recipients = this.form.recipients;
		} else {
			if (this.hasAip11) {
				transactionData.recipientId = this.form.recipients[0].address;
				transactionData.amount = this.getAmountNormalTransaction();
			} else {
				transactionData.recipientId = this.recipientId;
				transactionData.amount = this.currency_unitToSub(this.amount);
			}

			transactionData.networkId = this.walletNetwork.id;
		}

		if (this.currentWallet.secondPublicKey) {
			transactionData.secondPassphrase = this.form.secondPassphrase;
		}

		return transactionData;
	}

	getAmountNormalTransaction() {
		if (this.insufficientFundsError) {
			return this.currency_unitToSub(
				this.currency_subToUnit(this.form.recipients[0].amount).minus(this.form.fee),
			);
		}

		return this.form.recipients[0].amount;
	}

	buildTransaction(transactionData, isAdvancedFee = false, returnObject = false) {
		if (this.isMultiPayment) {
			return this.$client.buildMultiPayment(transactionData, isAdvancedFee, returnObject);
		} else {
			return this.$client.buildTransfer(transactionData, isAdvancedFee, returnObject);
		}
	}

	transactionError() {
		if (this.isMultiPayment) {
			this.$error(this.$t("TRANSACTION.ERROR.VALIDATION.MULTI_PAYMENT"));
		} else {
			this.$error(this.$t("TRANSACTION.ERROR.VALIDATION.TRANSFER"));
		}
	}

	populateSchema() {
		if (!this.schema) {
			return;
		}

		this.$set(this, "amount", this.schema.amount || "");
		this.$set(this, "recipientId", this.schema.address || "");
		this.$set(this.form, "vendorField", this.schema.vendorField || "");

		if (this.schema.wallet) {
			const currentProfileId = this.$store.getters["session/profileId"];
			const ledgerWallets = this.$store.getters["ledger/isConnected"]
				? this.$store.getters["ledger/wallets"]
				: [];
			const wallets = [];

			let foundNetwork = !this.schema.nethash;
			if (currentProfileId) {
				if (this.schema.nethash) {
					const profile = this.$store.getters["profile/byId"](currentProfileId);
					const network = this.$store.getters["network/byId"](profile.networkId);
					if (network.nethash === this.schema.nethash) {
						foundNetwork = true;
						wallets.push(...this.$store.getters["wallet/byProfileId"](currentProfileId));
					}
				} else {
					wallets.push(...this.$store.getters["wallet/byProfileId"](currentProfileId));
				}
			}

			wallets.push(...ledgerWallets);

			for (const profile of this.$store.getters["profile/all"]) {
				if (currentProfileId !== profile.id) {
					if (this.schema.nethash) {
						const network = this.$store.getters["network/byId"](profile.networkId);
						if (network.nethash === this.schema.nethash) {
							foundNetwork = true;
							wallets.push(...this.$store.getters["wallet/byProfileId"](profile.id));
						}
					} else {
						wallets.push(...this.$store.getters["wallet/byProfileId"](profile.id));
					}
				}
			}

			const wallet = wallets.filter((wallet) => wallet.address === this.schema.wallet);
			if (wallet.length) {
				this.currentWallet = wallet[0];
			}
			if (!foundNetwork) {
				this.$emit("cancel");
				this.$error(`${this.$t("TRANSACTION.ERROR.NETWORK_NOT_CONFIGURED")}: ${this.schema.nethash}`);
			} else if (!wallet.length) {
				this.$emit("cancel");
				this.$error(`${this.$t("TRANSACTION.ERROR.WALLET_NOT_IMPORTED")}: ${this.schema.wallet}`);
			}
		}
	}

	addRecipient() {
		if (this.$v.recipientId.$invalid || this.$v.amount.$invalid) {
			return;
		}

		this.$v.form.recipients.$model.push({
			address: this.recipientId,
			amount: this.isSendAllActive ? 0 : this.currency_unitToSub(this.amount),
			sendAll: this.isSendAllActive,
		});

		if (this.isSendAllActive) {
			this.previousAmount = "";
			this.isSendAllActive = false;
		}

		this.$refs.recipient.reset();
		this.$v.recipientId.$reset();
		this.$refs.amount.reset();
		this.$v.amount.$model = "";
	}

	emitRemoveRecipient(index) {
		if (!Object.prototype.hasOwnProperty.call(this.$v.form.recipients.$model, index)) {
			return;
		}

		this.$v.form.recipients.$model = [
			...this.form.recipients.slice(0, index),
			...this.form.recipients.slice(index + 1),
		];
	}

	setSendAll(isActive, setPreviousAmount = true) {
		if (isActive) {
			this.confirmSendAll();
			this.previousAmount = this.amount;
		} else {
			if (setPreviousAmount && !!this.previousAmount) {
				this.$v.amount.$model = this.previousAmount;
			}

			this.previousAmount = "";
			this.isSendAllActive = isActive;
			this.ensureAvailableAmount();
		}
	}

	ensureAvailableAmount() {
		if (this.isSendAllActive && this.canSendAll) {
			this.$v.amount.$model = this.maximumAvailableAmount;
		}
	}

	enableSendAll() {
		this.isSendAllActive = true;
		this.ensureAvailableAmount();
		this.showConfirmSendAll = false;
	}

	confirmSendAll() {
		this.showConfirmSendAll = true;
	}

	cancelSendAll() {
		this.showConfirmSendAll = false;
		this.isSendAllActive = false;
	}

	async nextStep() {
		if (this.hasAip11) {
			for await (const recipient of this.$v.form.recipients.$model) {
				if (recipient.sendAll) {
					recipient.amount = this.currency_unitToSub(this.maximumAvailableAmount);
					break;
				}
			}
		}

		this.onSubmit();
	}

	onFee(fee) {
		this.$v.form.fee.$model = fee;
		this.ensureAvailableAmount();
	}

	emitNext(transaction) {
		this.$emit("next", {
			transaction,
			wallet: this.senderWallet,
		});
	}

	async loadTransaction() {
		try {
			const raw = await this.electron_readFile();

			if (raw) {
				try {
					const transaction = JSON.parse(raw);

					if (
						parseInt(transaction.type, 10) !== TRANSACTION_TYPES.GROUP_1.TRANSFER &&
						parseInt(transaction.type, 10) !== TRANSACTION_TYPES.GROUP_1.MULTI_PAYMENT
					) {
						throw new Error(this.$t("VALIDATION.INVALID_TYPE"));
					}

					if (
						this.hasAip11 &&
						Object.prototype.hasOwnProperty.call(transaction, "asset") &&
						Object.prototype.hasOwnProperty.call(transaction.asset, "payments")
					) {
						this.$refs.recipient.reset();
						this.$refs.amount.reset();
						this.$v.form.recipients.$model = [];

						transaction.asset.payments.forEach((payment) => {
							if (payment.recipientId && payment.amount) {
								if (WalletService.validateAddress(payment.recipientId, this.session_network.version)) {
									const amount = this.currency_unitToSub(
										this.currency_subToUnit(payment.amount, this.session_network),
										this.session_network,
									);

									this.$v.form.recipients.$model.push({
										address: payment.recipientId,
										amount,
									});
								} else {
									throw new Error(
										this.$t("VALIDATION.RECIPIENT_DIFFERENT_NETWORK", [
											this.wallet_truncate(payment.recipientId),
										]),
									);
								}
							}
						});
					} else if (transaction.recipientId && transaction.amount) {
						if (WalletService.validateAddress(transaction.recipientId, this.session_network.version)) {
							this.$v.form.recipients.$model = [];
							this.$refs.recipient.model = transaction.recipientId;
							this.$refs.amount.model = this.currency_subToUnit(transaction.amount, this.session_network);
						} else {
							throw new Error(
								this.$t("VALIDATION.RECIPIENT_DIFFERENT_NETWORK", [
									this.wallet_truncate(transaction.recipientId),
								]),
							);
						}
					} else {
						throw new Error(this.$t("VALIDATION.INVALID_FORMAT"));
					}

					if (transaction.fee) {
						this.$refs.fee.$refs.input.model = this.currency_subToUnit(
							transaction.fee,
							this.session_network,
						);
					}

					if (transaction.vendorField) {
						this.$refs.vendorField.model = transaction.vendorField;
					}

					this.$success(this.$t("TRANSACTION.SUCCESS.LOAD_FROM_FILE"));
				} catch (error) {
					if (error.name === "SyntaxError") {
						error.message = this.$t("VALIDATION.INVALID_FORMAT");
					}

					this.$error(`${this.$t("TRANSACTION.ERROR.LOAD_FROM_FILE")}: ${error.message}`);
				}
			}
		} catch (error) {
			this.$error(`${this.$t("TRANSACTION.ERROR.LOAD_FROM_FILE")}: ${error.message}`);
		}
	}

	validations = {
		recipientId: {
			required,
			isValid() {
				if (this.$refs.recipient) {
					return !this.$refs.recipient.$v.$invalid;
				}

				return false;
			},
		},
		amount: {
			required,
			isValid() {
				if (this.$refs.amount) {
					return !this.$refs.amount.$v.$invalid;
				}

				return false;
			},
		},
		wallet: {},
		form: {
			recipients: {
				aboveMinimum() {
					if (!this.hasAip11) {
						return true;
					}

					return this.form.recipients.length >= 1;
				},
				belowOrEqualMaximum() {
					return this.form.recipients.length <= this.maximumRecipients;
				},
			},
			fee: mixin.validators.fee,
			passphrase: mixin.validators.passphrase,
			secondPassphrase: mixin.validators.secondPassphrase,
			vendorField: {},
			walletPassword: mixin.validators.walletPassword,
		},
	};
}
</script>

<style>
.TransactionFormTransfer__recipients .InputEditableList__list {
	max-height: 13rem;
}

.TransactionFormTransfer__fee.TransactionFormTransfer__fee--helper {
	margin-bottom: 0;
}
.TransactionFormTransfer__fee--helper .InputField__helper {
	display: none;
}

.SendAllConfirmation .ModalConfirmation__container {
	min-width: calc(var(--contact-identicon-xl) + 74px * 2);
	max-width: calc(var(--contact-identicon-xl) + 74px * 2 + 50px);
}
</style>
