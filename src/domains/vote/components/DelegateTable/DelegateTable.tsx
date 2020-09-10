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
	title?: string;
	coin?: string;
	delegates: ReadOnlyWallet[];
	votes?: ReadOnlyWallet[];
	onContinue?: (unvotes: string[], votes: string[]) => void;
};

export const DelegateTable = ({ title, coin, delegates, votes, onContinue }: DelegateTableProps) => {
	const { t } = useTranslation();
	const [unvotesSelected, setUnvotesSelected] = useState([] as Delegate[]);
	const [votesSelected, setVotesSelected] = useState([] as Delegate[]);

	const columns = [
		{
			Header: t("VOTE.DELEGATE_TABLE.NAME"),
			accessor: "delegateName",
			className: "pl-14",
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

	const toggleUnvotesSelected = (delegate: Delegate) => {
		if (unvotesSelected.find((selectedDelegate) => selectedDelegate.username === delegate.username)) {
			setUnvotesSelected(
				unvotesSelected.filter((selectedDelegate) => selectedDelegate.username !== delegate.username),
			);

			return;
		}

		if (coin === "ARK") {
			setUnvotesSelected([delegate]);
		} else {
			setUnvotesSelected([...unvotesSelected, delegate]);
		}
	};

	const toggleVotesSelected = (delegate: Delegate) => {
		if (votesSelected.find((selectedDelegate) => selectedDelegate.username === delegate.username)) {
			setVotesSelected(
				votesSelected.filter((selectedDelegate) => selectedDelegate.username !== delegate.username),
			);

			return;
		}

		if (coin === "ARK") {
			setVotesSelected([delegate]);
		} else {
			setVotesSelected([...votesSelected, delegate]);
		}
	};

	const showSkeleton = useMemo(() => delegates.length === 0, [delegates]);
	const skeletonList = new Array(8).fill({});
	const data = showSkeleton ? skeletonList : delegates;

	return (
		<div data-testid="DelegateTable">
			<h2 className="py-5 text-2xl font-bold">{title ? title : t("VOTE.DELEGATE_TABLE.TITLE")}</h2>
			<Table columns={columns} data={data}>
				{(delegate: ReadOnlyWallet, index: number) => {
					const hasVotes = votes && votes.length > 0;
					let isVoted = false;

					if (hasVotes) {
						isVoted = !!votes?.find((vote) => vote.address() === delegate.address());
					}

					return (
						<DelegateRow
							index={index}
							delegate={delegate}
							unvotesSelected={unvotesSelected}
							votesSelected={votesSelected}
							isVoted={isVoted}
							isLoading={showSkeleton}
							onUnvoteSelect={toggleUnvotesSelected}
							onVotesSelect={toggleVotesSelected}
						/>
					);
				}}
			</Table>

			{(unvotesSelected.length > 0 || votesSelected.length > 0) && (
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
												{votesSelected.length}
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
												{unvotesSelected.length}
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
												{coin === "ARK" ? "1/1" : votesSelected.length + unvotesSelected.length}
											</div>
										</div>
									</div>
								</div>
							</div>

							<Button
								onClick={() =>
									onContinue?.(
										unvotesSelected.map((select) => select.address),
										votesSelected.map((select) => select.address),
									)
								}
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
	votes: [],
};
