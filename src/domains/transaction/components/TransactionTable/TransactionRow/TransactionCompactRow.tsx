import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { TableCell, TableRow } from "app/components/Table";
import React from "react";

import { TransactionRowAmount } from "./TransactionRowAmount";
import { TransactionRowMode } from "./TransactionRowMode";
import { TransactionRowRecipientLabel } from "./TransactionRowRecipientLabel";

type Props = {
	transaction: ExtendedTransactionData;
	walletName?: string;
} & React.HTMLProps<any>;

export const TransactionCompactRow = ({ transaction, walletName, ...props }: Props) => {
	const [shadowColor, setShadowColor] = React.useState<string>("--theme-background-color");

	return (
		<TableRow
			onMouseEnter={() => setShadowColor("--theme-color-neutral-100")}
			onMouseLeave={() => setShadowColor("")}
			{...props}
		>
			<TableCell variant="start" className="w-24">
				<TransactionRowMode transaction={transaction} circleShadowColor={shadowColor} />
			</TableCell>

			<TableCell>
				<TransactionRowRecipientLabel transaction={transaction} walletName={walletName} />
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end">
				<TransactionRowAmount transaction={transaction} />
			</TableCell>
		</TableRow>
	);
};
