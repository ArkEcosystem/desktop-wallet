import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { TableCell, TableRow } from "app/components/Table";
import { Tooltip } from "app/components/Tooltip";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

type DelegateRowProps = {
	index: number;
	delegate: ReadOnlyWallet;
	selectedUnvotes?: string[];
	selectedVotes?: string[];
	isVoted?: boolean;
	isVoteDisabled?: boolean;
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

	return (
		<TableRow>
			<TableCell variant="start" innerClassName={`space-x-4 font-bold ${getColorSelected()}`}>
				<Avatar size="lg" address={delegate.address()} noShadow />
				<span>{delegate.username()}</span>
			</TableCell>

			<TableCell className="w-20" innerClassName={`justify-center ${getColorSelected()}`}>
				{isVoted && (
					<Icon
						name="StatusOk"
						className={`text-xs ${!isSelectedUnvote ? "text-theme-primary" : "text-theme-danger"}`}
						width={22}
						height={22}
					/>
				)}
			</TableCell>

			<TableCell
				className="w-20"
				innerClassName={`justify-center font-bold text-theme-secondary-text ${getColorSelected()}`}
			>
				<span>#{delegate.rank()}</span>
			</TableCell>

			<TableCell
				className="w-20"
				innerClassName={`justify-center font-bold text-theme-secondary-text ${getColorSelected()}`}
			>
				<span>%</span>
			</TableCell>

			<TableCell className="w-20" innerClassName={`justify-center ${getColorSelected()}`}>
				<Icon name="Msq" className="text-xl text-theme-primary" />
			</TableCell>

			<TableCell
				className="w-20"
				innerClassName={`justify-center font-bold text-theme-secondary-text ${getColorSelected()}`}
			>
				<span>...</span>
			</TableCell>

			<TableCell
				className="w-20"
				innerClassName={`justify-center font-bold text-theme-secondary-text ${getColorSelected()}`}
			>
				<span>...</span>
			</TableCell>

			<TableCell
				className="w-20"
				innerClassName={`justify-center font-bold text-theme-secondary-text ${getColorSelected()}`}
			>
				<span>...</span>
			</TableCell>

			<TableCell
				className="w-40"
				innerClassName={`justify-end font-bold text-theme-secondary-text ${getColorSelected()}`}
			>
				<span>...</span>
			</TableCell>

			<TableCell variant="end" className="w-40" innerClassName={`justify-end ${getColorSelected()}`}>
				{isVoted ? (
					<Button
						variant="plain"
						color={!isSelectedUnvote ? "primary" : "danger"}
						onClick={() => onUnvoteSelect?.(delegate.address())}
						data-testid={`DelegateRow__toggle-${index}`}
					>
						{!isSelectedUnvote ? t("COMMON.CURRENT") : t("COMMON.UNSELECTED")}
					</Button>
				) : (
					// Add `<span>` wrapper to show the tooltip when the button is disabled.
					// https://github.com/atomiks/Tooltipjs-react/issues/123#issuecomment-535148835
					<Tooltip
						content={t("VOTE.DELEGATE_TABLE.TOOLTIP_TEXT")}
						disabled={isSelectedVote || !isVoteDisabled}
					>
						{!isSelectedVote && isVoteDisabled ? (
							<span>
								<Button
									variant="plain"
									color="primary"
									disabled
									data-testid={`DelegateRow__toggle-${index}`}
								>
									{t("COMMON.NOT_SELECTED")}
								</Button>
							</span>
						) : (
							<Button
								variant="plain"
								color={isSelectedVote ? "success" : "primary"}
								onClick={() => onVoteSelect?.(delegate.address())}
								data-testid={`DelegateRow__toggle-${index}`}
							>
								{isSelectedVote ? t("COMMON.SELECTED") : t("COMMON.NOT_SELECTED")}
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
};
