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
			<td className="py-1 w-40 text-theme-neutral-600 text-sm"> {date} </td>
			<td className="py-4 mt-1 w-24">
				<Circle className={`${iconClasses[type]} -mr-1`}>
					<Icon name={iconName[type]} width={40} height={40}></Icon>
				</Circle>
				<Circle avatarId={avatarId}></Circle>
			</td>
			<td className="py-1 w-56">
				<Address walletName={walletName} address={address}></Address>
			</td>
			<td className="py-1 text-right text-sm">
				<Label color={amountLabelColor[type]} size="small">
					{amount}
				</Label>
			</td>
			<td className="py-1 text-right text-sm text-theme-neutral-500 w-32">
				<div>{fiat}</div>
			</td>
		</tr>
	);
};

TransactionListItem.defaultProps = {
	walletTypeIcons: [],
	actions: [],
};
