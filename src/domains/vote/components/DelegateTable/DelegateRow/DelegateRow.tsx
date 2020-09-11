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
	selectedUnvotes?: Delegate[];
	selectedVotes?: Delegate[];
	isVoted?: boolean;
	isVoteDisabled?: boolean;
	isLoading?: boolean;
	onUnvoteSelect?: ({ address, username, rank }: Delegate) => void;
	onVoteSelect?: ({ address, username, rank }: Delegate) => void;
};

export const DelegateRow = ({
	index,
	delegate,
	selectedUnvotes,
	selectedVotes,
	isVoted,
	isVoteDisabled,
	isLoading,
	onUnvoteSelect,
	onVoteSelect,
}: DelegateRowProps) => {
	const { t } = useTranslation();

	const isSelectedUnvote = useMemo(
		() => !!selectedUnvotes?.find((selected) => selected.username === delegate.username()),
		[delegate, selectedUnvotes],
	);

	const isSelectedVote = useMemo(
		() => isVoted || !!selectedVotes?.find((selected) => selected.username === delegate.username()),
		[delegate, isVoted, selectedVotes],
	);

	if (isLoading) {
		return <DelegateRowSkeleton />;
	}

	const getColorSelected = (): string => {
		if (isVoted) {
			if (!isSelectedUnvote) {
				return "bg-theme-primary-50";
			} else {
				return "bg-theme-danger-50";
			}
		} else {
			if (isSelectedVote) {
				return "bg-theme-success-50";
			} else {
				return "";
			}
		}
	};

	return (
		<tr className="transition-colors duration-100 border-b border-dashed border-theme-neutral-200 group">
			<TableCell variant="start" innerClassName={`font-bold ${getColorSelected()}`}>
				<div className="flex items-center space-x-3">
					<Avatar address={delegate.address()} size="lg" noShadow />
					<span>{delegate.username()}</span>
				</div>
			</TableCell>

			<TableCell innerClassName={`font-bold text-theme-neutral-dark ${getColorSelected()}`}>
				<span>#{delegate.rank()}</span>
			</TableCell>

			<TableCell innerClassName={`font-bold text-theme-neutral-dark ${getColorSelected()}`}>
				<span>%</span>
			</TableCell>

			<TableCell innerClassName={`justify-center ${getColorSelected()}`}>
				<Icon name="Msq" className="text-xl text-theme-primary" />
			</TableCell>

			<TableCell innerClassName={`font-bold text-theme-neutral-dark ${getColorSelected()}`}>
				<span>...</span>
			</TableCell>

			<TableCell innerClassName={`font-bold text-theme-neutral-dark ${getColorSelected()}`}>
				<span>...</span>
			</TableCell>

			<TableCell innerClassName={`font-bold text-theme-neutral-dark ${getColorSelected()}`}>
				<span>...</span>
			</TableCell>

			<TableCell innerClassName={`font-bold text-theme-neutral-dark ${getColorSelected()}`}>
				<span>...</span>
			</TableCell>

			<TableCell variant="end" innerClassName={`justify-end ${getColorSelected()}`}>
				{isVoted ? (
					<Button
						variant="plain"
						color={!isSelectedUnvote ? "primary" : "danger"}
						onClick={() =>
							onUnvoteSelect?.({
								address: delegate.address(),
								username: delegate.username()!,
								rank: delegate.rank()!,
							})
						}
						data-testid={`DelegateRow__toggle-${index}`}
					>
						{!isSelectedUnvote ? t("COMMON.CURRENT") : t("COMMON.UNSELECTED")}
					</Button>
				) : (
					<Button
						variant="plain"
						color={isSelectedVote ? "success" : "primary"}
						disabled={isVoteDisabled}
						onClick={() =>
							onVoteSelect?.({
								address: delegate.address(),
								username: delegate.username()!,
								rank: delegate.rank()!,
							})
						}
						data-testid={`DelegateRow__toggle-${index}`}
					>
						{isSelectedVote ? t("COMMON.SELECTED") : t("COMMON.NOT_SELECTED")}
					</Button>
				)}
			</TableCell>
		</tr>
	);
};

DelegateRow.defaultProps = {
	selectedUnvotes: [],
	selectedVotes: [],
	isVoted: false,
	isVoteDisabled: false,
	isLoading: false,
};
