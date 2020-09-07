import { DelegateService, ExtendedTransactionData, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";

export const filterEntities = (entities: ExtendedTransactionData[], query: string) => {
	if (!query || query === "") return entities;

	const matchesAssetName = (entity: ExtendedTransactionData, query: string) => {
		const { data }: any = entity.asset();
		return data.name.toLowerCase().includes(query.toLowerCase());
	};

	const matchesAddress = (entity: ExtendedTransactionData, query: string) =>
		entity.wallet().address().toLowerCase().includes(query.toLowerCase());

	const matchesWalletName = (entity: ExtendedTransactionData, query: string) =>
		entity.wallet().alias()?.toLowerCase().includes(query.toLowerCase());

	return entities.filter(
		(e) => matchesAssetName(e, query) || matchesWalletName(e, query) || matchesAddress(e, query),
	);
};

export const filterDelegates = (delegateWallets: ReadWriteWallet[], delegates: DelegateService, query: string) => {
	const matchesUserName = (wallet: ReadWriteWallet, query: string) => {
		const delegateInfo = delegates.findByAddress(wallet.coinId(), wallet.networkId(), wallet.address());
		return delegateInfo.username()?.toLowerCase().includes(query);
	};

	return delegateWallets.filter((e) => matchesUserName(e, query));
};
