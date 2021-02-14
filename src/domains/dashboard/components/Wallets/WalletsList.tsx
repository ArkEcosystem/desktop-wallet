import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { EmptyBlock } from "app/components/EmptyBlock";
import { Table } from "app/components/Table";
import { WalletListItem } from "app/components/WalletListItem";
import { WalletListItemSkeleton } from "app/components/WalletListItem/WalletListItemSkeleton";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";

import { WalletListProps } from "./";

export const WalletsList = memo(
	({ isVisible = true, wallets, hasMore, onRowClick, onViewMore, isLoading = false }: WalletListProps) => {
		const { t } = useTranslation();

		const columns = [
			{
				Header: t("COMMON.WALLET_ADDRESS"),
				accessor: ({ wallet }: { wallet: ReadWriteWallet }) => wallet?.alias() || wallet?.address(),
			},
			{
				Header: t("COMMON.WALLET_TYPE"),
				className: "justify-center",
			},
			{
				Header: t("COMMON.BALANCE"),
				accessor: ({ wallet }: { wallet: ReadWriteWallet }) => wallet?.balance?.().toFixed(),
				className: "flex-row-reverse justify-end",
			},
			{
				Header: t("COMMON.FIAT_VALUE"),
				accessor: ({ wallet }: { wallet: ReadWriteWallet }) => wallet?.convertedBalance?.().toFixed(),
				className: "flex-row-reverse justify-end",
			},
		];

		if (!isVisible) {
			return <></>;
		}

		const skeletonRows = new Array(3).fill({});

		const tableRows = isLoading ? skeletonRows : wallets;

		return (
			<div data-testid="WalletsList">
				<Table columns={columns} data={tableRows}>
					{(rowData: any) =>
						isLoading ? <WalletListItemSkeleton /> : <WalletListItem {...rowData} onClick={onRowClick} />
					}
				</Table>

				{wallets.length > 0 && (
					<div data-testid="WalletTable">
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
					<EmptyBlock>{t("DASHBOARD.WALLET_CONTROLS.EMPTY_MESSAGE")}</EmptyBlock>
				)}
			</div>
		);
	},
);

WalletsList.displayName = "WalletsList";
