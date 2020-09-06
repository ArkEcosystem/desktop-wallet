import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import React from "react";
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
	const { t } = useTranslation();
	const isSelected =
		selected?.find((selectedDelegate: Delegate) => selectedDelegate.username === delegate.username()) || false;

	if (isLoading) {
		return <DelegateRowSkeleton />;
	}

	return (
		<tr
			className={`transition-colors duration-100 border-b border-dashed border-theme-neutral-200 ${
				isSelected && "bg-theme-success-100"
			}`}
		>
			<td className="h-px p-0">
				<div
					className={`rounded-l-lg h-full -ml-8 transition-colors duration-100 ${
						isSelected && "bg-theme-success-100"
					}`}
				/>
			</td>

			<td className="py-5 font-bold">
				<div className="flex items-center space-x-3">
					<Avatar address={delegate.address()} size="lg" noShadow />
					<span>{delegate.username()}</span>
				</div>
			</td>

			<td className="py-5 font-bold text-theme-neutral-dark">#{delegate.rank()}</td>

			<td className="py-5 font-bold text-theme-neutral-dark">%</td>

			<td className="py-5">
				<div className="flex justify-center h-full">
					<Icon name="Msq" className="text-xl text-theme-primary" />
				</div>
			</td>

			<td className="py-5 font-bold text-theme-neutral-dark" />

			<td className="py-5 font-bold text-theme-neutral-dark" />

			<td className="py-5 font-bold text-theme-neutral-dark" />

			<td className="py-5 font-bold text-theme-neutral-dark" />

			<td className="py-5">
				<div className="text-right">
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
				</div>
			</td>

			<td className="h-px p-0">
				<div
					className={`rounded-r-lg h-full -mr-8 transition-colors duration-100 ${
						isSelected && "bg-theme-success-100"
					}`}
				/>
			</td>
		</tr>
	);
};

DelegateRow.defaultProps = {
	selected: [],
	isLoading: false,
};
