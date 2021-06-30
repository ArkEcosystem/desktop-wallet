import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { TableCell, TableRow } from "app/components/Table";
import React from "react";

import { TransactionCompactRowSkeleton } from "./TransactionCompactRowSkeleton";
import { TransactionRowAmount } from "./TransactionRowAmount";
import { TransactionRowMode } from "./TransactionRowMode";
import { TransactionRowRecipientLabel } from "./TransactionRowRecipientLabel";

type Properties = {
	transaction: DTO.ExtendedConfirmedTransactionData;
	walletName?: string;
	isLoading?: boolean;
} & React.HTMLProps<any>;

export const TransactionCompactRow: React.FC<Properties> = ({
	transaction,
	walletName,
	isLoading,
	...properties
}: Properties) => {
	if (isLoading) {
		return <TransactionCompactRowSkeleton />;
	}

	return (
		<TableRow {...properties}>
			<TableCell variant="start" className="w-3/5" innerClassName="flex space-x-3" isCompact>
				<TransactionRowMode transaction={transaction} iconSize={"sm"} />
				<div className="w-20 flex-1">
					<TransactionRowRecipientLabel transaction={transaction} walletName={walletName} />
				</div>
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end" isCompact>
				<TransactionRowAmount transaction={transaction} />
			</TableCell>
		</TableRow>
	);
};
