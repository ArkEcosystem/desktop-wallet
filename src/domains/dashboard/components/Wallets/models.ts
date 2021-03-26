import { Contracts } from "@arkecosystem/platform-sdk-profiles";

export type GridWallet = {
	isBlank?: boolean;
	wallet?: Contracts.IReadWriteWallet;
};

export type WalletGridProps = {
	isVisible?: boolean;
	isLoading?: boolean;
	sliderOptions?: Record<string, any>;
	wallets: GridWallet[];
	onWalletAction?: any;
};

export type WalletListProps = {
	wallets: GridWallet[];
	isVisible?: boolean;
	isLoading?: boolean;
	hasMore?: boolean;
	onViewMore?: any;
	onRowClick?: (walletId: string) => void;
};

export type UseWalletDisplayProps = {
	wallets?: Contracts.IReadWriteWallet[];
	selectedNetworkIds?: string[];
	displayType?: string;
	viewMore?: boolean;
	listPagerLimit?: number;
};
