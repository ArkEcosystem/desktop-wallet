import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

const baseWallet = {
	coinIcon: "ARK",
	coinClassName: "text-theme-danger-400 border-theme-danger-200",
	avatarId: "test1",
	address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
	publicKey: "03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbb",
	balance: "120 ARK",
	fiat: "980 USD",
	actions: [
		{
			label: "Action 1",
			value: "1",
		},
		{
			label: "Action 2",
			value: "2",
		},
		{
			label: "Action 3",
			value: "3",
		},
	],
	delegates: [
		{
			username: "Delegate 3",
			address: "AbuzhuDTyhnfAqepZzVcVsgd1Ym6FgETuW",
			rank: 1,
			explorerUrl: "https://dexplorer.ark.io",
			msqUrl: "https://marketsquare.ark.io",
			isActive: true,
		},
	],
	business: {
		name: "ROBank Eco",
	},
	pendingTransactions: [
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
			isMagistrate: () => false,
			toObject: () => ({ a: "b" }),
			hasPassed: () => true,
			hasFailed: () => false,
			getMeta: () => "",
			setMeta: () => "",
			explorerLink: () => "",
			total: () => BigNumber.make(121).times(1e8),
			convertedTotal: () => BigNumber.ZERO,
			wallet: () => undefined,
			coin: () => undefined,
			data: () => undefined,
		},
	],
	transactions: [
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
			isMagistrate: () => false,
			toObject: () => ({ a: "b" }),
			hasPassed: () => true,
			hasFailed: () => false,
			getMeta: () => "",
			setMeta: () => "",
			explorerLink: () => "",
			total: () => BigNumber.make(121).times(1e8),
			convertedTotal: () => BigNumber.ZERO,
			wallet: () => undefined,
			coin: () => undefined,
			data: () => undefined,
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
			isMagistrate: () => false,
			toObject: () => ({ a: "b" }),
			hasPassed: () => true,
			hasFailed: () => false,
			getMeta: () => "",
			setMeta: () => "",
			explorerLink: () => "",
			total: () => BigNumber.make(121).times(1e8),
			convertedTotal: () => BigNumber.ZERO,
			wallet: () => undefined,
			coin: () => undefined,
			data: () => undefined,
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
			isMagistrate: () => false,
			toObject: () => ({ a: "b" }),
			hasPassed: () => true,
			hasFailed: () => false,
			getMeta: () => "",
			setMeta: () => "",
			explorerLink: () => "",
			total: () => BigNumber.make(121).times(1e8),
			convertedTotal: () => BigNumber.ZERO,
			wallet: () => undefined,
			coin: () => undefined,
			data: () => undefined,
		},
	],
};

export const wallets = [
	{
		...baseWallet,
		walletName: "ARK Wallet 1",
	},
	{
		...baseWallet,
		walletName: "ARK Wallet 2",
	},
];

export const wallet = wallets[0];

export const networks = [
	{
		icon: "ARK",
		name: "ARK Ecosystem",
		coin: "ARK",
		network: "ark.devnet",
		className: "text-theme-danger-400 border-theme-danger-200",
	},
	{
		icon: "BIND",
		name: "Compendia",
		coin: "BIND",
		network: "compendia.devnet",
		className: "text-theme-danger-400 border-theme-danger-200",
	},
	{
		icon: "BTC",
		name: "Bitcoin",
		coin: "BTC",
		network: "testnet",
		className: "text-theme-warning-400 border-theme-warning-200",
	},
	{
		icon: "ETH",
		name: "Ethereum",
		coin: "ETH",
		network: "mainnet",
		className: "text-theme-secondary-800 border-theme-secondary-600",
	},
	{
		icon: "LSK",
		name: "Lisk",
		coin: "LSK",
		network: "mainnet",
		className: "text-theme-primary-600 border-theme-primary-400",
	},
	{
		icon: "XRP",
		name: "Ripple",
		coin: "XRP",
		network: "mainnet",
		className: "text-theme-primary-700 border-theme-primary-500",
	},
];
