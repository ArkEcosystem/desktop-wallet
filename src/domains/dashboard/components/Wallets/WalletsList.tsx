import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { EmptyBlock } from "app/components/EmptyBlock";
import { Table } from "app/components/Table";
import { WalletListItem } from "app/components/WalletListItem";
import { WalletListItemSkeleton } from "app/components/WalletListItem/WalletListItemSkeleton";
import React, { memo } from "react";
import { Trans, useTranslation } from "react-i18next";

import { WalletListProperties } from ".";

export const WalletsList = memo(
	({
		isVisible = true,
		wallets,
		hasMore,
		walletsDisplayType = "all",
		onRowClick,
		onViewMore,
		isLoading = false,
	}: WalletListProperties) => {
		const { t } = useTranslation();

		const columns = [
			{
				Header: t("COMMON.WALLET_ADDRESS"),
				accessor: ({ wallet }: { wallet: Contracts.IReadWriteWallet }) => wallet?.alias() || wallet?.address(),
			},
			{
				Header: t("COMMON.WALLET_TYPE"),
				className: "justify-center",
			},
			{
				Header: t("COMMON.BALANCE"),
				accessor: ({ wallet }: { wallet: Contracts.IReadWriteWallet }) => wallet?.balance?.().toFixed(0),
				className: "flex-row-reverse justify-end",
			},
			{
				Header: t("COMMON.FIAT_VALUE"),
				accessor: ({ wallet }: { wallet: Contracts.IReadWriteWallet }) =>
					wallet?.convertedBalance?.().toFixed(0),
				className: "flex-row-reverse justify-end",
			},
		];

		if (!isVisible) {
			return <></>;
		}

		const skeletonRows = Array.from({length: 3}).fill({});

		const tableRows = isLoading ? skeletonRows : wallets;

		return (
			<div data-testid="WalletsList">
				{(wallets.length > 0 || isLoading) && (
					<div data-testid="WalletTable">
						<Table columns={columns} data={tableRows}>
							{(rowData: any) =>
								isLoading ? (
									<WalletListItemSkeleton />
								) : (
									<WalletListItem {...rowData} onClick={onRowClick} />
								)
							}
						</Table>

						{hasMore && (
							<Button
								variant="secondary"
								className="mt-10 mb-5 w-full"
								data-testid="WalletsList__ViewMore"
								onClick={onViewMore}
							>
								{t("COMMON.VIEW_MORE")}
							</Button>
						)}
					</div>
				)}

				{!isLoading && !hasMore && wallets.length === 0 && (
					<EmptyBlock>
						{walletsDisplayType !== "all" ? (
							<Trans
								i18nKey="DASHBOARD.WALLET_CONTROLS.EMPTY_MESSAGE_TYPE"
								values={{
									type: walletsDisplayType === "starred" ? t("COMMON.STARRED") : t("COMMON.LEDGER"),
								}}
								components={{ bold: <strong /> }}
							/>
						) : (
							t("DASHBOARD.WALLET_CONTROLS.EMPTY_MESSAGE")
						)}
					</EmptyBlock>
				)}
			</div>
		);
	},
);

WalletsList.displayName = "WalletsList";
