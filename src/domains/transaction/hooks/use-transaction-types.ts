import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { uniq } from "@arkecosystem/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export enum TransactionTypeGroup {
	Test = 0,
	Core = 1,
	Magistrate = 2,
	// Everything above is available to anyone
	Reserved = 1000,
}

export enum CoreTransactionType {
	Transfer = 0,
	SecondSignature = 1,
	DelegateRegistration = 2,
	Vote = 3,
	MultiSignature = 4,
	Ipfs = 5,
	MultiPayment = 6,
	DelegateResignation = 7,
	HtlcLock = 8,
	HtlcClaim = 9,
	HtlcRefund = 10,
}

interface TransactionTypeProperties {
	wallets?: Contracts.IReadWriteWallet[];
}

const core: Record<string, any> = {
	"delegate-registration": {
		type: CoreTransactionType.DelegateRegistration,
		typeGroup: TransactionTypeGroup.Core,
	},
	"delegate-resignation": {
		type: CoreTransactionType.DelegateResignation,
		typeGroup: TransactionTypeGroup.Core,
	},
	"htlc-claim": {
		type: CoreTransactionType.HtlcClaim,
		typeGroup: TransactionTypeGroup.Core,
	},
	"htlc-lock": {
		type: CoreTransactionType.HtlcLock,
		typeGroup: TransactionTypeGroup.Core,
	},
	"htlc-refund": {
		type: CoreTransactionType.HtlcRefund,
		typeGroup: TransactionTypeGroup.Core,
	},
	ipfs: {
		type: CoreTransactionType.Ipfs,
		typeGroup: TransactionTypeGroup.Core,
	},
	"multi-payment": {
		type: CoreTransactionType.MultiPayment,
		typeGroup: TransactionTypeGroup.Core,
	},
	"multi-signature": {
		type: CoreTransactionType.MultiSignature,
		typeGroup: TransactionTypeGroup.Core,
	},
	"second-signature": {
		type: CoreTransactionType.SecondSignature,
		typeGroup: TransactionTypeGroup.Core,
	},
	transfer: {
		type: CoreTransactionType.Transfer,
		typeGroup: TransactionTypeGroup.Core,
	},
	vote: {
		type: CoreTransactionType.Vote,
		typeGroup: TransactionTypeGroup.Core,
	},
};

const magistrate: Record<string, any> = {
	magistrate: {
		typeGroup: TransactionTypeGroup.Magistrate,
	},
};

const magistrateTypes = Object.keys(magistrate);

export const useTransactionTypes = ({ wallets = [] }: TransactionTypeProperties = {}) => {
	const { t } = useTranslation();

	const transactionTypeIcons: Record<string, string> = {
		delegateRegistration: "Delegate",
		delegateResignation: "DelegateResigned",
		htlcClaim: "Timelock",
		htlcLock: "Timelock",
		htlcRefund: "Timelock",
		ipfs: "Ipfs",
		magistrate: "Magistrate",
		multiPayment: "Multipayment",
		multiSignature: "Multisig",
		secondSignature: "Key",
		transfer: "Transfer",
		unvote: "Unvote",
		vote: "Vote",
		voteCombination: "VoteCombination",
	};

	const allTransactionTypeLabels: Record<string, string> = {
		"delegate-registration": t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_REGISTRATION"),
		"delegate-resignation": t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_RESIGNATION"),
		delegateRegistration: t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_REGISTRATION"),
		delegateResignation: t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_RESIGNATION"),
		"htlc-claim": t("TRANSACTION.TRANSACTION_TYPES.HTLC_CLAIM"),
		"htlc-lock": t("TRANSACTION.TRANSACTION_TYPES.HTLC_LOCK"),
		"htlc-refund": t("TRANSACTION.TRANSACTION_TYPES.HTLC_REFUND"),
		htlcClaim: t("TRANSACTION.TRANSACTION_TYPES.HTLC_CLAIM"),
		htlcLock: t("TRANSACTION.TRANSACTION_TYPES.HTLC_LOCK"),
		htlcRefund: t("TRANSACTION.TRANSACTION_TYPES.HTLC_REFUND"),
		ipfs: t("TRANSACTION.TRANSACTION_TYPES.IPFS"),
		magistrate: t("TRANSACTION.TRANSACTION_TYPES.MAGISTRATE"),
		"multi-payment": t("TRANSACTION.TRANSACTION_TYPES.MULTI_PAYMENT"),
		"multi-signature": t("TRANSACTION.TRANSACTION_TYPES.MULTI_SIGNATURE"),
		multiPayment: t("TRANSACTION.TRANSACTION_TYPES.MULTI_PAYMENT"),
		multiSignature: t("TRANSACTION.TRANSACTION_TYPES.MULTI_SIGNATURE"),
		"second-signature": t("TRANSACTION.TRANSACTION_TYPES.SECOND_SIGNATURE"),
		// Labels in transaction type format as in ExtendedTransactionData
		secondSignature: t("TRANSACTION.TRANSACTION_TYPES.SECOND_SIGNATURE"),
		// core
		transfer: t("TRANSACTION.TRANSACTION_TYPES.TRANSFER"),
		unvote: t("TRANSACTION.TRANSACTION_TYPES.UNVOTE"),
		vote: t("TRANSACTION.TRANSACTION_TYPES.VOTE"),
		voteCombination: t("TRANSACTION.TRANSACTION_TYPES.VOTE_COMBINATION"),
	};

	const getIcon = (type: string) => transactionTypeIcons[type];
	const getLabel = (type: string) => allTransactionTypeLabels[type];

	const getQueryParametersByType = (type: string) => core[type] || magistrate[type];

	const availableTypes = useMemo(() => {
		const allSupportedTypes = wallets.reduce((all: string[], wallet: Contracts.IReadWriteWallet) => {
			// @ts-ignore
			const walletTransactionTypes = (wallet.transactionTypes() as string[]).filter(
				(type) => !magistrateTypes.includes(type),
			);
			return [...all, ...walletTransactionTypes];
		}, []);

		return uniq(allSupportedTypes);
	}, [wallets]);

	const hasMagistrationTypesEnabled = useMemo(
		() =>
			wallets.some((wallet) =>
				// @ts-ignore
				(wallet.transactionTypes() as string[]).filter((type) => magistrateTypes.includes(type)),
			),
		[wallets],
	);

	return {
		getIcon,
		getLabel,
		getQueryParamsByType: getQueryParametersByType,
		hasMagistrationTypesEnabled,
		types: {
			core: availableTypes,
			magistrate: Object.keys(magistrate),
		},
	};
};
