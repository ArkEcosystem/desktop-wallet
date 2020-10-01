import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

const wallet = {
	address: () => "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
	alias: () => "Test Wallet",
	currency: () => "ARK",
	exchangeCurrency: () => "BTC",
	isDelegate: () => true,
	isResignedDelegate: () => false,
};

export const TransactionFixture = {
	id: () => "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
	blockId: () => "71fd1a494ded5430586f4dd1c79c3ac77bf38120e868c8f8980972b8075d67e9",
	type: () => "transfer",
	timestamp: () => DateTime.fromUnix(1596213281),
	confirmations: () => BigNumber.make(10),
	votes: () => ["034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192"],
	unvotes: () => ["034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192"],
	sender: () => "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
	recipient: () => "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
	recipients: () => [],
	amount: () => BigNumber.make(100).times(1e8),
	convertedAmount: () => BigNumber.ZERO,
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
	isProductEntityRegistration: () => false,
	isProductEntityResignation: () => false,
	isProductEntityUpdate: () => false,
	isPluginEntityRegistration: () => false,
	isPluginEntityResignation: () => false,
	isPluginEntityUpdate: () => false,
	isModuleEntityRegistration: () => false,
	isModuleEntityResignation: () => false,
	isModuleEntityUpdate: () => false,
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
	// IPFS Type
	hash: () => "QmPRqPTEEwx95WNcSsk6YQk7aGW9hoZbTF9zE92dBj9H68",
	// @ts-ignore
	explorerLink: () =>
		"https://explorer.ark.io/transaction/ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
	explorerLinkForBlock: () =>
		"https://explorer.ark.io/blocks/71fd1a494ded5430586f4dd1c79c3ac77bf38120e868c8f8980972b8075d67e9",
	total: () => BigNumber.make(121).times(1e8),
	convertedTotal: () => BigNumber.ZERO,
	wallet: () => wallet,
	coin: () => undefined,
	data: () => undefined,
};
