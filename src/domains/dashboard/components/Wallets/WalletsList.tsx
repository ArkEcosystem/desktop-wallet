import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { EmptyBlock } from "app/components/EmptyBlock";
import { Table } from "app/components/Table";
import { WalletListItem } from "app/components/WalletListItem";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";

import { WalletListProps } from "./";

export const WalletsList = memo(({ isVisible, wallets = [], hasMore, onRowClick, onViewMore }: WalletListProps) => {
	const { t } = useTranslation();

	const columns = [
		{
			Header: t("COMMON.WALLET_ADDRESS"),
			accessor: ({ wallet }: { wallet: ReadWriteWallet }) => wallet.alias() || wallet.address(),
			className: "ml-24",
		},
		{
			Header: t("COMMON.WALLET_TYPE"),
			className: "justify-center",
		},
		{
			Header: t("COMMON.BALANCE"),
			accessor: ({ wallet }: { wallet: ReadWriteWallet }) => wallet.balance?.().toFixed(),
			className: "justify-end",
		},
		{
			Header: t("COMMON.FIAT_VALUE"),
			accessor: ({ wallet }: { wallet: ReadWriteWallet }) => wallet.convertedBalance?.().toFixed(),
			className: "justify-end",
		},
	];

	if (!isVisible) return <></>;

	return (
		<div data-testid="WalletsList">
			{wallets.length > 0 && (
				<div data-testid="WalletTable">
					<Table columns={columns} data={wallets}>
						{(rowData: any) => <WalletListItem {...rowData} onClick={onRowClick} />}
					</Table>

					{hasMore && (
						<Button
							variant="plain"
							className="w-full mt-10 mb-5"
							data-testid="WalletsList__ViewMore"
							onClick={onViewMore}
						>
							{t("COMMON.VIEW_MORE")}
						</Button>
					)}
				</div>
			)}

			{!hasMore && wallets.length === 0 && (
				<EmptyBlock>{t("DASHBOARD.WALLET_CONTROLS.EMPTY_MESSAGE")}</EmptyBlock>
			)}
		</div>
	);
});

WalletsList.displayName = "WalletsList";
