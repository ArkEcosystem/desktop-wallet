import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

type DelegateListItemProps = {
	delegateAddress?: string;
	delegateName?: string;
	rank?: number;
	votes?: number;
	msqUrl?: string;
	commissionPercentage?: number;
	commissionDaily?: number;
	payout?: string;
	min?: number;
	onSelect?: (delegateAddress: string) => void;
};

export const DelegateListItem = ({
	delegateAddress,
	delegateName,
	rank,
	votes,
	msqUrl,
	commissionPercentage,
	commissionDaily,
	payout,
	min,
	onSelect,
}: DelegateListItemProps) => {
	const { t } = useTranslation();

	return (
		<tr className="border-b border-theme-neutral-200">
			<td className="py-5">
				<Avatar address={delegateAddress!} />
			</td>

			<td className="py-5 font-bold">{delegateName}</td>

			<td className="py-5 font-bold text-theme-neutral-dark">#{rank}</td>

			<td className="py-5 font-bold text-theme-neutral-dark">{votes}%</td>

			<td className="py-5">
				{msqUrl && (
					<div className="flex justify-center h-full">
						<a href={msqUrl} target="_blank" rel="noreferrer">
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
			</td>

			<td className="py-5">
				<div className="text-right">
					<Button
						variant="plain"
						onClick={() => onSelect?.(delegateAddress!)}
						data-testid="DelegateListItem__button--select"
					>
						{t("COMMON.SELECT")}
					</Button>
				</div>
			</td>
		</tr>
	);
};
