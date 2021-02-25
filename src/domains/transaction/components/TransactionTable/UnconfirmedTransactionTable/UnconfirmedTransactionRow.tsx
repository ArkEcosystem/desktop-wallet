import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { TableCell, TableRow } from "app/components/Table";
import { TimeAgo } from "app/components/TimeAgo";
import React from "react";
import { Size } from "types";
import { shouldUseDarkColors } from "utils/electron-utils";

import { TransactionRowAmount } from "../TransactionRow/TransactionRowAmount";
import { TransactionRowRecipientIcon } from "../TransactionRow/TransactionRowRecipientIcon";
import { TransactionRowRecipientLabel } from "../TransactionRow/TransactionRowRecipientLabel";

type Props = {
	transaction: ExtendedTransactionData;
	walletName?: string;
	iconSize?: Size;
} & React.HTMLProps<any>;

export const UnconfirmedTransactionRow = ({ transaction, walletName, iconSize, ...props }: Props) => {
	const [shadowColor, setShadowColor] = React.useState<string>("--theme-background-color");
	return (
		<TableRow
			onMouseEnter={() => setShadowColor(shouldUseDarkColors() ? "--theme-black" : "--theme-color-secondary-100")}
			onMouseLeave={() => setShadowColor("")}
			{...props}
		>
			<TableCell variant="start" innerClassName="space-x-3 text-theme-secondary-500" isCompact>
				<TimeAgo date={transaction.timestamp()?.toString() as string} />
			</TableCell>

			<TableCell innerClassName="space-x-3" isCompact>
				<TransactionRowRecipientIcon
					size="sm"
					recipient={transaction.recipient()}
					type={transaction.type()}
					className={`bg-theme-background font-semibold border-theme-success-200 text-theme-success-600 dark:border-theme-success-600`}
					circleShadowColor={shadowColor}
				/>
				<TransactionRowRecipientLabel transaction={transaction} walletName={walletName} />
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end" isCompact>
				<TransactionRowAmount transaction={transaction} />
			</TableCell>
		</TableRow>
	);
};
