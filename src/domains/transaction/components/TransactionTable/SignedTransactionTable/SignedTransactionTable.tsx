import { Contracts } from "@arkecosystem/platform-sdk";
import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Table, TableCell, TableRow } from "app/components/Table";
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
	const asset = transaction.get<Record<string, any>>("asset");

	if (type === 4 && typeGroup === 1) {
		return "multiSignature";
	}

	if (type === 6) {
		return "multiPayment";
	}

	if (type === 3 && asset?.votes?.[0].startsWith("-")) {
		return "unvote";
	}

	if (type === 3) {
		return "vote";
	}

	if (type === 5) {
		return "ipfs";
	}

	return "transfer";
};

const StatusLabel = ({ wallet, transaction }: { wallet: ReadWriteWallet; transaction: SignedTransactionData }) => {
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
			<Tippy content={t("TRANSACTION.MULTISIGNATURE.AWAITING_OUR_SIGNATURE")}>
				<span className="p-1 text-theme-danger-400">
					<Icon name="AwaitingOurSignature" width={20} height={20} />
				</span>
			</Tippy>
		);
	}

	if (wallet.transaction().isAwaitingOtherSignatures(transaction.id())) {
		return (
			<Tippy
				content={t("TRANSACTION.MULTISIGNATURE.AWAITING_OTHER_SIGNATURE_COUNT", {
					count: wallet.coin().multiSignature().remainingSignatureCount(transaction),
				})}
			>
				<span className="p-1 text-theme-warning-300">
					<Icon name="AwaitingOtherSignature" width={30} height={22} />
				</span>
			</Tippy>
		);
	}

	if (isMultiSignatureReady) {
		return (
			<Tippy content={t("TRANSACTION.MULTISIGNATURE.READY")}>
				<span className="p-1 text-theme-success-500">
					<Icon name="Send" width={20} height={20} />
				</span>
			</Tippy>
		);
	}

	return (
		<Tippy content={t("TRANSACTION.MULTISIGNATURE.AWAITING_FINAL_SIGNATURE")}>
			<span className="p-1 text-theme-success-500">
				<Icon name="AwaitingFinalSignature" width={30} height={22} />
			</span>
		</Tippy>
	);
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
				<Tippy content={transaction.id()}>
					<span className="text-theme-neutral-300 dark:text-theme-neutral-800">
						<Icon name="Redirect" />
					</span>
				</Tippy>
			</TableCell>

			<TableCell className="w-50" innerClassName="text-theme-secondary-text">
				<span data-testid="TransactionRow__timestamp">
					{/* TODO */}
					{DateTime.fromUnix(1596213281).format("DD MMM YYYY HH:mm:ss")}
				</span>
			</TableCell>

			<TableCell innerClassName="space-x-4">
				<BaseTransactionRowMode
					isSent={true}
					type={type}
					recipient={recipient}
					circleShadowColor={shadowColor}
					recipients={recipients}
				/>

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

			<TableCell variant="end" className="w-24" innerClassName="justify-end">
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
			minimumWidth: true,
		},
		{
			Header: t("COMMON.DATE"),
			accessor: "timestamp",
		},
		{
			Header: t("COMMON.RECIPIENT"),
			className: "ml-25",
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
			className: "justify-end no-border",
		},
		{
			Header: "Sign",
			className: "hidden",
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
