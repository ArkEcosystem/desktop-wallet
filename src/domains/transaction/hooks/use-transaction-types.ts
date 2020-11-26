import { Enums } from "@arkecosystem/platform-sdk-profiles";
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

export const useTransactionTypes = () => {
	const { t } = useTranslation();

	const allTransactionTypeLabels: Record<string, string> = {
		transfer: t("TRANSACTION.TRANSACTION_TYPES.TRANSFER"),
		secondSignature: t("TRANSACTION.TRANSACTION_TYPES.SECOND_SIGNATURE"),
		delegateRegistration: t("TRANSACTION.TRANSACTION_TYPES.DELEGATE_REGISTRATION"),
		vote: t("TRANSACTION.TRANSACTION_TYPES.VOTE"),
		unvote: t("TRANSACTION.TRANSACTION_TYPES.UNVOTE"),
		voteCombination: t("TRANSACTION.TRANSACTION_TYPES.VOTE_COMBINATION"),
		multiSignature: t("TRANSACTION.TRANSACTION_TYPES.MULTI_SIGNATURE"),
		ipfs: t("TRANSACTION.TRANSACTION_TYPES.IPFS"),
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
		secondSignature: {
			type: CoreTransactionType.SecondSignature,
			typeGroup: TransactionTypeGroup.Core,
		},
		delegateRegistration: {
			type: CoreTransactionType.DelegateRegistration,
			typeGroup: TransactionTypeGroup.Core,
		},
		vote: {
			type: CoreTransactionType.Vote,
			typeGroup: TransactionTypeGroup.Core,
		},
		// TODO: adjust
		voteCombination: {
			type: CoreTransactionType.Vote,
			typeGroup: TransactionTypeGroup.Core,
		},
		multiSignature: {
			type: CoreTransactionType.MultiSignature,
			typeGroup: TransactionTypeGroup.Core,
		},
		ipfs: {
			type: CoreTransactionType.Ipfs,
			typeGroup: TransactionTypeGroup.Core,
		},
		multiPayment: {
			type: CoreTransactionType.MultiPayment,
			typeGroup: TransactionTypeGroup.Core,
		},
		htlcLock: {
			type: CoreTransactionType.HtlcLock,
			typeGroup: TransactionTypeGroup.Core,
		},
		htlcClaim: {
			type: CoreTransactionType.HtlcClaim,
			typeGroup: TransactionTypeGroup.Core,
		},
		htlcRefund: {
			type: CoreTransactionType.HtlcRefund,
			typeGroup: TransactionTypeGroup.Core,
		},
	};

	const magistrate: Record<string, any> = {
		businessEntityRegistration: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Business,
				action: Enums.EntityAction.Register,
			},
		},
		businessEntityResignation: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Business,
				action: Enums.EntityAction.Resign,
			},
		},
		businessEntityUpdate: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Business,
				action: Enums.EntityAction.Update,
			},
		},
		delegateEntityRegistration: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Delegate,
				action: Enums.EntityAction.Register,
			},
		},
		delegateEntityResignation: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Delegate,
				action: Enums.EntityAction.Resign,
			},
		},
		delegateEntityUpdate: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Delegate,
				action: Enums.EntityAction.Update,
			},
		},
		entityRegistration: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				action: Enums.EntityAction.Register,
			},
		},
		entityResignation: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				action: Enums.EntityAction.Resign,
			},
		},
		entityUpdate: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				action: Enums.EntityAction.Update,
			},
		},
		legacyBridgechainRegistration: {
			type: MagistrateTransactionType.BridgechainRegistration,
			typeGroup: TransactionTypeGroup.Magistrate,
		},
		legacyBridgechainResignation: {
			type: MagistrateTransactionType.BridgechainResignation,
			typeGroup: TransactionTypeGroup.Magistrate,
		},
		legacyBridgechainUpdate: {
			type: MagistrateTransactionType.BridgechainUpdate,
			typeGroup: TransactionTypeGroup.Magistrate,
		},
		legacyBusinessRegistration: {
			type: MagistrateTransactionType.BusinessResignation,
			typeGroup: TransactionTypeGroup.Magistrate,
		},
		legacyBusinessResignation: {
			type: MagistrateTransactionType.BusinessResignation,
			typeGroup: TransactionTypeGroup.Magistrate,
		},
		legacyBusinessUpdate: {
			type: MagistrateTransactionType.BusinessUpdate,
			typeGroup: TransactionTypeGroup.Magistrate,
		},
		moduleEntityRegistration: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Module,
				action: Enums.EntityAction.Register,
			},
		},
		moduleEntityResignation: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Module,
				action: Enums.EntityAction.Resign,
			},
		},
		moduleEntityUpdate: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Module,
				action: Enums.EntityAction.Update,
			},
		},
		pluginEntityRegistration: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Plugin,
				action: Enums.EntityAction.Register,
			},
		},
		pluginEntityResignation: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Plugin,
				action: Enums.EntityAction.Resign,
			},
		},
		pluginEntityUpdate: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Plugin,
				action: Enums.EntityAction.Update,
			},
		},
		productEntityRegistration: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Product,
				action: Enums.EntityAction.Register,
			},
		},
		productEntityResignation: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Product,
				action: Enums.EntityAction.Resign,
			},
		},
		productEntityUpdate: {
			type: MagistrateTransactionType.Entity,
			typeGroup: TransactionTypeGroup.Magistrate,
			asset: {
				type: Enums.EntityType.Product,
				action: Enums.EntityAction.Update,
			},
		},
	};

	const getLabel = (type: string) => allTransactionTypeLabels[type];

	const getQueryParamsByType = (type: string) => core[type] || magistrate[type];

	return {
		getLabel,
		types: {
			core: Object.keys(core),
			magistrate: Object.keys(magistrate),
		},
		getQueryParamsByType,
	};
};
