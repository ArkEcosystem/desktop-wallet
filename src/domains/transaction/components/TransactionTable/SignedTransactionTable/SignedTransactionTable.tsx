import { Contracts } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Table, TableCell, TableRow } from "app/components/Table";
import { Tooltip } from "app/components/Tooltip";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { BaseTransactionRowAmount } from "../TransactionRow/TransactionRowAmount";
import { BaseTransactionRowInfo } from "../TransactionRow/TransactionRowInfo";
import { BaseTransactionRowMode } from "../TransactionRow/TransactionRowMode";
import { BaseTransactionRowRecipientLabel } from "../TransactionRow/TransactionRowRecipientLabel";

interface Props {
	transactions: Contracts.SignedTransactionData[];
	wallet: ProfileContracts.IReadWriteWallet;
	onClick?: (transaction: Contracts.SignedTransactionData) => void;
}

const StatusLabel = ({
	wallet,
	transaction,
}: {
	wallet: ProfileContracts.IReadWriteWallet;
	transaction: Contracts.SignedTransactionData;
}) => {
	const { t } = useTranslation();

	const isMultiSignatureReady = useMemo(() => {
		try {
			return wallet.coin().multiSignature().isMultiSignatureReady(transaction);
		} catch {
			return false;
		}
	}, [wallet, transaction]);

	if (wallet.transaction().isAwaitingOurSignature(transaction.id())) {
		return (
			<Tooltip content={t("TRANSACTION.MULTISIGNATURE.AWAITING_OUR_SIGNATURE")}>
				<span className="p-1 text-theme-danger-400">
					<Icon name="AwaitingOurSignature" width={20} height={20} />
				</span>
			</Tooltip>
		);
	}

	if (wallet.transaction().isAwaitingOtherSignatures(transaction.id())) {
		return (
			<Tooltip
				content={t("TRANSACTION.MULTISIGNATURE.AWAITING_OTHER_SIGNATURE_COUNT", {
					count: wallet.coin().multiSignature().remainingSignatureCount(transaction),
				})}
			>
				<span className="p-1 text-theme-warning-300">
					<Icon name="AwaitingOtherSignature" width={30} height={22} />
				</span>
			</Tooltip>
		);
	}

	if (wallet.transaction().isAwaitingConfirmation(transaction.id())) {
		return (
			<Tooltip content={t("TRANSACTION.MULTISIGNATURE.AWAITING_CONFIRMATIONS")}>
				<span className="p-1 text-theme-warning-300">
					<Icon name="StatusPending" width={30} height={22} />
				</span>
			</Tooltip>
		);
	}

	if (isMultiSignatureReady) {
		return (
			<Tooltip content={t("TRANSACTION.MULTISIGNATURE.READY")}>
				<span className="p-1 text-theme-success-500">
					<Icon name="Send" width={16} height={16} />
				</span>
			</Tooltip>
		);
	}

	return (
		<Tooltip content={t("TRANSACTION.MULTISIGNATURE.AWAITING_FINAL_SIGNATURE")}>
			<span className="p-1 text-theme-success-500">
				<Icon name="AwaitingFinalSignature" width={30} height={22} />
			</span>
		</Tooltip>
	);
};

const Row = ({
	transaction,
	onSign,
	onRowClick,
	wallet,
}: {
	transaction: Contracts.SignedTransactionData;
	onSign?: (transaction: Contracts.SignedTransactionData) => void;
	onRowClick?: (transaction: Contracts.SignedTransactionData) => void;
	wallet: ProfileContracts.IReadWriteWallet;
}) => {
	const { t } = useTranslation();

	const recipient = transaction.get<string>("recipientId");
	const canBeSigned = wallet.transaction().canBeSigned(transaction.id());

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
				<span data-testid="TransactionRow__timestamp">
					{transaction.timestamp().format("DD MMM YYYY HH:mm:ss")}
				</span>
			</TableCell>

			<TableCell innerClassName="space-x-4">
				<BaseTransactionRowMode isSent={true} type={transaction.type()} recipient={recipient} />

				<BaseTransactionRowRecipientLabel type={transaction.type()} recipient={recipient} />
			</TableCell>

			<TableCell innerClassName="justify-center">
				<BaseTransactionRowInfo isMultiSignatureRegistration={transaction.usesMultiSignature()} />
			</TableCell>

			<TableCell className="w-16" innerClassName="justify-center truncate">
				<StatusLabel wallet={wallet} transaction={transaction} />
			</TableCell>

			<TableCell innerClassName="justify-end">
				<BaseTransactionRowAmount
					isSent={true}
					total={transaction.amount().plus(transaction.fee())}
					wallet={wallet}
				/>
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end">
				{canBeSigned ? (
					<Button
						data-testid="TransactionRow__sign"
						variant="secondary"
						onClick={() => onSign?.(transaction)}
					>
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
			minimumWidth: true,
		},
		{
			Header: t("COMMON.DATE"),
			accessor: "timestamp",
			sortDescFirst: true,
			cellWidth: "w-50",
		},
		{
			Header: t("COMMON.RECIPIENT"),
			cellWidth: "w-96",
		},
		{
			Header: t("COMMON.INFO"),
			className: "justify-center",
		},
		{
			Header: t("COMMON.STATUS"),
			className: "justify-center",
			minimumWidth: true,
		},
		{
			Header: t("COMMON.AMOUNT"),
			accessor: "amount",
			className: "justify-end no-border",
		},
		{
			Header: "Sign",
			className: "hidden",
			cellWidth: "w-24",
		},
	];

	return (
		<div data-testid="SignedTransactionTable" className="relative">
			<Table columns={columns} data={transactions}>
				{(transaction: Contracts.SignedTransactionData) => (
					<Row transaction={transaction} wallet={wallet} onSign={onClick} onRowClick={onClick} />
				)}
			</Table>
		</div>
	);
};
