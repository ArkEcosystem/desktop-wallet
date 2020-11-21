import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { EmptyBlock } from "app/components/EmptyBlock";
import { Icon } from "app/components/Icon";
import { Pagination } from "app/components/Pagination";
import { Table } from "app/components/Table";
import { Tooltip } from "app/components/Tooltip";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { DelegateRow } from "./DelegateRow";

type DelegateTableProps = {
	delegates: ReadOnlyWallet[];
	emptyText?: string;
	isLoading?: boolean;
	itemsPerPage?: number;
	maxVotes: number;
	selectedUnvoteAddresses?: string[];
	selectedVoteAddresses?: string[];
	selectedWallet: string;
	votes?: ReadOnlyWallet[];
	onContinue?: (unvotes: string[], votes: string[]) => void;
};

export const DelegateTable = ({
	delegates,
	emptyText,
	isLoading,
	itemsPerPage,
	maxVotes,
	selectedUnvoteAddresses,
	selectedVoteAddresses,
	selectedWallet,
	votes,
	onContinue,
}: DelegateTableProps) => {
	const { t } = useTranslation();
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedUnvotes, setSelectedUnvotes] = useState<string[]>(selectedUnvoteAddresses || []);
	const [selectedVotes, setSelectedVotes] = useState<string[]>(selectedVoteAddresses || []);
	const [isVoteDisabled, setIsVoteDisabled] = useState(false);

	const columns = [
		{
			Header: t("VOTE.DELEGATE_TABLE.NAME"),
			accessor: (delegate: ReadOnlyWallet) => isLoading || delegate.username(),
			className: "ml-15",
		},
		{
			Header: t("COMMON.STATUS"),
			accessor: "status",
			className: "justify-center",
			disableSortBy: true,
		},
		{
			Header: t("COMMON.RANK"),
			accessor: (delegate: ReadOnlyWallet) => isLoading || delegate.rank(),
			className: "justify-center",
		},
		{
			Header: t("VOTE.DELEGATE_TABLE.VOTES"),
			accessor: "votes",
			className: "justify-center",
			disableSortBy: true,
		},
		{
			Header: t("COMMON.PROFILE"),
			accessor: "profile",
			className: "justify-center",
			disableSortBy: true,
		},
		{
			Header: t("VOTE.DELEGATE_TABLE.COMMISSION"),
			accessor: "commissionPercentage",
			className: "justify-center",
			disableSortBy: true,
		},
		{
			Header: t("VOTE.DELEGATE_TABLE.PAYOUT_INTERVAL"),
			accessor: "payout",
			className: "justify-center",
			disableSortBy: true,
		},
		{
			Header: t("VOTE.DELEGATE_TABLE.MIN"),
			accessor: "min",
			className: "justify-center",
			disableSortBy: true,
		},
		{
			Header: t("VOTE.DELEGATE_TABLE.COMMISSION_BY_PERIOD", { period: t("COMMON.PERIODS.DAILY") }),
			accessor: "commissionDaily",
			className: "justify-end",
			disableSortBy: true,
		},
		{
			Header: t("VOTE.DELEGATE_TABLE.VOTE"),
			accessor: "onSelect",
			className: "justify-end",
		},
	];

	const totalDelegates = delegates.length;
	const hasVotes = votes!.length > 0;

	const getTotalVotes = () => {
		if (maxVotes === 1) {
			return selectedVotes.length || selectedUnvotes.length;
		}

		return selectedVotes.length + selectedUnvotes.length;
	};

	useEffect(() => {
		if (hasVotes && selectedVotes.length === maxVotes) {
			setIsVoteDisabled(true);
		} else {
			setIsVoteDisabled(false);
		}
	}, [hasVotes, maxVotes, selectedVotes]);

	const toggleUnvotesSelected = (address: string) => {
		if (selectedUnvotes.find((delegateAddress) => delegateAddress === address)) {
			setSelectedUnvotes(selectedUnvotes.filter((delegateAddress) => delegateAddress !== address));

			if (maxVotes === 1 && selectedVotes.length > 0) {
				setSelectedVotes([]);
			}

			return;
		}

		if (maxVotes === 1) {
			setSelectedUnvotes([address]);
		} else {
			setSelectedUnvotes([...selectedUnvotes, address]);
		}
	};

	const toggleVotesSelected = (address: string) => {
		if (selectedVotes.find((delegateAddress) => delegateAddress === address)) {
			setSelectedVotes(selectedVotes.filter((delegateAddress) => delegateAddress !== address));

			if (maxVotes === 1 && hasVotes) {
				setSelectedUnvotes([]);
			}

			return;
		}

		if (maxVotes === 1) {
			setSelectedVotes([address]);

			if (hasVotes) {
				setSelectedUnvotes(votes!.map((vote) => vote.address()));
			}
		} else {
			setSelectedVotes([...selectedVotes, address]);
		}
	};

	const handleSelectPage = (page: number) => {
		setCurrentPage(page);
	};

	const paginator = (items: ReadOnlyWallet[], currentPage: number, itemsPerPage: number) => {
		const offset = (currentPage - 1) * itemsPerPage;
		const paginatedItems = items.slice(offset).slice(0, itemsPerPage);

		return paginatedItems;
	};

	const showSkeleton = useMemo(() => totalDelegates === 0 && isLoading, [totalDelegates, isLoading]);
	const skeletonList = new Array(8).fill({});
	const data = showSkeleton ? skeletonList : paginator(delegates, currentPage, itemsPerPage!);

	if (!isLoading && totalDelegates === 0) return <EmptyBlock className="-mt-5">{emptyText}</EmptyBlock>;

	return (
		<div data-testid="DelegateTable">
			<h2 className="py-5 text-2xl font-bold">{t("VOTE.DELEGATE_TABLE.TITLE")}</h2>
			<Table columns={columns} data={data}>
				{(delegate: ReadOnlyWallet, index: number) => {
					let isVoted = false;

					if (hasVotes) {
						isVoted = !!votes?.find((vote) => vote.address() === delegate.address());
					}

					return (
						<DelegateRow
							index={index}
							delegate={delegate}
							selectedUnvotes={selectedUnvotes}
							selectedVotes={selectedVotes}
							isVoted={isVoted}
							isVoteDisabled={isVoteDisabled}
							isLoading={showSkeleton}
							onUnvoteSelect={toggleUnvotesSelected}
							onVoteSelect={toggleVotesSelected}
						/>
					);
				}}
			</Table>

			<div className="flex justify-center w-full mt-10 mb-24">
				{totalDelegates > itemsPerPage! && (
					<Pagination
						totalCount={totalDelegates}
						itemsPerPage={itemsPerPage}
						currentPage={currentPage}
						onSelectPage={handleSelectPage}
					/>
				)}
			</div>

			<div
				className="fixed bottom-0 left-0 right-0 pt-8 pb-10 pl-4 pr-12 shadow-2xl bg-theme-background"
				data-testid="DelegateTable__footer"
			>
				<div className="flex-1">
					<div className="flex justify-between">
						<div className="flex font-semibold">
							<div className="px-8 border-r border-theme-neutral-300 dark:border-theme-neutral-800">
								<div className="inline-flex">
									<Avatar className="mr-2" size="lg" address={selectedWallet} noShadow />
									<div className="flex flex-col">
										<div className="text-theme-neutral">{t("VOTE.DELEGATE_TABLE.MY_ADDRESS")}</div>
										<div className="text-theme-text" data-testid="DelegateTable__footer--address">
											<Address address={selectedWallet} maxChars={24} />
										</div>
									</div>
								</div>
							</div>

							<div className="px-8 border-r border-theme-neutral-300 dark:border-theme-neutral-800">
								<div className="inline-flex">
									<Circle
										className={`mr-2 bg-theme-background ${
											selectedVotes.length === 0
												? "border-theme-neutral text-theme-neutral"
												: "border-theme-text text-theme-text"
										}`}
										size="lg"
									>
										<Icon name="Vote" className="text-xl" />
									</Circle>
									<div className="flex flex-col">
										<div className="text-theme-neutral">{t("VOTE.DELEGATE_TABLE.VOTES")}</div>
										<div
											className={
												selectedVotes.length === 0 ? "text-theme-neutral" : "text-theme-text"
											}
											data-testid="DelegateTable__footer--votes"
										>
											{selectedVotes.length}
										</div>
									</div>
								</div>
							</div>

							<div className="px-8 border-r border-theme-neutral-300 dark:border-theme-neutral-800">
								<div className="inline-flex">
									<Circle
										className={`mr-2 bg-theme-background ${
											selectedUnvotes.length === 0
												? "border-theme-neutral text-theme-neutral"
												: "border-theme-text text-theme-text"
										}`}
										size="lg"
									>
										<Icon name="Unvote" className="text-xl" />
									</Circle>
									<div className="flex flex-col">
										<div className="text-theme-neutral">{t("VOTE.DELEGATE_TABLE.UNVOTES")}</div>
										<div
											className={
												selectedUnvotes.length === 0 ? "text-theme-neutral" : "text-theme-text"
											}
											data-testid="DelegateTable__footer--unvotes"
										>
											{selectedUnvotes.length}
										</div>
									</div>
								</div>
							</div>

							<div className="px-8">
								<div className="inline-flex">
									<Circle
										className="mr-2 bg-theme-background border-theme-text text-theme-text"
										size="lg"
									>
										<Icon name="VoteCombination" className="text-xl" />
									</Circle>
									<div className="flex flex-col">
										<div className="text-theme-neutral">{t("VOTE.DELEGATE_TABLE.TOTAL")}</div>
										<div className="text-theme-text" data-testid="DelegateTable__footer--total">
											{getTotalVotes()}/{maxVotes}
										</div>
									</div>
								</div>
							</div>
						</div>

						<Tooltip
							content={t("VOTE.DELEGATE_TABLE.TOOLTIP.SELECTED_DELEGATE")}
							disabled={!!getTotalVotes()}
						>
							<span>
								<Button
									disabled={!getTotalVotes()}
									onClick={() => onContinue?.(selectedUnvotes, selectedVotes)}
									data-testid="DelegateTable__continue-button"
								>
									{t("COMMON.CONTINUE")}
								</Button>
							</span>
						</Tooltip>
					</div>
				</div>
			</div>
		</div>
	);
};

DelegateTable.defaultProps = {
	delegates: [],
	votes: [],
	isLoading: false,
	itemsPerPage: 51,
	emptyText: "Delegates not found",
};
