import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { EmptyResults } from "app/components/EmptyResults";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Modal } from "app/components/Modal";
import { TableCell, TableRow } from "app/components/Table";
import { Table } from "app/components/Table";
import { useDarkMode } from "app/hooks";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Size } from "types";

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
	showFiatValue?: boolean;
	showNetwork?: boolean;
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
	showFiatValue,
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

			{showFiatValue && (
				<TableCell innerClassName="text-theme-neutral-light justify-end">
					<Amount value={convertedBalance} ticker={exchangeCurrency} />
				</TableCell>
			)}

			<TableCell variant="end" innerClassName="justify-end">
				<Button
					data-testid={`SearchWalletListItem__select-${index}`}
					variant="secondary"
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
	wallets: ReadWriteWallet[];
	searchPlaceholder?: string;
	size?: Size;
	showFiatValue?: boolean;
	showNetwork?: boolean;
	onClose?: any;
	onSelectWallet?: any;
};

export const SearchWallet = ({
	isOpen,
	title,
	description,
	wallets,
	searchPlaceholder,
	size,
	showFiatValue,
	showNetwork,
	onClose,
	onSelectWallet,
}: SearchWalletProps) => {
	const [query, setQuery] = useState("");

	const { t } = useTranslation();

	const commonColumns = [
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
	];

	const columns = useMemo(() => {
		if (showFiatValue) {
			return [
				...commonColumns,
				{
					Header: t("COMMON.FIAT_VALUE"),
					accessor: (wallet: ReadWriteWallet) => wallet.convertedBalance?.().toFixed(),
					className: "justify-end",
				},
				{
					Header: (
						<HeaderSearchBar
							placeholder={searchPlaceholder}
							onSearch={setQuery}
							onReset={() => setQuery("")}
							debounceTimeout={100}
						/>
					),
					accessor: "search",
					className: "justify-end no-border",
					disableSortBy: true,
				},
			];
		}

		return [
			...commonColumns,
			{
				Header: (
					<HeaderSearchBar
						placeholder={searchPlaceholder}
						onSearch={setQuery}
						onReset={() => setQuery("")}
						debounceTimeout={100}
					/>
				),
				accessor: "search",
				className: "justify-end no-border",
				disableSortBy: true,
			},
		];
	}, [commonColumns, searchPlaceholder, showFiatValue, t]);

	const filteredWallets = useMemo(() => {
		if (!query.length) return wallets;

		return wallets.filter(
			(wallet) =>
				wallet.address().toLowerCase().includes(query.toLowerCase()) ||
				wallet.alias()?.toLowerCase()?.includes(query.toLowerCase()),
		);
	}, [wallets, query]);

	const isEmptyResults = query.length > 0 && !filteredWallets.length;

	return (
		<Modal title={title} description={description} isOpen={isOpen} size={size} onClose={onClose}>
			<div className="mt-8">
				<Table columns={columns} data={filteredWallets}>
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
							showFiatValue={showFiatValue}
							showNetwork={showNetwork}
							onAction={onSelectWallet}
						/>
					)}
				</Table>

				{isEmptyResults && (
					<EmptyResults
						className="mt-16"
						title={t("COMMON.EMPTY_RESULTS.TITLE")}
						subtitle={t("COMMON.EMPTY_RESULTS.SUBTITLE")}
					/>
				)}
			</div>
		</Modal>
	);
};

SearchWallet.defaultProps = {
	isOpen: false,
	searchPlaceholder: "Enter the name or address for your wallet",
	size: "5xl",
	showFiatValue: true,
	showNetwork: true,
};
