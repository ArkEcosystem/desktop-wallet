import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Avatar } from "domains/wallet/components/Avatar";
import React from "react";
import { useTranslation } from "react-i18next";

type AddressListItemProps = {
	walletAddress?: string;
	walletName?: string;
	type?: string | null;
	balance?: string;
	delegateAddress?: string;
	delegateName?: string;
	rank?: number;
	msqUrl?: string | null;
	isActive?: boolean;
	onSelect?: (walletAddress: string) => void;
};

export const AddressListItem = ({
	walletAddress,
	walletName,
	type,
	balance,
	delegateAddress,
	delegateName,
	rank,
	msqUrl,
	isActive,
	onSelect,
}: AddressListItemProps) => {
	const { t } = useTranslation();

	return (
		<tr className="border-b border-theme-neutral-200">
			<td className="py-4">
				<Avatar address={walletAddress!} />
			</td>

			<td className="py-4">
				<Address walletName={walletName} address={walletAddress} maxChars={22} />
			</td>

			<td className="w-20 py-4">
				{type && (
					<div className="flex justify-center h-full">
						<Icon name={type} className="text-theme-neutral-600" />
					</div>
				)}
			</td>

			<td className="py-4 font-bold text-theme-neutral-dark">{balance}</td>

			<td className="py-4">
				<Avatar address={delegateAddress!} />
			</td>

			<td className="py-4 font-bold">{delegateName}</td>

			<td className="py-4 font-bold text-theme-neutral-dark">#{rank}</td>

			<td className="py-4">
				{msqUrl && (
					<div className="flex justify-center h-full">
						<a href={msqUrl} target="_blank" rel="noreferrer">
							<Icon name="Msq" className="text-xl text-theme-primary" />
						</a>
					</div>
				)}
			</td>

			<td className="py-4">
				{isActive && (
					<div className="flex justify-center h-full">
						<Icon name="Ok" className="text-theme-success" />
					</div>
				)}
			</td>

			<td className="py-4">
				<div className="text-right">
					<Button
						variant="plain"
						onClick={() => onSelect?.(walletAddress!)}
						data-testid="AddressListItem__button--unvote"
					>
						{t("COMMON.SELECT")}
					</Button>
				</div>
			</td>
		</tr>
	);
};
