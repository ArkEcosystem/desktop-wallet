import { Contracts } from "@arkecosystem/platform-sdk";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import React from "react";
import { useTranslation } from "react-i18next";

import { DelegateListItemSkeleton } from "./DelegateListItemSkeleton";

type DelegateListItemProps = {
	index: number;
	delegate: Contracts.WalletData;
	selected?: any[];
	isLoading?: boolean;
	onSelect?: ({ address, username, rank }: { address: string; username: string; rank: number }) => void;
};

export const DelegateListItem = ({ index, delegate, selected, isLoading, onSelect }: DelegateListItemProps) => {
	const { t } = useTranslation();
	const isSelected =
		selected?.find((selectedDelegate: any) => selectedDelegate.username === delegate.username()) || false;

	if (isLoading) {
		return <DelegateListItemSkeleton />;
	}

	return (
		<tr className={`border-b border-dotted border-theme-neutral-300 ${isSelected && "bg-theme-success-contrast"}`}>
			<td className="py-5">
				<Avatar address={delegate.address()} noShadow />
			</td>

			<td className="py-5 font-bold">{delegate.username()}</td>

			<td className="py-5 font-bold text-theme-neutral-dark">#{delegate.rank()}</td>

			<td className="py-5 font-bold text-theme-neutral-dark">%</td>

			{/* <td className="py-5">
				{msqUrl && (
					<div className="flex justify-center h-full">
						<a href={msqUrl} target="_blank" rel="noopener noreferrer">
							<Icon name="Msq" className="text-xl text-theme-primary" />
						</a>
					</div>
				)}
			</td>

			<td className="py-5 font-bold text-theme-neutral-dark">
				{commissionPercentage && <span>{commissionPercentage}%</span>}
			</td>

			<td className="py-5 font-bold text-theme-neutral-dark">{payout && <span>{payout}</span>}</td>

			<td className="py-5 font-bold text-theme-neutral-dark">{min && <span>{min} Ѧ</span>}</td>

			<td className="py-5 font-bold text-theme-neutral-dark">
				{commissionDaily && <span>{commissionDaily} Ѧ</span>}
			</td> */}

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
						data-testid={`DelegateListItem__toggle-${index}`}
					>
						{isSelected ? t("COMMON.UNSELECT") : t("COMMON.SELECT")}
					</Button>
				</div>
			</td>
		</tr>
	);
};

DelegateListItem.defaultProps = {
	selected: [],
	isLoading: false,
};
