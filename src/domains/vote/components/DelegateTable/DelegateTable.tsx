import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Table } from "app/components/Table";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { DelegateRow } from "./DelegateRow";

type Delegate = { address: string; username: string; rank: number };

type DelegateTableProps = {
	coin?: string;
	delegates: ReadOnlyWallet[];
	onContinue?: (votes: string[]) => void;
};

export const DelegateTable = ({ coin, delegates, onContinue }: DelegateTableProps) => {
	const { t } = useTranslation();
	const [selected, setSelected] = useState([] as Delegate[]);

	const columns = [
		{
			accessor: "delegateAddressAvatar",
			disableSortBy: true,
		},
		{
			Header: t("VOTE.DELEGATE_TABLE.NAME"),
			accessor: "delegateName",
		},
		{
			Header: t("COMMON.RANK"),
			accessor: "rank",
		},
		{
			Header: t("VOTE.DELEGATE_TABLE.VOTES"),
			accessor: "votes",
		},
		{
			Header: t("COMMON.PROFILE"),
			accessor: "profile",
			disableSortBy: true,
			className: "flex justify-center",
		},
		{
			Header: t("VOTE.DELEGATE_TABLE.COMMISSION"),
			accessor: "commissionPercentage",
		},
		{
			Header: t("VOTE.DELEGATE_TABLE.PAYOUT_INTERVAL"),
			accessor: "payout",
		},
		{
			Header: t("VOTE.DELEGATE_TABLE.MIN"),
			accessor: "min",
		},
		{
			Header: t("VOTE.DELEGATE_TABLE.COMMISSION_BY_PERIOD", { period: t("COMMON.PERIODS.DAILY") }),
			accessor: "commissionDaily",
		},
		{
			Header: t("VOTE.DELEGATE_TABLE.VOTE"),
			accessor: "onSelect",
			className: "justify-end",
		},
	];

	const toggleSelected = (delegate: Delegate) => {
		if (selected.find((selectedDelegate: Delegate) => selectedDelegate.username === delegate.username)) {
			setSelected(
				selected.filter((selectedDelegate: Delegate) => selectedDelegate.username !== delegate.username),
			);

			return;
		}

		if (coin === "ARK") {
			setSelected([delegate]);
		} else {
			setSelected([...selected, delegate]);
		}
	};

	const showSkeleton = useMemo(() => delegates.length === 0, [delegates]);
	const skeletonList = new Array(8).fill({});
	const data = showSkeleton ? skeletonList : delegates;

	return (
		<div data-testid="DelegateTable">
			<h2 className="py-5 text-2xl font-bold">{t("VOTE.DELEGATE_TABLE.TITLE")}</h2>
			<Table columns={columns} data={data}>
				{(delegate: ReadOnlyWallet, index: number) => (
					<DelegateRow
						index={index}
						delegate={delegate}
						selected={selected}
						isLoading={showSkeleton}
						onSelect={toggleSelected}
					/>
				)}
			</Table>

			{selected.length > 0 && (
				<div
					className="fixed bottom-0 left-0 right-0 pt-8 pb-10 pl-4 pr-12 bg-white shadow-2xl"
					data-testid="DelegateTable__footer"
				>
					<div className="flex-1">
						<div className="flex justify-between">
							<div className="flex font-semibold">
								<div className="px-8 border-r border-theme-neutral-300">
									<div className="inline-flex">
										<Circle
											className="mr-2 bg-theme-background border-theme-neutral-900 text-theme-neutral-900"
											size="lg"
										>
											<Icon name="Vote" className="text-xl" />
										</Circle>
										<div className="flex flex-col">
											<div className="text-theme-neutral">{t("VOTE.DELEGATE_TABLE.VOTES")}</div>
											<div
												className="text-theme-neutral-900"
												data-testid="DelegateTable__footer--votes"
											>
												{selected.length}
											</div>
										</div>
									</div>
								</div>

								<div className="px-8 border-r border-theme-neutral-300">
									<div className="inline-flex">
										<Circle
											className="mr-2 bg-theme-background border-theme-neutral-900 text-theme-neutral-900"
											size="lg"
										>
											<Icon name="Unvote" className="text-xl" />
										</Circle>
										<div className="flex flex-col">
											<div className="text-theme-neutral">{t("VOTE.DELEGATE_TABLE.UNVOTES")}</div>
											<div
												className="text-theme-neutral-900"
												data-testid="DelegateTable__footer--unvotes"
											>
												0
											</div>
										</div>
									</div>
								</div>

								<div className="px-8">
									<div className="inline-flex">
										<Circle
											className="mr-2 bg-theme-background border-theme-neutral-900 text-theme-neutral-900"
											size="lg"
										>
											<Icon name="VoteUnvote" className="text-xl" />
										</Circle>
										<div className="flex flex-col">
											<div className="text-theme-neutral">{t("VOTE.DELEGATE_TABLE.TOTAL")}</div>
											<div
												className="text-theme-neutral-900"
												data-testid="DelegateTable__footer--total"
											>
												{selected.length}/1
											</div>
										</div>
									</div>
								</div>
							</div>

							<Button
								onClick={() => onContinue?.(selected.map((select) => select.address))}
								data-testid="DelegateTable__continue-button"
							>
								{t("COMMON.CONTINUE")}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

DelegateTable.defaultProps = {
	coin: "ARK",
	delegates: [],
};
