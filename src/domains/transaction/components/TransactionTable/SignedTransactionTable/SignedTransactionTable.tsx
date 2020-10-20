import { Contracts } from "@arkecosystem/platform-sdk";
import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Table, TableCell, TableRow } from "app/components/Table";
import { TruncateMiddle } from "app/components/TruncateMiddle";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { BaseTransactionRowAmount } from "../TransactionRow/TransactionRowAmount";
import { BaseTransactionRowInfo } from "../TransactionRow/TransactionRowInfo";
import { BaseTransactionRowMode } from "../TransactionRow/TransactionRowMode";
import { BaseTransactionRowRecipientLabel } from "../TransactionRow/TransactionRowRecipientLabel";

type SignedTransactionData = Contracts.SignedTransactionData;

type Props = {
	transactions: SignedTransactionData[];
	wallet: ReadWriteWallet;
	onClick?: (transaction: SignedTransactionData) => void;
};

const getType = (transaction: SignedTransactionData): string => {
	const type = transaction.get<number>("type");
	const typeGroup = transaction.get<number>("typeGroup");

	if (type === 4 && typeGroup === 1) {
		return "multiSignature";
	}

	if (type === 6) {
		return "multiPayment";
	}

	return "transfer";
};

const StatusLabel = ({ wallet, transaction }: { wallet: ReadWriteWallet; transaction: SignedTransactionData }) => {
	const isMultiSignatureReady = useMemo(() => {
		try {
			return wallet.coin().multiSignature().isMultiSignatureReady(transaction);
		} catch {
			return false;
		}
	}, [wallet, transaction]);

	if (wallet.transaction().isAwaitingOurSignature(transaction.id())) {
		return <span className="text-theme-danger-400">Your Signature</span>;
	}

	if (wallet.transaction().isAwaitingOtherSignatures(transaction.id())) {
		return (
			<span className="text-theme-danger-400">{`${wallet
				.coin()
				.multiSignature()
				.remainingSignatureCount(transaction)} more signature(s)`}</span>
		);
	}

	if (isMultiSignatureReady) {
		return <span className="text-theme-success-500">Ready</span>;
	}

	return <span className="text-theme-success-500">Final Signature</span>;
};

const Row = ({
	transaction,
	onSign,
	onRowClick,
	wallet,
}: {
	transaction: SignedTransactionData;
	onSign?: (transaction: SignedTransactionData) => void;
	onRowClick?: (transaction: SignedTransactionData) => void;
	wallet: ReadWriteWallet;
}) => {
	const { t } = useTranslation();
	const [shadowColor, setShadowColor] = useState("--theme-background-color");

	const recipient = transaction.get<string>("recipientId");
	const recipients = transaction.get<{ payments?: any }>("asset")?.payments;
	const canBeSigned = wallet.transaction().canBeSigned(transaction.id());
	const type = getType(transaction);

	return (
		<TableRow
			onMouseEnter={() => setShadowColor("--theme-color-neutral-100")}
			onMouseLeave={() => setShadowColor("")}
			onClick={() => onRowClick?.(transaction)}
		>
			<TableCell variant="start">
				<TruncateMiddle text={transaction.id()} />
			</TableCell>

			<TableCell className="w-48" innerClassName="text-theme-secondary-text">
				<span data-testid="TransactionRow__timestamp">
					{/* TODO */}
					{DateTime.fromUnix(1596213281).format("DD MMM YYYY HH:mm:ss")}
				</span>
			</TableCell>

			<TableCell className="w-32">
				<BaseTransactionRowMode
					isSent={true}
					type={type}
					recipient={recipient}
					circleShadowColor={shadowColor}
					recipients={recipients}
				/>
			</TableCell>

			<TableCell>
				<BaseTransactionRowRecipientLabel type={type} recipient={recipient} />
			</TableCell>

			<TableCell innerClassName="justify-center">
				<BaseTransactionRowInfo isMultiSignature={transaction.isMultiSignature()} />
			</TableCell>

			<TableCell className="w-16" innerClassName="justify-center truncate">
				<StatusLabel wallet={wallet} transaction={transaction} />
			</TableCell>

			<TableCell className="w-56" innerClassName="justify-end">
				<BaseTransactionRowAmount
					isSent={true}
					total={transaction.amount().plus(transaction.fee())}
					wallet={wallet}
				/>
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end">
				{canBeSigned ? (
					<Button data-testid="TransactionRow__sign" variant="plain" onClick={() => onSign?.(transaction)}>
						<Icon name="Edit" />
						<span>{t("COMMON.SIGN")}</span>
					</Button>
				) : null}
			</TableCell>
		</TableRow>
	);
};

export const SignedTransactionTable = ({ transactions, wallet, onClick }: Props) => {
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
			Header: "Type",
			className: "hidden no-border",
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
			Header: "Sign",
			className: "invisible no-border w-24",
		},
	];

	return (
		<div data-testid="SignedTransactionTable" className="relative">
			<Table columns={columns} data={transactions}>
				{(transaction: SignedTransactionData) => (
					<Row transaction={transaction} wallet={wallet} onSign={onClick} onRowClick={onClick} />
				)}
			</Table>
		</div>
	);
};
