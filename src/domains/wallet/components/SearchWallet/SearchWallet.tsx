import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { SearchResource } from "app/components/SearchResource";
import { TableCell, TableRow } from "app/components/Table";
import { Table } from "app/components/Table";
import { useDarkMode } from "app/hooks";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import React from "react";
import { useTranslation } from "react-i18next";

type SearchWalletListItemProps = {
	address: string;
	balance: BigNumber;
	coinId: string;
	coinName: string;
	convertedBalance: BigNumber;
	currency: string;
	exchangeCurrency: string;
	index: number;
	name?: string;
	showNetwork: boolean;
	onAction: any;
};

const SearchWalletListItem = ({
	address,
	balance,
	coinId,
	coinName,
	convertedBalance,
	currency,
	exchangeCurrency,
	index,
	name,
	showNetwork,
	onAction,
}: SearchWalletListItemProps) => {
	const [shadowColor, setShadowColor] = React.useState("--theme-background-color");

	const isDark = useDarkMode();

	const { t } = useTranslation();

	return (
		<TableRow
			onMouseEnter={() => setShadowColor(isDark ? "--theme-color-neutral-800" : "--theme-color-neutral-100")}
			onMouseLeave={() => setShadowColor("")}
		>
			<TableCell variant="start" innerClassName="space-x-4">
				<div className="-space-x-2">
					{showNetwork && (
						<NetworkIcon size="lg" coin={coinName} network={coinId} shadowColor={shadowColor} />
					)}
					<Avatar size="lg" address={address} shadowColor={shadowColor} />
				</div>
				<Address walletName={name} address={address} maxChars={22} />
			</TableCell>

			<TableCell innerClassName="font-semibold justify-end">
				<Amount value={balance} ticker={currency} />
			</TableCell>

			<TableCell innerClassName="text-theme-neutral-light justify-end">
				<Amount value={convertedBalance} ticker={exchangeCurrency} />
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end">
				<Button
					data-testid={`SearchWalletListItem__select-${index}`}
					variant="plain"
					onClick={() => onAction({ address, coinId, coinName, name })}
				>
					{t("COMMON.SELECT")}
				</Button>
			</TableCell>
		</TableRow>
	);
};

type SearchWalletProps = {
	isOpen: boolean;
	title: string;
	description?: string;
	searchBarExtra?: React.ReactNode;
	wallets: ReadWriteWallet[];
	showNetwork: boolean;
	onClose?: any;
	onSearch?: any;
	onSelectWallet?: any;
};

export const SearchWallet = ({
	isOpen,
	title,
	description,
	searchBarExtra,
	wallets,
	showNetwork,
	onClose,
	onSearch,
	onSelectWallet,
}: SearchWalletProps) => {
	const { t } = useTranslation();

	const columns = [
		{
			Header: t("COMMON.WALLET_ADDRESS"),
			accessor: (wallet: ReadWriteWallet) => wallet.alias() || wallet.address(),
			className: showNetwork ? "ml-24" : "ml-15",
		},
		{
			Header: t("COMMON.BALANCE"),
			accessor: (wallet: ReadWriteWallet) => wallet.balance?.().toFixed(),
			className: "justify-end",
		},
		{
			Header: t("COMMON.FIAT_VALUE"),
			accessor: (wallet: ReadWriteWallet) => wallet.convertedBalance?.().toFixed(),
			className: "justify-end",
		},
		{
			Header: t("COMMON.ACTION"),
			className: "hidden no-border",
		},
	];

	return (
		<SearchResource
			isOpen={isOpen}
			title={title}
			description={description}
			searchBarExtra={searchBarExtra}
			onClose={onClose}
			onSearch={onSearch}
		>
			<div>
				<Table columns={columns} data={wallets}>
					{(wallet: ReadWriteWallet, index: number) => (
						<SearchWalletListItem
							index={index}
							address={wallet.address()}
							balance={wallet.balance()}
							convertedBalance={wallet.convertedBalance()}
							coinId={wallet.networkId()}
							coinName={wallet.coinId()}
							currency={wallet.currency()}
							exchangeCurrency={wallet.exchangeCurrency() || "BTC"} // @TODO get default from SDK
							name={wallet.alias()}
							showNetwork={showNetwork}
							onAction={onSelectWallet}
						/>
					)}
				</Table>
			</div>
		</SearchResource>
	);
};

SearchWallet.defaultProps = {
	isOpen: false,
	showNetwork: true,
};
