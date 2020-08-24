import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

export const networks = [
	{
		name: "Ark",
		isSelected: true,
	},
	{
		name: "Ethereum",
		isSelected: true,
	},
	{
		name: "Bitcoin",
		isSelected: false,
	},
];

// Transaction History data
export const transactions = [
	{
		id: () => "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		blockId: () => "71fd1a494ded5430586f4dd1c79c3ac77bf38120e868c8f8980972b8075d67e9",
		type: () => "transfer",
		timestamp: () => DateTime.fromUnix(1596213281),
		confirmations: () => BigNumber.make(10),
		votes: () => ["10"],
		unvotes: () => ["10"],
		sender: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipient: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipients: () => [],
		amount: () => BigNumber.make(100).times(1e8),
		fee: () => BigNumber.make(21).times(1e8),
		memo: () => "Test",
		asset: () => ({ a: "b" }),
		isConfirmed: () => false,
		isSent: () => true,
		isReceived: () => false,
		isTransfer: () => true,
		isSecondSignature: () => false,
		isMultiSignature: () => false,
		isDelegateRegistration: () => false,
		isDelegateResignation: () => false,
		isVote: () => false,
		isUnvote: () => false,
		isIpfs: () => false,
		isMultiPayment: () => false,
		isHtlcLock: () => false,
		isHtlcClaim: () => false,
		isHtlcRefund: () => false,

		isEntityRegistration: () => false,
		isEntityResignation: () => false,
		isEntityUpdate: () => false,
		isBusinessEntityRegistration: () => false,
		isBusinessEntityResignation: () => false,
		isBusinessEntityUpdate: () => false,
		isDeveloperEntityRegistration: () => false,
		isDeveloperEntityResignation: () => false,
		isDeveloperEntityUpdate: () => false,
		isCorePluginEntityRegistration: () => false,
		isCorePluginEntityResignation: () => false,
		isCorePluginEntityUpdate: () => false,
		isDesktopPluginEntityRegistration: () => false,
		isDesktopPluginEntityResignation: () => false,
		isDesktopPluginEntityUpdate: () => false,
		isDelegateEntityRegistration: () => false,
		isDelegateEntityResignation: () => false,
		isDelegateEntityUpdate: () => false,
		isLegacyBusinessRegistration: () => false,
		isLegacyBusinessResignation: () => false,
		isLegacyBusinessUpdate: () => false,
		isLegacyBridgechainRegistration: () => false,
		isLegacyBridgechainResignation: () => false,
		isLegacyBridgechainUpdate: () => false,
		toObject: () => ({ a: "b" }),
		hasPassed: () => true,
		hasFailed: () => false,
		getMeta: () => "",
		setMeta: () => "",
		// @ts-ignore
		explorerLink: () =>
			"https://explorer.ark.io/transaction/ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
	},
	{
		id: () => "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		blockId: () => "71fd1a494ded5430586f4dd1c79c3ac77bf38120e868c8f8980972b8075d67e9",
		type: () => "transfer",
		timestamp: () => DateTime.fromUnix(1596213281),
		confirmations: () => BigNumber.make(5),
		votes: () => ["10"],
		unvotes: () => ["10"],
		sender: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipient: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipients: () => [],
		amount: () => BigNumber.make(52).times(1e8),
		fee: () => BigNumber.make(0.2).times(1e8),
		memo: () => "Test",
		asset: () => ({ a: "b" }),
		isConfirmed: () => false,
		isSent: () => true,
		isReceived: () => false,
		isTransfer: () => true,
		isSecondSignature: () => true,
		isMultiSignature: () => false,
		isDelegateRegistration: () => false,
		isDelegateResignation: () => false,
		isVote: () => false,
		isUnvote: () => false,
		isIpfs: () => false,
		isMultiPayment: () => false,
		isHtlcLock: () => false,
		isHtlcClaim: () => false,
		isHtlcRefund: () => false,

		isEntityRegistration: () => false,
		isEntityResignation: () => false,
		isEntityUpdate: () => false,
		isBusinessEntityRegistration: () => false,
		isBusinessEntityResignation: () => false,
		isBusinessEntityUpdate: () => false,
		isDeveloperEntityRegistration: () => false,
		isDeveloperEntityResignation: () => false,
		isDeveloperEntityUpdate: () => false,
		isCorePluginEntityRegistration: () => false,
		isCorePluginEntityResignation: () => false,
		isCorePluginEntityUpdate: () => false,
		isDesktopPluginEntityRegistration: () => false,
		isDesktopPluginEntityResignation: () => false,
		isDesktopPluginEntityUpdate: () => false,
		isDelegateEntityRegistration: () => false,
		isDelegateEntityResignation: () => false,
		isDelegateEntityUpdate: () => false,
		isLegacyBusinessRegistration: () => false,
		isLegacyBusinessResignation: () => false,
		isLegacyBusinessUpdate: () => false,
		isLegacyBridgechainRegistration: () => false,
		isLegacyBridgechainResignation: () => false,
		isLegacyBridgechainUpdate: () => false,
		toObject: () => ({ a: "b" }),
		hasPassed: () => true,
		hasFailed: () => false,
		getMeta: () => "",
		setMeta: () => "",
		// @ts-ignore
		explorerLink: () =>
			"https://explorer.ark.io/transaction/ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
	},
	{
		id: () => "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		blockId: () => "71fd1a494ded5430586f4dd1c79c3ac77bf38120e868c8f8980972b8075d67e9",
		type: () => "vote",
		timestamp: () => DateTime.fromUnix(1596213281),
		confirmations: () => BigNumber.make(5),
		votes: () => ["10"],
		unvotes: () => ["10"],
		sender: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipient: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipients: () => [],
		amount: () => BigNumber.make(1).times(1e8),
		fee: () => BigNumber.make(0.2).times(1e8),
		memo: () => "Test",
		asset: () => ({ a: "b" }),
		isConfirmed: () => false,
		isSent: () => true,
		isReceived: () => false,
		isTransfer: () => true,
		isSecondSignature: () => true,
		isMultiSignature: () => false,
		isDelegateRegistration: () => false,
		isDelegateResignation: () => false,
		isVote: () => true,
		isUnvote: () => false,
		isIpfs: () => false,
		isMultiPayment: () => false,
		isHtlcLock: () => false,
		isHtlcClaim: () => false,
		isHtlcRefund: () => false,

		isEntityRegistration: () => false,
		isEntityResignation: () => false,
		isEntityUpdate: () => false,
		isBusinessEntityRegistration: () => false,
		isBusinessEntityResignation: () => false,
		isBusinessEntityUpdate: () => false,
		isDeveloperEntityRegistration: () => false,
		isDeveloperEntityResignation: () => false,
		isDeveloperEntityUpdate: () => false,
		isCorePluginEntityRegistration: () => false,
		isCorePluginEntityResignation: () => false,
		isCorePluginEntityUpdate: () => false,
		isDesktopPluginEntityRegistration: () => false,
		isDesktopPluginEntityResignation: () => false,
		isDesktopPluginEntityUpdate: () => false,
		isDelegateEntityRegistration: () => false,
		isDelegateEntityResignation: () => false,
		isDelegateEntityUpdate: () => false,
		isLegacyBusinessRegistration: () => false,
		isLegacyBusinessResignation: () => false,
		isLegacyBusinessUpdate: () => false,
		isLegacyBridgechainRegistration: () => false,
		isLegacyBridgechainResignation: () => false,
		isLegacyBridgechainUpdate: () => false,
		toObject: () => ({ a: "b" }),
		hasPassed: () => true,
		hasFailed: () => false,
		getMeta: () => "",
		setMeta: () => "",
		// @ts-ignore
		explorerLink: () =>
			"https://explorer.ark.io/transaction/ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
	},
	{
		id: () => "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		blockId: () => "71fd1a494ded5430586f4dd1c79c3ac77bf38120e868c8f8980972b8075d67e9",
		type: () => "delegateRegistration",
		timestamp: () => DateTime.fromUnix(1596213281),
		confirmations: () => BigNumber.make(5),
		votes: () => ["10"],
		unvotes: () => ["10"],
		sender: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipient: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipients: () => [],
		amount: () => BigNumber.make(1).times(1e8),
		fee: () => BigNumber.make(0.2).times(1e8),
		memo: () => "Test",
		asset: () => ({ a: "b" }),
		isConfirmed: () => false,
		isSent: () => true,
		isReceived: () => false,
		isTransfer: () => true,
		isSecondSignature: () => true,
		isMultiSignature: () => false,
		isDelegateRegistration: () => true,
		isDelegateResignation: () => false,
		isVote: () => true,
		isUnvote: () => false,
		isIpfs: () => false,
		isMultiPayment: () => false,
		isHtlcLock: () => false,
		isHtlcClaim: () => false,
		isHtlcRefund: () => false,

		isEntityRegistration: () => false,
		isEntityResignation: () => false,
		isEntityUpdate: () => false,
		isBusinessEntityRegistration: () => false,
		isBusinessEntityResignation: () => false,
		isBusinessEntityUpdate: () => false,
		isDeveloperEntityRegistration: () => false,
		isDeveloperEntityResignation: () => false,
		isDeveloperEntityUpdate: () => false,
		isCorePluginEntityRegistration: () => false,
		isCorePluginEntityResignation: () => false,
		isCorePluginEntityUpdate: () => false,
		isDesktopPluginEntityRegistration: () => false,
		isDesktopPluginEntityResignation: () => false,
		isDesktopPluginEntityUpdate: () => false,
		isDelegateEntityRegistration: () => false,
		isDelegateEntityResignation: () => false,
		isDelegateEntityUpdate: () => false,
		isLegacyBusinessRegistration: () => false,
		isLegacyBusinessResignation: () => false,
		isLegacyBusinessUpdate: () => false,
		isLegacyBridgechainRegistration: () => false,
		isLegacyBridgechainResignation: () => false,
		isLegacyBridgechainUpdate: () => false,
		toObject: () => ({ a: "b" }),
		hasPassed: () => true,
		hasFailed: () => false,
		getMeta: () => "",
		setMeta: () => "",
		// @ts-ignore
		explorerLink: () =>
			"https://explorer.ark.io/transaction/ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
	},
];

export const portfolioPercentages = [
	{
		label: "ARK",
		value: 40,
		color: "danger-500",
	},
	{
		label: "BTC",
		value: 25,
		color: "warning-500",
	},
	{
		label: "ETH",
		value: 20,
		color: "primary-500",
	},
	{
		label: "Other",
		value: 15,
		color: "neutral-400",
	},
];

export const balances = [
	{ name: "Mon", label: "22 Jun, 2020", usd: 1000, btc: 2400, formatted: { usd: "1,000", btc: "0.26" } },
	{ name: "Tue", label: "23 Jun, 2020", usd: 3000, btc: 5400, formatted: { usd: "3,000", btc: "0.58" } },
	{ name: "Wed", label: "24 Jun, 2020", usd: 15100, btc: 1398, formatted: { usd: "15,100", btc: "0.15" } },
	{ name: "Thu", label: "25 Jun, 2020", usd: 4000, btc: 9800, formatted: { usd: "4,000", btc: "1.06" } },
	{ name: "Fri", label: "26 Jun, 2020", usd: 11200, btc: 2000, formatted: { usd: "11,200", btc: "0.22" } },
	{ name: "Sat", label: "27 Jun, 2020", usd: 3000, btc: 4800, formatted: { usd: "3,000", btc: "0.52" } },
	{ name: "Sun", label: "28 Jun, 2020", usd: 8000, btc: 18000, formatted: { usd: "8,000", btc: "2.16" } },
];
