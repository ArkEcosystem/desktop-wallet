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
	selected?: Delegate[];
	isVoted?: boolean;
	isLoading?: boolean;
	onSelect?: ({ address, username, rank }: Delegate) => void;
};

export const DelegateRow = ({ index, delegate, selected, isVoted, isLoading, onSelect }: DelegateRowProps) => {
	const { t } = useTranslation();

	const isSelected = useMemo(
		() => isVoted || !!selected?.find((selectedDelegate) => selectedDelegate.username === delegate.username()),
		[delegate, isVoted, selected],
	);

	if (isLoading) {
		return <DelegateRowSkeleton />;
	}

	return (
		<tr className="transition-colors duration-100 border-b border-dashed border-theme-neutral-200 group">
			<TableCell variant="start" isSelected={isSelected} innerClassName="font-bold">
				<div className="flex items-center space-x-3">
					<Avatar address={delegate.address()} size="lg" noShadow />
					<span>{delegate.username()}</span>
				</div>
			</TableCell>

			<TableCell isSelected={isSelected} innerClassName="font-bold text-theme-neutral-dark">
				<span>#{delegate.rank()}</span>
			</TableCell>

			<TableCell isSelected={isSelected} innerClassName="font-bold text-theme-neutral-dark">
				<span>%</span>
			</TableCell>

			<TableCell isSelected={isSelected} innerClassName="justify-center">
				<Icon name="Msq" className="text-xl text-theme-primary" />
			</TableCell>

			<TableCell isSelected={isSelected} innerClassName="font-bold text-theme-neutral-dark">
				<span>...</span>
			</TableCell>

			<TableCell isSelected={isSelected} innerClassName="font-bold text-theme-neutral-dark">
				<span>...</span>
			</TableCell>

			<TableCell isSelected={isSelected} innerClassName="font-bold text-theme-neutral-dark">
				<span>...</span>
			</TableCell>

			<TableCell isSelected={isSelected} innerClassName="font-bold text-theme-neutral-dark">
				<span>...</span>
			</TableCell>

			<TableCell isSelected={isSelected} variant="end" innerClassName="justify-end">
				{isVoted ? (
					<Button
						variant="plain"
						color={isSelected ? "primary" : "danger"}
						onClick={() =>
							onSelect?.({
								address: delegate.address(),
								username: delegate.username()!,
								rank: delegate.rank()!,
							})
						}
						data-testid={`DelegateRow__toggle-${index}`}
					>
						{isSelected ? t("COMMON.CURRENT") : t("COMMON.UNSELECTED")}
					</Button>
				) : (
					<Button
						variant="plain"
						color={isSelected ? "danger" : "primary"}
						onClick={() =>
							onSelect?.({
								address: delegate.address(),
								username: delegate.username()!,
								rank: delegate.rank()!,
							})
						}
						data-testid={`DelegateRow__toggle-${index}`}
					>
						{isSelected ? t("COMMON.SELECTED") : t("COMMON.NOT_SELECTED")}
					</Button>
				)}
			</TableCell>
		</tr>
	);
};

DelegateRow.defaultProps = {
	selected: [],
	isVoted: false,
	isLoading: false,
};
