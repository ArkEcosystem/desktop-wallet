import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
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

const SelectedDelegateList = ({ delegates, className }: { delegates: Delegate[]; className: string }) => {
	const output = [];

	for (const delegate of delegates) {
		output.push(
			<div
				key={delegate.username}
				className="flex items-center py-4 font-semibold border-b border-dashed border-theme-neutral-200 last:border-0"
			>
				<div className="flex flex-1">
					<Avatar address={delegate.address} className="mr-8" />
					<div className="mr-2">{delegate.username}</div>
					<div className="text-theme-neutral">{delegate.address}</div>
				</div>
				#{delegate.rank}
			</div>,
		);
	}

	return <div className={className}>{output}</div>;
};

const DelegateAvatarList = ({ delegates, limit }: { delegates: Delegate[]; limit: number }) => {
	const items = delegates.slice(0, limit);
	const rest = Math.max(0, delegates.length - limit);

	return (
		<div className="flex items-center -space-x-2" data-testid="DelegateAvatarList__avatar-list">
			{items.map((item, index) => (
				<Avatar key={index} address={item.address} data-testid="DelegateAvatarList__avatar-list__avatar" />
			))}
			{rest > 0 && (
				<Circle
					size="lg"
					className="text-lg font-bold bg-theme-background border-theme-neutral-200 text-theme-primary-dark"
					data-testid="DelegateAvatarList__avatar-list__rest"
				>
					+{rest}
				</Circle>
			)}
		</div>
	);
};

export const DelegateTable = ({ coin, delegates, onContinue }: DelegateTableProps) => {
	const { t } = useTranslation();
	const [selected, setSelected] = useState([] as Delegate[]);
	const [showSelectedList, setShowSelectedList] = useState(false);

	const columns = [
		{
			Header: "Avatar",
			disableSortBy: true,
			className: "hidden",
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
					<div className="flex">
						<div className="px-8 mr-8 font-semibold border-r border-theme-neutral-300">
							<div className="text-sm text-theme-neutral">{t("COMMON.QUANTITY")}</div>
							{coin === "ARK" ? (
								<div className="text-theme-neutral-dark">{selected.length}/1</div>
							) : (
								<div className="text-theme-neutral-dark">{selected.length}/50</div>
							)}
						</div>

						<div className="flex-1">
							<div className="flex justify-between">
								<div className="font-semibold">
									{selected.length === 1 ? (
										<>
											<div className="inline-flex">
												<Avatar address={selected[0].address} className="mr-4" />
												<div className="flex flex-col">
													<div className="text-sm text-theme-neutral-dark">
														{t("COMMON.DELEGATE")}
													</div>
													<div className="text-theme-neutral">
														{selected[0].username} - {selected[0].address}
													</div>
												</div>
											</div>
										</>
									) : (
										<div className="inline-flex items-center">
											<DelegateAvatarList delegates={selected} limit={2} />
											<div
												className="ml-4 cursor-pointer text-theme-primary-dark hover:text-theme-primary-500"
												onClick={() => setShowSelectedList(!showSelectedList)}
												data-testid="DelegateTable__toggle-show-selected"
											>
												{showSelectedList
													? t("VOTE.DELEGATE_TABLE.HIDE_LIST")
													: t("VOTE.DELEGATE_TABLE.SHOW_LIST")}
											</div>
										</div>
									)}
								</div>

								<Button
									onClick={() => onContinue?.(selected.map((select) => select.address))}
									data-testid="DelegateTable__continue-button"
								>
									{t("COMMON.CONTINUE")}
								</Button>
							</div>

							{showSelectedList && <SelectedDelegateList delegates={selected} className="mt-2" />}
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
