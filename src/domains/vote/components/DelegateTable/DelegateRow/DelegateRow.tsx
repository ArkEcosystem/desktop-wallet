import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { TableCell, TableRow } from "app/components/Table";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { DelegateRowSkeleton } from "./DelegateRowSkeleton";

type Delegate = { address: string; username: string; rank: number };

type DelegateRowProps = {
	index: number;
	delegate: ReadOnlyWallet;
	selected?: Delegate[];
	isLoading?: boolean;
	onSelect?: ({ address, username, rank }: Delegate) => void;
};

export const DelegateRow = ({ index, delegate, selected, isLoading, onSelect }: DelegateRowProps) => {
	const isSelected = useMemo(
		() =>
			!!selected?.find((selectedDelegate: Delegate) => selectedDelegate.username === delegate.username()) ||
			false,
		[selected, delegate],
	);

	const { t } = useTranslation();

	if (isLoading) {
		return <DelegateRowSkeleton />;
	}

	return (
		<TableRow>
			<TableCell variant="start" className="w-1">
				<Avatar className="mr-4" size="lg" address={delegate.address()} noShadow />
			</TableCell>

			<TableCell isSelected={isSelected} innerClassName="font-bold">
				<span>{delegate.username()}</span>
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
					{isSelected ? t("COMMON.UNSELECT") : t("COMMON.SELECT")}
				</Button>
			</TableCell>
		</TableRow>
	);
};

DelegateRow.defaultProps = {
	selected: [],
	isLoading: false,
};
