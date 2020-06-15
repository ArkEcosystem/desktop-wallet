import React from "react";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Address } from "app/components/Address";
import { Label } from "app/components/Label";

type TransactionListItemProps = {
	date: string;
	avatarId: string;
	type: string;
	address?: string;
	walletName?: string;
	amount: string;
	fiat: string;
};

export const TransactionListItem = ({
	date,
	avatarId,
	type,
	address,
	walletName,
	amount,
	fiat,
}: TransactionListItemProps) => {
	const iconName: any = {
		send: "Sent",
		receive: "Received",
	};

	const iconClasses: any = {
		send: "border-theme-danger-200 text-theme-danger-400",
		receive: "border-theme-success-300 text-theme-success-400",
	};

	const amountLabelColor: any = {
		send: "danger",
		receive: "success",
	};

	return (
		<tr className="border-b border-theme-neutral-200">
			<td className="w-48 py-1 text-sm text-theme-neutral-600"> {date} </td>
			<td className="w-32 py-4 mt-1">
				<Circle className={`${iconClasses[type]} -mr-1`}>
					<Icon name={iconName[type]} width={40} height={40}></Icon>
				</Circle>
				<Circle avatarId={avatarId}></Circle>
			</td>
			<td className="w-56 py-1">
				<Address walletName={walletName} address={address} maxChars={24} size="small"></Address>
			</td>
			<td className="py-1 text-sm text-right">
				<Label color={amountLabelColor[type]} size="small">
					{amount}
				</Label>
			</td>
			<td className="w-32 py-1 text-sm text-right text-theme-neutral-500">
				<div>{fiat}</div>
			</td>
		</tr>
	);
};

TransactionListItem.defaultProps = {
	walletTypeIcons: [],
	actions: [],
};
