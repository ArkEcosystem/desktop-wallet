import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { AddressRow } from "./AddressRow";

type AddressTableProps = {
	wallets: ReadWriteWallet[];
	onSelect?: (address: string) => void;
};

export const AddressTable = ({ wallets, onSelect }: AddressTableProps) => {
	const { t } = useTranslation();

	const columns = [
		{
			accessor: "walletAddressAvatar",
			disableSortBy: true,
			className: "hidden",
		},
		{
			Header: t("COMMON.ADDRESS"),
			accessor: "walletAddress",
		},
		{
			accessor: "type",
			disableSortBy: true,
		},
		{
			Header: t("COMMON.BALANCE"),
			accessor: "balance",
			className: "justify-end",
		},
		{
			accessor: "delegateAddressAvatar",
			disableSortBy: true,
			className: "hidden",
		},
		{
			Header: t("COMMON.DELEGATE"),
			accessor: "delegate",
		},
		{
			Header: t("COMMON.RANK"),
			accessor: "rank",
			className: "justify-center",
		},
		{
			Header: t("COMMON.PROFILE"),
			accessor: "profile",
			disableSortBy: true,
			className: "justify-center",
		},
		{
			Header: t("COMMON.STATUS"),
			accessor: "status",
			disableSortBy: true,
			className: "justify-center",
		},
		{
			accessor: "onSelect",
			disableSortBy: true,
		},
	];

	const showSkeleton = useMemo(() => wallets.length === 0, [wallets]);
	const skeletonList = new Array(8).fill({ isLoading: true });
	const data = showSkeleton ? skeletonList : wallets;

	return (
		<div data-testid="AddressTable">
			<h2 className="py-5 text-2xl font-bold">{t("VOTE.ADDRESS_TABLE.TITLE")}</h2>
			<Table columns={columns} data={data}>
				{(wallet: ReadWriteWallet, index: number) => (
					<AddressRow index={index} wallet={wallet} isLoading={showSkeleton} onSelect={onSelect} />
				)}
			</Table>
		</div>
	);
};

AddressTable.defaultProps = {
	wallets: [],
};
