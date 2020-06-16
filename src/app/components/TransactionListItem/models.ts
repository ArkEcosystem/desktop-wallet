export type TransactionListItemProps = {
	date: string;
	avatarId: string;
	type: string;
	address?: string;
	walletName?: string;
	amount: string;
	fiat: string;
	variant?: "default" | "compact";
	onClick?: any;
};
