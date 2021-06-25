import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { Icon } from "app/components/Icon";
import { TableCell, TableRow } from "app/components/Table";
import { Tooltip } from "app/components/Tooltip";
import { useTimeFormat } from "app/hooks/use-time-format";
import React from "react";
import { useTranslation } from "react-i18next";

import { BaseTransactionRowAmount } from "./TransactionRowAmount";
import { BaseTransactionRowInfo } from "./TransactionRowInfo";
import { BaseTransactionRowMode } from "./TransactionRowMode";
import { BaseTransactionRowRecipientLabel } from "./TransactionRowRecipientLabel";

export const PendingTransferRow = ({
	transaction,
	onRowClick,
	wallet,
}: {
	transaction: DTO.ExtendedConfirmedTransactionData;
	onRowClick?: (transaction: DTO.ExtendedConfirmedTransactionData) => void;
	wallet: Contracts.IReadWriteWallet;
}) => {
	const { t } = useTranslation();
	const timeFormat = useTimeFormat();

	return (
		<TableRow onClick={() => onRowClick?.(transaction)}>
			<TableCell variant="start">
				<Tooltip content={transaction.id()}>
					<span className="text-theme-secondary-300 dark:text-theme-secondary-800">
						<Icon name="Id" />
					</span>
				</Tooltip>
			</TableCell>

			<TableCell innerClassName="text-theme-secondary-text">
				<span data-testid="TransactionRow__timestamp">{transaction?.timestamp()?.format(timeFormat)}</span>
			</TableCell>

			<TableCell innerClassName="space-x-4">
				<BaseTransactionRowMode
					isSent={transaction.isSent()}
					isReturn={transaction.isReturn()}
					type={transaction.type()}
					recipient={transaction.recipient()}
				/>

				<BaseTransactionRowRecipientLabel type={transaction.type()} recipient={transaction.recipient()} />
			</TableCell>

			<TableCell innerClassName="justify-center">
				<BaseTransactionRowInfo isMultiSignatureRegistration={transaction.isMultiSignatureRegistration()} />
			</TableCell>

			<TableCell className="w-16" innerClassName="justify-center truncate">
				<Tooltip content={t("TRANSACTION.MULTISIGNATURE.AWAITING_CONFIRMATIONS")}>
					<span className="p-1 text-theme-warning-300">
						<Icon name="StatusPending" width={30} height={22} />
					</span>
				</Tooltip>
			</TableCell>

			<TableCell innerClassName="justify-end">
				<BaseTransactionRowAmount
					isSent={transaction?.isSent?.()}
					total={transaction.amount() + transaction.fee()}
					wallet={wallet}
				/>
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end" className="text-theme-secondary-500">
				{t("TRANSACTION.WAITING")}...
			</TableCell>
		</TableRow>
	);
};
