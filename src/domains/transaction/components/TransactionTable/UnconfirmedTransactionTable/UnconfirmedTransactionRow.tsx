import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { TableCell, TableRow } from "app/components/Table";
import { TimeAgo } from "app/components/TimeAgo";
import React from "react";
import { Size } from "types";

import { TransactionRowAmount } from "../TransactionRow/TransactionRowAmount";
import { TransactionRowRecipientIcon } from "../TransactionRow/TransactionRowRecipientIcon";
import { TransactionRowRecipientLabel } from "../TransactionRow/TransactionRowRecipientLabel";

type Props = {
	transaction: DTO.ExtendedTransactionData;
	walletName?: string;
	iconSize?: Size;
} & React.HTMLProps<any>;

export const UnconfirmedTransactionRow = ({ transaction, walletName, iconSize, ...props }: Props) => (
	<TableRow {...props}>
		<TableCell variant="start" innerClassName="space-x-3 text-theme-secondary-500">
			<TimeAgo date={transaction.timestamp()?.toString() as string} />
		</TableCell>

		<TableCell innerClassName="space-x-3 w-50">
			<TransactionRowRecipientIcon size="sm" recipient={transaction.recipient()} type={transaction.type()} />
			<TransactionRowRecipientLabel transaction={transaction} walletName={walletName} />
		</TableCell>

		<TableCell variant="end" innerClassName="justify-end">
			<TransactionRowAmount transaction={transaction} />
		</TableCell>
	</TableRow>
);
