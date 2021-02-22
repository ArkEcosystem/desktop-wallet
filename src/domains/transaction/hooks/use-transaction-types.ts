import { Enums, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
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

export enum MagistrateTransactionType {
	BusinessRegistration = 0,
	BusinessResignation = 1,
	BusinessUpdate = 2,
	BridgechainRegistration = 3,
	BridgechainResignation = 4,
	BridgechainUpdate = 5,
	Entity = 6,
}

type TransactionTypeProps = {
	wallets?: ReadWriteWallet[];
};

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
		"delegate-resignation": t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_REGISTRATION"),

		// magistrate
		"entity-registration": t("TRANSACTION.TRANSACTION_TYPES.ENTITY_REGISTRATION"),
		"entity-resignation": t("TRANSACTION.TRANSACTION_TYPES.ENTITY_RESIGNATION"),
		"entity-update": t("TRANSACTION.TRANSACTION_TYPES.ENTITY_UPDATE"),

		"business-registration": t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_ENTITY_REGISTRATION"),
		"business-resignation": t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_ENTITY_RESIGNATION"),
		"business-update": t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_ENTITY_UPDATE"),

		"bridgechain-registration": t("TRANSACTION.TRANSACTION_TYPES.BRIDGECHAIN_REGISTRATION"),
		"bridgechain-resignation": t("TRANSACTION.TRANSACTION_TYPES.BRIDGECHAIN_RESIGNATION"),
		"bridgechain-update": t("TRANSACTION.TRANSACTION_TYPES.BRIDGECHAIN_UPDATE"),

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
		entityRegistration: t("TRANSACTION.TRANSACTION_TYPES.ENTITY_REGISTRATION"),
		entityResignation: t("TRANSACTION.TRANSACTION_TYPES.ENTITY_RESIGNATION"),
		entityUpdate: t("TRANSACTION.TRANSACTION_TYPES.ENTITY_UPDATE"),
		businessEntityRegistration: t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_ENTITY_REGISTRATION"),
		businessEntityResignation: t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_ENTITY_RESIGNATION"),
		businessEntityUpdate: t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_ENTITY_UPDATE"),
		productEntityRegistration: t("TRANSACTION.TRANSACTION_TYPES.PRODUCT_ENTITY_REGISTRATION"),
		productEntityResignation: t("TRANSACTION.TRANSACTION_TYPES.PRODUCT_ENTITY_RESIGNATION"),
		productEntityUpdate: t("TRANSACTION.TRANSACTION_TYPES.PRODUCT_ENTITY_UPDATE"),
		pluginEntityRegistration: t("TRANSACTION.TRANSACTION_TYPES.PLUGIN_ENTITY_REGISTRATION"),
		pluginEntityResignation: t("TRANSACTION.TRANSACTION_TYPES.PLUGIN_ENTITY_RESIGNATION"),
		pluginEntityUpdate: t("TRANSACTION.TRANSACTION_TYPES.PLUGIN_ENTITY_UPDATE"),
		moduleEntityRegistration: t("TRANSACTION.TRANSACTION_TYPES.MODULE_ENTITY_REGISTRATION"),
		moduleEntityResignation: t("TRANSACTION.TRANSACTION_TYPES.MODULE_ENTITY_RESIGNATION"),
		moduleEntityUpdate: t("TRANSACTION.TRANSACTION_TYPES.MODULE_ENTITY_UPDATE"),
		delegateEntityRegistration: t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_ENTITY_REGISTRATION"),
		delegateEntityResignation: t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_ENTITY_RESIGNATION"),
		delegateEntityUpdate: t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_ENTITY_UPDATE"),
		legacyBusinessRegistration: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BUSINESS_REGISTRATION"),
		legacyBusinessResignation: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BUSINESS_RESIGNATION"),
		legacyBusinessUpdate: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BUSINESS_UPDATE"),
		legacyBridgechainRegistration: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BRIDGECHAIN_REGISTRATION"),
		legacyBridgechainResignation: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BRIDGECHAIN_RESIGNATION"),
		legacyBridgechainUpdate: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BRIDGECHAIN_UPDATE"),
	};

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
		"entity-registration": {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				action: Enums.EntityAction.Register,
			},
		},
		"entity-resignation": {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				action: Enums.EntityAction.Resign,
			},
		},
		"entity-update": {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				action: Enums.EntityAction.Update,
			},
		},
		"business-registration": {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Business,
				action: Enums.EntityAction.Register,
			},
		},
		"business-resignation": {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Business,
				action: Enums.EntityAction.Resign,
			},
		},
		"business-update": {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Business,
				action: Enums.EntityAction.Update,
			},
		},
		"bridgechain-registration": {
			type: MagistrateTransactionType.BridgechainRegistration,
			typeGroup: TransactionTypeGroup.Magistrate,
		},
		"bridgechain-resignation": {
			type: MagistrateTransactionType.BridgechainResignation,
			typeGroup: TransactionTypeGroup.Magistrate,
		},
		"bridgechain-update": {
			type: MagistrateTransactionType.BridgechainUpdate,
			typeGroup: TransactionTypeGroup.Magistrate,
		},
	};

	const getLabel = (type: string) => allTransactionTypeLabels[type];

	const getQueryParamsByType = (type: string) => core[type] || magistrate[type];

	const availableTypes = useMemo(() => {
		const allSupportedTypes = wallets.reduce(
			(all: string[], wallet: ReadWriteWallet) => [...all, ...wallet.transactionTypes()],
			[],
		);

		return uniq(allSupportedTypes);
	}, [wallets]);

	return {
		getLabel,
		types: {
			core: availableTypes,
			magistrate: Object.keys(magistrate),
		},
		getQueryParamsByType,
	};
};
