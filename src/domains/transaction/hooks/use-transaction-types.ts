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

interface TransactionTypeProps {
	wallets?: Contracts.IReadWriteWallet[];
}

const core: Record<string, any> = {
	transfer: {
		type: CoreTransactionType.Transfer,
		typeGroup: TransactionTypeGroup.Core,
	},
	vote: {
		type: CoreTransactionType.Vote,
		typeGroup: TransactionTypeGroup.Core,
	},
	"second-signature": {
		type: CoreTransactionType.SecondSignature,
		typeGroup: TransactionTypeGroup.Core,
	},
	"multi-signature": {
		type: CoreTransactionType.MultiSignature,
		typeGroup: TransactionTypeGroup.Core,
	},
	"multi-payment": {
		type: CoreTransactionType.MultiPayment,
		typeGroup: TransactionTypeGroup.Core,
	},
	ipfs: {
		type: CoreTransactionType.Ipfs,
		typeGroup: TransactionTypeGroup.Core,
	},
	"htlc-refund": {
		type: CoreTransactionType.HtlcRefund,
		typeGroup: TransactionTypeGroup.Core,
	},
	"htlc-lock": {
		type: CoreTransactionType.HtlcLock,
		typeGroup: TransactionTypeGroup.Core,
	},
	"htlc-claim": {
		type: CoreTransactionType.HtlcClaim,
		typeGroup: TransactionTypeGroup.Core,
	},
	"delegate-registration": {
		type: CoreTransactionType.DelegateRegistration,
		typeGroup: TransactionTypeGroup.Core,
	},
	"delegate-resignation": {
		type: CoreTransactionType.DelegateResignation,
		typeGroup: TransactionTypeGroup.Core,
	},
};

const magistrate: Record<string, any> = {
	magistrate: {
		typeGroup: TransactionTypeGroup.Magistrate,
	},
};

const magistrateTypes = Object.keys(magistrate);

export const useTransactionTypes = ({ wallets = [] }: TransactionTypeProps = {}) => {
	const { t } = useTranslation();

	const allTransactionTypeLabels: Record<string, string> = {
		// core
		transfer: t("TRANSACTION.TRANSACTION_TYPES.TRANSFER"),
		vote: t("TRANSACTION.TRANSACTION_TYPES.VOTE"),
		unvote: t("TRANSACTION.TRANSACTION_TYPES.UNVOTE"),

		"second-signature": t("TRANSACTION.TRANSACTION_TYPES.SECOND_SIGNATURE"),
		"multi-signature": t("TRANSACTION.TRANSACTION_TYPES.MULTI_SIGNATURE"),

		"multi-payment": t("TRANSACTION.TRANSACTION_TYPES.MULTI_PAYMENT"),
		ipfs: t("TRANSACTION.TRANSACTION_TYPES.IPFS"),

		"htlc-refund": t("TRANSACTION.TRANSACTION_TYPES.HTLC_REFUND"),
		"htlc-lock": t("TRANSACTION.TRANSACTION_TYPES.HTLC_LOCK"),
		"htlc-claim": t("TRANSACTION.TRANSACTION_TYPES.HTLC_CLAIM"),

		"delegate-registration": t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_REGISTRATION"),
		"delegate-resignation": t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_RESIGNATION"),

		// Labels in transaction type format as in ExtendedTransactionData
		secondSignature: t("TRANSACTION.TRANSACTION_TYPES.SECOND_SIGNATURE"),
		delegateRegistration: t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_REGISTRATION"),
		voteCombination: t("TRANSACTION.TRANSACTION_TYPES.VOTE_COMBINATION"),
		multiSignature: t("TRANSACTION.TRANSACTION_TYPES.MULTI_SIGNATURE"),
		multiPayment: t("TRANSACTION.TRANSACTION_TYPES.MULTI_PAYMENT"),
		delegateResignation: t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_RESIGNATION"),
		htlcLock: t("TRANSACTION.TRANSACTION_TYPES.HTLC_LOCK"),
		htlcClaim: t("TRANSACTION.TRANSACTION_TYPES.HTLC_CLAIM"),
		htlcRefund: t("TRANSACTION.TRANSACTION_TYPES.HTLC_REFUND"),
		magistrate: t("TRANSACTION.TRANSACTION_TYPES.MAGISTRATE"),
	};

	const getLabel = (type: string) => allTransactionTypeLabels[type];

	const getQueryParamsByType = (type: string) => core[type] || magistrate[type];

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
		getLabel,
		hasMagistrationTypesEnabled,
		types: {
			core: availableTypes,
			magistrate: Object.keys(magistrate),
		},
		getQueryParamsByType,
	};
};
