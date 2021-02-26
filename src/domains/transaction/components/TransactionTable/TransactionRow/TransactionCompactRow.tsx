import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { TableCell, TableRow } from "app/components/Table";
import React from "react";
import { Size } from "types";
import { shouldUseDarkColors } from "utils/electron-utils";

import { TransactionRowAmount } from "./TransactionRowAmount";
import { TransactionRowMode } from "./TransactionRowMode";
import { TransactionRowRecipientLabel } from "./TransactionRowRecipientLabel";

type Props = {
	transaction: ExtendedTransactionData;
	walletName?: string;
	iconSize?: Size;
} & React.HTMLProps<any>;

export const TransactionCompactRow = ({ transaction, walletName, iconSize, ...props }: Props) => {
	const [shadowColor, setShadowColor] = React.useState<string>("--theme-background-color");

	return (
		<TableRow
			onMouseEnter={() => setShadowColor(shouldUseDarkColors() ? "--theme-black" : "--theme-color-secondary-100")}
			onMouseLeave={() => setShadowColor("")}
			{...props}
		>
			<TableCell variant="start" innerClassName="space-x-3" isCompact>
				<TransactionRowMode transaction={transaction} circleShadowColor={shadowColor} iconSize={iconSize} />
				<TransactionRowRecipientLabel transaction={transaction} walletName={walletName} />
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end" isCompact>
				<TransactionRowAmount transaction={transaction} />
			</TableCell>
		</TableRow>
	);
};
