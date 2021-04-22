import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { EmptyResults } from "app/components/EmptyResults";
import { Icon } from "app/components/Icon";
import { Pagination } from "app/components/Pagination";
import { Table } from "app/components/Table";
import { Tooltip } from "app/components/Tooltip";
import cn from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import tw, { styled } from "twin.macro";

import { DelegateRow } from "./DelegateRow";

const Footer = styled.div`
	${tw`fixed bottom-0 inset-x-0 py-8 shadow-footer-smooth dark:shadow-footer-smooth-dark bg-theme-background`}
`;

type DelegateTableProps = {
	delegates: Contracts.IReadOnlyWallet[];
	emptyText?: string;
	isLoading?: boolean;
	itemsPerPage?: number;
	maxVotes: number;
	selectedUnvoteAddresses?: string[];
	selectedVoteAddresses?: string[];
	selectedWallet: string;
	votes?: Contracts.IReadOnlyWallet[];
	onContinue?: (unvotes: string[], votes: string[]) => void;
	isPaginationDisabled?: boolean;
	subtitle?: React.ReactNode;
};

export const DelegateTable = ({
	delegates,
	isLoading,
	itemsPerPage,
	maxVotes,
	selectedUnvoteAddresses,
	selectedVoteAddresses,
	selectedWallet,
	votes,
	onContinue,
	isPaginationDisabled,
	subtitle,
}: DelegateTableProps) => {
	const { t } = useTranslation();
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedUnvotes, setSelectedUnvotes] = useState<string[]>(selectedUnvoteAddresses || []);
	const [selectedVotes, setSelectedVotes] = useState<string[]>(selectedVoteAddresses || []);
	const [isVoteDisabled, setIsVoteDisabled] = useState(false);

	const columns = [
		{
			Header: t("COMMON.RANK"),
			accessor: (delegate: Contracts.IReadOnlyWallet) => isLoading || delegate.rank(),
			className: "justify-start",
			minimumWidth: true,
		},
		{
			Header: t("VOTE.DELEGATE_TABLE.NAME"),
			accessor: (delegate: Contracts.IReadOnlyWallet) => isLoading || delegate.username(),
			className: "no-border",
		},
		{
			Header: "Actions",
			accessor: "onSelect",
			className: "hidden",
			disableSortBy: true,
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

	useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [currentPage]);

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

	const paginator = (items: Contracts.IReadOnlyWallet[], currentPage: number, itemsPerPage: number) => {
		if (isPaginationDisabled) {
			return items;
		}

		const offset = (currentPage - 1) * itemsPerPage;
		const paginatedItems = items.slice(offset).slice(0, itemsPerPage);

		return paginatedItems;
	};

	const showSkeleton = useMemo(() => totalDelegates === 0 && isLoading, [totalDelegates, isLoading]);
	const skeletonList = new Array(8).fill({});
	const data = showSkeleton ? skeletonList : paginator(delegates, currentPage, itemsPerPage!);

	if (!isLoading && totalDelegates === 0) {
		return (
			<EmptyResults
				className="mt-16"
				title={t("COMMON.EMPTY_RESULTS.TITLE")}
				subtitle={t("VOTE.VOTES_PAGE.NO_RESULTS")}
			/>
		);
	}

	return (
		<div data-testid="DelegateTable">
			<h2 className="mb-6 text-2xl font-bold">{t("VOTE.DELEGATE_TABLE.TITLE")}</h2>

			{subtitle && subtitle}

			<Table columns={columns} data={data}>
				{(delegate: Contracts.IReadOnlyWallet, index: number) => {
					let isVoted = false;

					if (hasVotes) {
						isVoted = !!votes?.find((vote) => vote.address() === delegate?.address?.());
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

			<div className="flex justify-center w-full mt-8">
				{totalDelegates > itemsPerPage! && !isPaginationDisabled && (
					<Pagination
						totalCount={totalDelegates}
						itemsPerPage={itemsPerPage}
						currentPage={currentPage}
						onSelectPage={handleSelectPage}
					/>
				)}
			</div>

			<Footer data-testid="DelegateTable__footer">
				<div className="container px-10 mx-auto">
					<div className="flex font-semibold h-11">
						<div className="flex pr-8 border-r border-theme-secondary-300 dark:border-theme-secondary-800">
							<Avatar className="mr-2" size="lg" address={selectedWallet} noShadow />
							<div className="flex flex-col space-y-2">
								<div className="text-sm leading-tight text-theme-secondary-500">
									{t("COMMON.ADDRESS")}
								</div>
								<Address
									address={selectedWallet}
									addressClass="leading-tight"
									size="lg"
									maxChars={24}
								/>
							</div>
						</div>

						<div className="flex px-8 border-r border-theme-secondary-300 dark:border-theme-secondary-800">
							<Circle
								className={cn(
									"mr-2 bg-theme-background",
									selectedVotes.length === 0
										? "border-theme-secondary-500 text-theme-secondary-500"
										: "border-theme-text text-theme-text",
								)}
								size="lg"
							>
								<Icon name="Vote" className="text-xl" />
							</Circle>
							<div className="flex flex-col space-y-2">
								<div className="text-sm leading-tight text-theme-secondary-500">
									{t("VOTE.DELEGATE_TABLE.VOTES")}
								</div>
								<div
									className={cn(
										"text-lg leading-tight",
										selectedVotes.length ? "text-theme-text" : "text-theme-secondary-500",
									)}
									data-testid="DelegateTable__footer--votes"
								>
									{selectedVotes.length}
								</div>
							</div>
						</div>

						<div className="flex px-8 border-r border-theme-secondary-300 dark:border-theme-secondary-800">
							<Circle
								className={cn(
									"mr-2 bg-theme-background",
									selectedUnvotes.length === 0
										? "border-theme-secondary-500 text-theme-secondary-500"
										: "border-theme-text text-theme-text",
								)}
								size="lg"
							>
								<Icon name="Unvote" className="text-xl" />
							</Circle>
							<div className="flex flex-col space-y-2">
								<div className="text-sm leading-tight text-theme-secondary-500">
									{t("VOTE.DELEGATE_TABLE.UNVOTES")}
								</div>
								<div
									className={cn(
										"text-lg leading-tight",
										selectedUnvotes.length ? "text-theme-text" : "text-theme-secondary-500",
									)}
									data-testid="DelegateTable__footer--unvotes"
								>
									{selectedUnvotes.length}
								</div>
							</div>
						</div>

						<div className="flex px-8">
							<Circle className="mr-2 bg-theme-background border-theme-text text-theme-text" size="lg">
								<Icon name="VoteCombination" className="text-xl" />
							</Circle>
							<div className="flex flex-col space-y-2">
								<div className="text-sm leading-tight text-theme-secondary-500">
									{t("VOTE.DELEGATE_TABLE.TOTAL")}
								</div>
								<div
									className="text-lg leading-tight text-theme-text"
									data-testid="DelegateTable__footer--total"
								>
									{getTotalVotes()}/{maxVotes}
								</div>
							</div>
						</div>

						<Tooltip
							content={t("VOTE.DELEGATE_TABLE.TOOLTIP.SELECTED_DELEGATE")}
							disabled={!!getTotalVotes()}
						>
							<span>
								<Button
									className="ml-auto"
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
			</Footer>
		</div>
	);
};

DelegateTable.defaultProps = {
	delegates: [],
	votes: [],
	isLoading: false,
	itemsPerPage: 51,
};
