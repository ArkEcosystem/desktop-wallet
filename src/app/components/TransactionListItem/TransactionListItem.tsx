import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import React from "react";

import { TransactionListItemProps } from "./models";

export const TransactionListItem = ({
	date,
	type,
	address,
	walletName,
	amount,
	fiat,
	variant,
	onClick,
	transactionInfoIcons,
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

	const onTxClick = () => {
		if (typeof onClick === "function") onClick();
	};

	if (variant === "compact") {
		return (
			<tr
				onClick={onTxClick}
				className="border-b cursor-pointer border-theme-neutral-200"
				data-testid="transaction__row"
			>
				<td className="w-20 py-4 mt-1">
					<div className="flex">
						<Circle size="sm" className={`${iconClasses[type]} -mr-1`}>
							<Icon name={iconName[type]} width={40} height={40} />
						</Circle>
						<Avatar size="sm" address={address as string} />
					</div>
				</td>
				<td className="w-56 py-1">
					<Address walletName={walletName} address={address} maxChars={16} size="sm" />
				</td>
				<td className="py-1 text-sm text-right">
					<Label color={amountLabelColor[type]} size="sm">
						{amount}
					</Label>
				</td>
			</tr>
		);
	}

	return (
		<tr
			onClick={onTxClick}
			className="border-b border-dotted cursor-pointer border-theme-neutral-300"
			data-testid="transaction__row"
		>
			<td className="w-48 py-1 text-sm text-theme-neutral-600"> {date} </td>
			<td className="w-32 py-5 mt-1">
				<div className="flex">
					<Circle className={`${iconClasses[type]} -mr-1`} size="lg">
						<Icon name={iconName[type]} width={40} height={40} />
					</Circle>
					<Avatar size="lg" address={address as string} />
				</div>
			</td>
			<td className="w-56">
				<Address walletName={walletName} address={address} maxChars={24} />
			</td>

			<td className="py-1 text-sm font-bold text-center">
				{transactionInfoIcons &&
					transactionInfoIcons.map((type: string, index: number) => {
						return (
							<div key={index} className={`inline-block mr-2 align-middle text-theme-neutral-400`}>
								<Icon name={type} width={16} height={16} />
							</div>
						);
					})}
			</td>
			<td className="text-sm text-right w-36">
				<Label color={amountLabelColor[type]} size="sm">
					{amount}
				</Label>
			</td>
			<td className="w-32 py-1 text-sm font-semibold text-right text-theme-neutral-500">
				<div>{fiat}</div>
			</td>
		</tr>
	);
};

TransactionListItem.defaultProps = {
	walletTypeIcons: [],
	actions: [],
	address: "",
};
