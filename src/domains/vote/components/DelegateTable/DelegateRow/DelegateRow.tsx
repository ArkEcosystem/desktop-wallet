import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { TableCell, TableRow } from "app/components/Table";
import { Tooltip } from "app/components/Tooltip";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { DelegateRowSkeleton } from "./DelegateRowSkeleton";

type DelegateRowProps = {
	index: number;
	delegate: ReadOnlyWallet;
	selectedUnvotes?: string[];
	selectedVotes?: string[];
	isVoted?: boolean;
	isVoteDisabled?: boolean;
	isLoading?: boolean;
	onUnvoteSelect?: (address: string) => void;
	onVoteSelect?: (address: string) => void;
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
		() => !!selectedUnvotes?.find((delegateAddress) => delegateAddress === delegate.address()),
		[delegate, selectedUnvotes],
	);

	const isSelectedVote = useMemo(
		() => isVoted || !!selectedVotes?.find((delegateAddress) => delegateAddress === delegate.address()),
		[delegate, isVoted, selectedVotes],
	);

	const getColorSelected = (): string => {
		if (isVoted) {
			if (!isSelectedUnvote) {
				return "bg-theme-primary-50 dark:bg-theme-primary-900";
			} else {
				return "bg-theme-danger-50 dark:bg-theme-danger-900";
			}
		} else {
			if (isSelectedVote) {
				return "bg-theme-success-50 dark:bg-theme-success-900";
			} else {
				return "";
			}
		}
	};

	if (isLoading) {
		return <DelegateRowSkeleton />;
	}

	return (
		<TableRow>
			<TableCell
				variant="start"
				className="w-20"
				innerClassName={`justify-start font-bold text-theme-secondary-text ${getColorSelected()}`}
			>
				<span>#{delegate.rank()}</span>
			</TableCell>

			<TableCell innerClassName={`space-x-4 font-bold ${getColorSelected()}`}>
				<Avatar size="lg" address={delegate.address()} noShadow />
				<span>{delegate.username()}</span>
			</TableCell>

			<TableCell className="w-20" innerClassName={`justify-center ${getColorSelected()}`}>
				{isVoted && (
					<Icon
						name="StatusOk"
						className={`text-xs ${!isSelectedUnvote ? "text-theme-primary-600" : "text-theme-danger-500"}`}
						width={22}
						height={22}
					/>
				)}
			</TableCell>

			<TableCell
				className="w-20"
				innerClassName={`justify-center font-bold text-theme-secondary-text ${getColorSelected()}`}
			>
				<span>%</span>
			</TableCell>

			<TableCell variant="end" className="w-40" innerClassName={`justify-end ${getColorSelected()}`}>
				{isVoted ? (
					<Button
						variant="secondary"
						color={!isSelectedUnvote ? "primary" : "danger"}
						onClick={() => onUnvoteSelect?.(delegate.address())}
						data-testid={`DelegateRow__toggle-${index}`}
					>
						{!isSelectedUnvote ? t("COMMON.CURRENT") : t("COMMON.UNSELECTED")}
					</Button>
				) : (
					<Tooltip
						content={t("VOTE.DELEGATE_TABLE.TOOLTIP.VOTE_ONE_DELEGATE")}
						disabled={isSelectedVote || !isVoteDisabled}
					>
						{!isSelectedVote && isVoteDisabled ? (
							<span>
								<Button
									variant="secondary"
									color="primary"
									disabled
									data-testid={`DelegateRow__toggle-${index}`}
								>
									{t("COMMON.SELECT")}
								</Button>
							</span>
						) : (
							<Button
								variant="secondary"
								color={isSelectedVote ? "success" : "primary"}
								onClick={() => onVoteSelect?.(delegate.address())}
								data-testid={`DelegateRow__toggle-${index}`}
							>
								{isSelectedVote ? t("COMMON.SELECTED") : t("COMMON.SELECT")}
							</Button>
						)}
					</Tooltip>
				)}
			</TableCell>
		</TableRow>
	);
};

DelegateRow.defaultProps = {
	selectedUnvotes: [],
	selectedVotes: [],
	isVoted: false,
	isVoteDisabled: false,
	isLoading: false,
};
