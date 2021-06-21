import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Amount, AmountCrypto } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { EmptyResults } from "app/components/EmptyResults";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Modal } from "app/components/Modal";
import { Table, TableCell, TableRow } from "app/components/Table";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Size } from "types";

interface SearchWalletListItemProperties {
	address: string;
	balance: number;
	coinId: string;
	coinName: string;
	convertedBalance: number;
	currency: string;
	exchangeCurrency: string;
	index: number;
	name?: string;
	showConvertedValue?: boolean;
	showNetwork?: boolean;
	onAction: any;
}

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
	showConvertedValue,
	showNetwork,
	onAction,
}: SearchWalletListItemProperties) => {
	const { t } = useTranslation();

	return (
		<TableRow>
			<TableCell variant="start" innerClassName="space-x-4">
				<div className="flex-shrink-0 -space-x-2">
					{showNetwork && <NetworkIcon size="lg" coin={coinName} network={coinId} />}
					<Avatar size="lg" address={address} />
				</div>
				<Address walletName={name} address={address} maxNameChars={16} />
			</TableCell>

			<TableCell innerClassName="font-semibold justify-end">
				<AmountCrypto value={balance} ticker={currency} />
			</TableCell>

			{showConvertedValue && (
				<TableCell innerClassName="text-theme-secondary-400 justify-end">
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

interface SearchWalletProperties {
	isOpen: boolean;
	title: string;
	description?: string;
	wallets: Contracts.IReadWriteWallet[];
	searchPlaceholder?: string;
	size?: Size;
	showConvertedValue?: boolean;
	showNetwork?: boolean;
	onClose?: any;
	onSelectWallet?: any;
	profile?: Contracts.IProfile;
}

export const SearchWallet = ({
	isOpen,
	title,
	description,
	wallets,
	searchPlaceholder,
	size,
	showConvertedValue,
	showNetwork,
	onClose,
	onSelectWallet,
	profile,
}: SearchWalletProperties) => {
	const [query, setQuery] = useState("");

	const { t } = useTranslation();

	const columns = useMemo(() => {
		const commonColumns = [
			{
				Header: t("COMMON.WALLET_ADDRESS"),
				accessor: (wallet: Contracts.IReadWriteWallet) => wallet.alias() || wallet.address(),
			},
			{
				Header: t("COMMON.BALANCE"),
				accessor: (wallet: Contracts.IReadWriteWallet) => wallet.balance?.().toFixed(0),
				className: "justify-end",
			},
		];

		if (showConvertedValue) {
			return [
				...commonColumns,
				{
					Header: t("COMMON.VALUE"),
					accessor: (wallet: Contracts.IReadWriteWallet) => wallet.convertedBalance?.().toFixed(0),
					className: "justify-end",
				},
				{
					Header: (
						<HeaderSearchBar
							placeholder={searchPlaceholder}
							offsetClassName="top-1/3 -translate-y-16 -translate-x-6"
							onSearch={setQuery}
							onReset={() => setQuery("")}
							debounceTimeout={100}
							noToggleBorder
						/>
					),
					accessor: "search",
					className: "justify-end",
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
						offsetClassName="top-1/3 -translate-y-16 -translate-x-6"
						onSearch={setQuery}
						onReset={() => setQuery("")}
						debounceTimeout={100}
						noToggleBorder
					/>
				),
				accessor: "search",
				className: "justify-end",
				disableSortBy: true,
			},
		];
	}, [searchPlaceholder, showConvertedValue, t]);

	const filteredWallets = useMemo(() => {
		if (query.length === 0) {
			return wallets;
		}

		return wallets.filter(
			(wallet) =>
				wallet.address().toLowerCase().includes(query.toLowerCase()) ||
				wallet.alias()?.toLowerCase()?.includes(query.toLowerCase()),
		);
	}, [wallets, query]);

	const isEmptyResults = query.length > 0 && filteredWallets.length === 0;

	return (
		<Modal title={title} description={description} isOpen={isOpen} size={size} onClose={onClose}>
			<div className="mt-8">
				<Table columns={columns} data={filteredWallets}>
					{(wallet: Contracts.IReadWriteWallet, index: number) => (
						<SearchWalletListItem
							index={index}
							address={wallet.address()}
							balance={wallet.balance()}
							convertedBalance={wallet.convertedBalance()}
							coinId={wallet.networkId()}
							coinName={wallet.coinId()}
							currency={wallet.currency()}
							exchangeCurrency={
								wallet.exchangeCurrency() ||
								(profile?.settings().get(Contracts.ProfileSetting.ExchangeCurrency) as string)
							}
							name={wallet.alias()}
							showConvertedValue={showConvertedValue}
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
	size: "5xl",
	showConvertedValue: true,
	showNetwork: true,
};
