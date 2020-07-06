import { Breadcrumbs } from "app/components/Breadcrumbs";
import { NavigationBar } from "app/components/NavigationBar";
import { Table } from "app/components/Table";
import { TransactionListItem } from "app/components/TransactionListItem";
import { TransactionListItemProps } from "app/components/TransactionListItem/models";
import { WalletListItemProps } from "app/components/WalletListItem";
import { WalletBottomSheetMenu } from "domains/wallet/components/WalletBottomSheetMenu";
import { WalletHeader } from "domains/wallet/components/WalletHeader/WalletHeader";
import { WalletRegistrations } from "domains/wallet/components/WalletRegistrations";
import { WalletVote } from "domains/wallet/components/WalletVote";
import React from "react";

const columns = [
	{
		Header: "Date",
	},
	{
		Header: "Type",
		className: "invisible",
	},
	{
		Header: "Wallet Address",
	},
	{
		Header: "Amount",
		className: "float-right",
	},
	{
		Header: "Fiat Value",
		className: "float-right",
	},
];

const Divider = () => <div className="bg-theme-neutral-100 h-4" />;

type Wallet = WalletListItemProps & {
	address: string;
	balance: string;
	publicKey?: string;
	hasStarred?: boolean;
	transactions?: TransactionListItemProps[];
	pendingTransactions?: TransactionListItemProps[];
	delegates: {
		username: string;
		address: string;
		rank: number;
		isActive?: boolean;
		explorerUrl?: string;
		msqUrl?: string;
	}[];
	business?: {
		name: string;
	};
};

type Props = {
	wallets?: Wallet[];
	wallet: Wallet;
};

export const WalletDetails = ({ wallet, wallets }: Props) => {
	const crumbs = [
		{
			route: "portfolio",
			label: "Go back to Portfolio",
		},
	];

	return (
		<div className="relative">
			<NavigationBar currencyIcon="Ark" balance="34,253.75" userInitials="IO" />

			<Breadcrumbs crumbs={crumbs} />
			<WalletHeader
				coin={wallet.coinIcon}
				address={wallet.address}
				publicKey={wallet.publicKey}
				balance={wallet.balance}
				currencyBalance={wallet.fiat}
				name={wallet.walletName}
				isLedger={wallet.walletTypeIcons?.includes("Ledger")}
				isMultisig={wallet.walletTypeIcons?.includes("Multisig")}
				hasStarred={wallet.hasStarred}
			/>
			<Divider />

			<WalletVote delegates={wallet.delegates} />
			<Divider />

			<WalletRegistrations
				address={wallet.address}
				delegate={wallet.delegates?.[0]}
				business={wallet.business}
				isMultisig={wallet.walletTypeIcons?.includes("Multisig")}
				hasBridgechains={wallet.walletTypeIcons?.includes("Bridgechain")}
				hasSecondSignature={wallet.walletTypeIcons?.includes("Key")}
				hasPlugins={wallet.walletTypeIcons?.includes("Plugins")}
			/>
			<Divider />

			<div className="px-12 py-8">
				<h2 className="font-bold">Pending Transactions</h2>
				<Table columns={columns} data={wallet.pendingTransactions}>
					{(rowData: any) => <TransactionListItem {...rowData} />}
				</Table>
			</div>
			<div className="px-12 pt-4 pb-20">
				<h2 className="font-bold">Transaction History</h2>
				<Table columns={columns} data={wallet.transactions}>
					{(rowData: any) => <TransactionListItem {...rowData} />}
				</Table>
			</div>

			<WalletBottomSheetMenu walletsData={wallets!} />
		</div>
	);
};

WalletDetails.defaultProps = {
	wallets: [],
};
