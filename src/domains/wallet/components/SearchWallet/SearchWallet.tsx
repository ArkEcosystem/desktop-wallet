import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { upperFirst } from "@arkecosystem/utils";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { SearchResource } from "app/components/SearchResource";
import { Table } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

type SearchWalletListItemProps = {
	index: number;
	address: string;
	balance: BigNumber;
	convertedBalance: BigNumber;
	coinName: string;
	currency: string;
	exchangeCurrency: string;
	name?: string;
	showNetwork: boolean;
	onAction: any;
};

const SearchWalletListItem = ({
	index,
	address,
	balance,
	convertedBalance,
	coinName,
	currency,
	exchangeCurrency,
	name,
	showNetwork,
	onAction,
}: SearchWalletListItemProps) => {
	const { t } = useTranslation();

	return (
		<tr className="border-b border-theme-neutral-200">
			<td className="py-6 mt-1">
				<div className="flex">
					{showNetwork && (
						<Circle className="-mr-2" size="lg">
							<Icon name={coinName} width={20} height={20} />
						</Circle>
					)}
					<Avatar size="lg" address={address} />
				</div>
			</td>
			<td className="py-1">
				<Address walletName={name} address={address} maxChars={22} />
			</td>
			<td className="font-semibold text-right">
				<Amount value={balance} ticker={currency} />
			</td>
			<td className="text-right text-theme-neutral-light">
				<Amount value={convertedBalance} ticker={exchangeCurrency} />
			</td>
			<td>
				<div className="text-right">
					<Button
						data-testid={`SearchWalletListItem__select-${index}`}
						variant="plain"
						onClick={() => onAction({ address, coinName, name })}
					>
						{t("COMMON.SELECT")}
					</Button>
				</div>
			</td>
		</tr>
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

	const listColumns = [
		{
			Header: t("COMMON.ASSET_TYPE"),
			className: !showNetwork ? "invisible w-0" : "",
		},
		{
			Header: t("COMMON.ADDRESS"),
			accessor: "address",
		},
		{
			Header: t("COMMON.BALANCE"),
			accessor: "balance",
			className: "justify-end",
		},
		{
			Header: t("COMMON.FIAT_VALUE"),
			accessor: "fiat",
			className: "justify-end",
		},
		{
			Header: t("COMMON.ACTION"),
			className: "invisible w-0",
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
			<Table columns={listColumns} data={wallets}>
				{(wallet: ReadWriteWallet, index: number) => (
					<SearchWalletListItem
						index={index}
						address={wallet.address()}
						balance={wallet.balance()}
						convertedBalance={wallet.convertedBalance()}
						coinName={upperFirst(wallet.coinId().toLowerCase())}
						currency={wallet.currency()}
						exchangeCurrency={wallet.exchangeCurrency() || "BTC"} // @TODO get default from SDK
						name={wallet.alias()}
						showNetwork={showNetwork}
						onAction={onSelectWallet}
					/>
				)}
			</Table>
		</SearchResource>
	);
};

SearchWallet.defaultProps = {
	isOpen: false,
	showNetwork: true,
};
