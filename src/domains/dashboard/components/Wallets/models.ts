import { Contracts } from "@arkecosystem/platform-sdk-profiles";

export interface GridWallet {
	isBlank?: boolean;
	wallet?: Contracts.IReadWriteWallet;
}

export interface WalletGridProps {
	isVisible?: boolean;
	isLoading?: boolean;
	sliderOptions?: Record<string, any>;
	wallets: GridWallet[];
	onWalletAction?: any;
}

export interface WalletListProps {
	wallets: GridWallet[];
	walletsDisplayType?: string;
	isVisible?: boolean;
	isLoading?: boolean;
	hasMore?: boolean;
	onViewMore?: any;
	onRowClick?: (walletId: string) => void;
}

export interface UseWalletDisplayProps {
	wallets?: Contracts.IReadWriteWallet[];
	selectedNetworkIds?: string[];
	displayType?: string;
	viewMore?: boolean;
	listPagerLimit?: number;
}
