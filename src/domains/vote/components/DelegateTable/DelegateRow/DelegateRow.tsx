import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { TableCell } from "app/components/Table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { DelegateRowSkeleton } from "./DelegateRowSkeleton";

type Delegate = { address: string; username: string; rank: number };

type DelegateRowProps = {
	index: number;
	delegate: ReadOnlyWallet;
	unvotesSelected?: Delegate[];
	votesSelected?: Delegate[];
	isVoted?: boolean;
	isLoading?: boolean;
	onUnvoteSelect?: ({ address, username, rank }: Delegate) => void;
	onVotesSelect?: ({ address, username, rank }: Delegate) => void;
};

export const DelegateRow = ({
	index,
	delegate,
	unvotesSelected,
	votesSelected,
	isVoted,
	isLoading,
	onUnvoteSelect,
	onVotesSelect,
}: DelegateRowProps) => {
	const { t } = useTranslation();

	const isUnvoteSelected = useMemo(
		() => !!unvotesSelected?.find((selectedDelegate) => selectedDelegate.username === delegate.username()),
		[delegate, unvotesSelected],
	);

	const isVoteSelected = useMemo(
		() => isVoted || !!votesSelected?.find((selectedDelegate) => selectedDelegate.username === delegate.username()),
		[delegate, isVoted, votesSelected],
	);

	if (isLoading) {
		return <DelegateRowSkeleton />;
	}

	return (
		<tr className="transition-colors duration-100 border-b border-dashed border-theme-neutral-200 group">
			<TableCell variant="start" isSelected={isVoteSelected} innerClassName="font-bold">
				<div className="flex items-center space-x-3">
					<Avatar address={delegate.address()} size="lg" noShadow />
					<span>{delegate.username()}</span>
				</div>
			</TableCell>

			<TableCell isSelected={isVoteSelected} innerClassName="font-bold text-theme-neutral-dark">
				<span>#{delegate.rank()}</span>
			</TableCell>

			<TableCell isSelected={isVoteSelected} innerClassName="font-bold text-theme-neutral-dark">
				<span>%</span>
			</TableCell>

			<TableCell isSelected={isVoteSelected} innerClassName="justify-center">
				<Icon name="Msq" className="text-xl text-theme-primary" />
			</TableCell>

			<TableCell isSelected={isVoteSelected} innerClassName="font-bold text-theme-neutral-dark">
				<span>...</span>
			</TableCell>

			<TableCell isSelected={isVoteSelected} innerClassName="font-bold text-theme-neutral-dark">
				<span>...</span>
			</TableCell>

			<TableCell isSelected={isVoteSelected} innerClassName="font-bold text-theme-neutral-dark">
				<span>...</span>
			</TableCell>

			<TableCell isSelected={isVoteSelected} innerClassName="font-bold text-theme-neutral-dark">
				<span>...</span>
			</TableCell>

			<TableCell isSelected={isVoteSelected} variant="end" innerClassName="justify-end">
				{isVoted ? (
					<Button
						variant="plain"
						color={!isUnvoteSelected ? "primary" : "danger"}
						onClick={() =>
							onUnvoteSelect?.({
								address: delegate.address(),
								username: delegate.username()!,
								rank: delegate.rank()!,
							})
						}
						data-testid={`DelegateRow__toggle-${index}`}
					>
						{!isUnvoteSelected ? t("COMMON.CURRENT") : t("COMMON.UNSELECTED")}
					</Button>
				) : (
					<Button
						variant="plain"
						color={isVoteSelected ? "danger" : "primary"}
						onClick={() =>
							onVotesSelect?.({
								address: delegate.address(),
								username: delegate.username()!,
								rank: delegate.rank()!,
							})
						}
						data-testid={`DelegateRow__toggle-${index}`}
					>
						{isVoteSelected ? t("COMMON.SELECTED") : t("COMMON.NOT_SELECTED")}
					</Button>
				)}
			</TableCell>
		</tr>
	);
};

DelegateRow.defaultProps = {
	unvotesSelected: [],
	votesSelected: [],
	isVoted: false,
	isLoading: false,
};
