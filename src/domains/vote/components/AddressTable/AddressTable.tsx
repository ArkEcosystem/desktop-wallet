import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { getNetworkExtendedData } from "domains/network/helpers";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { AddressRow } from "./AddressRow";

type AddressTableProps = {
	wallets: ReadWriteWallet[];
	onSelect?: (address: string) => void;
};

export const AddressTable = ({ wallets, onSelect }: AddressTableProps) => {
	const { t } = useTranslation();

	const wallet = useMemo(() => wallets[0], [wallets]);
	const maxVotes = wallet.network().maximumVotesPerWallet();
	const networkExtendedData = getNetworkExtendedData({ coin: wallet.coinId(), network: wallet.networkId() });

	const commonColumns = [
		{
			Header: t("COMMON.MY_ADDRESS"),
			accessor: (wallet: ReadWriteWallet) => wallet.alias() || wallet.address(),
		},
		{
			Header: t("COMMON.WALLET_TYPE"),
			accessor: "wallet-type",
			className: "justify-center",
			disableSortBy: true,
		},
		{
			Header: t("COMMON.BALANCE"),
			accessor: (wallet: ReadWriteWallet) => wallet.balance?.().toFixed(),
			className: "justify-end",
		},
		{
			Header: maxVotes === 1 ? t("COMMON.DELEGATE") : t("COMMON.DELEGATES"),
			accessor: "delegate",
			className: maxVotes === 1 ? "ml-15" : "",
			disableSortBy: true,
		},
	];

	const columns = useMemo(() => {
		if (maxVotes === 1) {
			return [
				...commonColumns,
				{
					Header: t("COMMON.RANK"),
					accessor: "rank",
					className: "justify-center",
					disableSortBy: true,
				},
				{
					Header: t("COMMON.STATUS"),
					accessor: "status",
					className: "justify-center no-border",
					disableSortBy: true,
				},
				{
					accessor: "onSelect",
					disableSortBy: true,
				},
			];
		}

		return [
			...commonColumns,
			{
				Header: t("COMMON.VOTES"),
				accessor: "votes",
				disableSortBy: true,
				className: "no-border",
			},
			{
				accessor: "onSelect",
				disableSortBy: true,
			},
		];
	}, [commonColumns, maxVotes, t]);

	return (
		<div data-testid="AddressTable">
			<div className="flex items-center py-5 space-x-4">
				<NetworkIcon size="lg" coin={wallet.coinId()} network={wallet.networkId()} />
				<div className="flex">
					<h2 className="mb-0 text-2xl font-bold">{networkExtendedData?.displayName}</h2>
					<span className="ml-2 text-2xl font-bold text-theme-secondary-500 dark:text-theme-secondary-700">
						{wallets.length}
					</span>
				</div>
			</div>

			<Table columns={columns} data={wallets}>
				{(wallet: ReadWriteWallet, index: number) => (
					<AddressRow index={index} maxVotes={maxVotes} wallet={wallet} onSelect={onSelect} />
				)}
			</Table>
		</div>
	);
};

AddressTable.defaultProps = {
	wallets: [],
};
