import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { SignedTransactionData } from "@arkecosystem/platform-sdk/dist/contracts";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Table, TableCell, TableRow } from "app/components/Table";
import { TruncateMiddle } from "app/components/TruncateMiddle";
import React from "react";
import { useTranslation } from "react-i18next";

import { BaseTransactionRowAmount } from "../TransactionRow/TransactionRowAmount";
import { BaseTransactionRowInfo } from "../TransactionRow/TransactionRowInfo";
import { BaseTransactionRowMode } from "../TransactionRow/TransactionRowMode";
import { BaseTransactionRowRecipientLabel } from "../TransactionRow/TransactionRowRecipientLabel";

type Props = {
	transactions: SignedTransactionData[];
	wallet: ReadWriteWallet;
	onSign?: () => void;
};

const getType = (transaction: SignedTransactionData) => {
	let type = "transfer";

	if (transaction.isMultiSignatureRegistration()) {
		type = "multiSignature";
	}

	return type;
};

export const SignedTransactionTable = ({ transactions, onSign, wallet }: Props) => {
	const { t } = useTranslation();

	const columns = [
		{
			Header: t("COMMON.ID"),
		},
		{
			Header: t("COMMON.DATE"),
			accessor: "timestamp",
		},
		{
			Header: t("COMMON.TYPE"),
			className: "invisible",
		},
		{
			Header: t("COMMON.RECIPIENT"),
		},
		{
			Header: t("COMMON.INFO"),
			className: "justify-center",
		},
		{
			Header: t("COMMON.STATUS"),
			className: "justify-center",
		},
		{
			Header: t("COMMON.AMOUNT"),
			accessor: "amount",
			className: "justify-end",
		},
		{
			Header: t("COMMON.SIGN"),
			className: "invisible w-24",
		},
	];

	return (
		<div data-testid="SignedTransactionTable" className="relative">
			<Table columns={columns} data={transactions}>
				{(transaction: SignedTransactionData) => (
					<TableRow>
						<TableCell variant="start">
							<TruncateMiddle text={transaction.id()} />
						</TableCell>

						<TableCell className="w-48" innerClassName="text-sm text-theme-neutral-600">
							<span data-testid="TransactionRow__timestamp">
								{/* TODO */}
								{DateTime.fromUnix(1596213281).format("DD MMM YYYY HH:mm:ss")}
							</span>
						</TableCell>

						<TableCell className="w-32">
							<BaseTransactionRowMode
								isSent={true}
								type={getType(transaction)}
								recipient={transaction.recipient()}
							/>
						</TableCell>

						<TableCell>
							<BaseTransactionRowRecipientLabel
								type={getType(transaction)}
								recipient={transaction.recipient()}
							/>
						</TableCell>

						<TableCell innerClassName="justify-center">
							<BaseTransactionRowInfo isMultiSignature={transaction.isMultiSignature()} />
						</TableCell>

						<TableCell className="w-16" innerClassName="justify-center">
							<Icon name="Edit" className="text-theme-danger-400" />
						</TableCell>

						<TableCell innerClassName="justify-end">
							<BaseTransactionRowAmount
								isSent={true}
								total={transaction.amount().plus(transaction.fee())}
								wallet={wallet}
							/>
						</TableCell>

						<TableCell variant="end" innerClassName="justify-end">
							<Button data-testid="TransactionRow__sign" variant="plain" onClick={onSign}>
								<Icon name="Edit" />
								<span>Sign</span>
							</Button>
						</TableCell>
					</TableRow>
				)}
			</Table>
		</div>
	);
};
