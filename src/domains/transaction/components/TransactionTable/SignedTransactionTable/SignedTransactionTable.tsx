import { Contracts } from "@arkecosystem/platform-sdk";
import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Table, TableCell, TableRow } from "app/components/Table";
import { TruncateMiddle } from "app/components/TruncateMiddle";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { MultiSignatureDetail } from "../../MultiSignatureDetail";
import { BaseTransactionRowAmount } from "../TransactionRow/TransactionRowAmount";
import { BaseTransactionRowInfo } from "../TransactionRow/TransactionRowInfo";
import { BaseTransactionRowMode } from "../TransactionRow/TransactionRowMode";
import { BaseTransactionRowRecipientLabel } from "../TransactionRow/TransactionRowRecipientLabel";

type SignedTransactionData = Contracts.SignedTransactionData;

type Props = {
	transactions: SignedTransactionData[];
	wallet: ReadWriteWallet;
};

const getType = (transaction: SignedTransactionData): string => {
	const type = transaction.get<number>("type");
	const typeGroup = transaction.get<number>("typeGroup");

	if (type === 4 && typeGroup === 1) {
		return "multiSignature";
	}

	return "transfer";
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
	return (
		<TableRow
			onMouseEnter={() => setShadowColor("--theme-color-neutral-100")}
			onMouseLeave={() => setShadowColor("")}
			onClick={() => onRowClick?.(transaction)}
		>
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
					circleShadowColor={shadowColor}
				/>
			</TableCell>

			<TableCell>
				<BaseTransactionRowRecipientLabel type={getType(transaction)} recipient={transaction.recipient()} />
			</TableCell>

			<TableCell innerClassName="justify-center">
				<BaseTransactionRowInfo isMultiSignature={transaction.isMultiSignature()} />
			</TableCell>

			<TableCell className="w-16" innerClassName="justify-center">
				<Icon name="Edit" className="text-theme-danger-400" />
			</TableCell>

			<TableCell className="w-56" innerClassName="justify-end">
				<BaseTransactionRowAmount
					isSent={true}
					total={transaction.amount().plus(transaction.fee())}
					wallet={wallet}
				/>
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end">
				{wallet.transaction().isAwaitingOurSignature(transaction.id()) ? (
					<Button data-testid="TransactionRow__sign" variant="plain" onClick={() => onSign?.(transaction)}>
						<Icon name="Edit" />
						<span>{t("COMMON.SIGN")}</span>
					</Button>
				) : null}
			</TableCell>
		</TableRow>
	);
};

export const SignedTransactionTable = ({ transactions, wallet }: Props) => {
	const { t } = useTranslation();
	const [showModal, setShowModal] = useState<SignedTransactionData | undefined>(undefined);

	const handleClick = (transaction: Contracts.SignedTransactionData) => {
		setShowModal(transaction);
	};

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
					<Row transaction={transaction} wallet={wallet} onSign={handleClick} onRowClick={handleClick} />
				)}
			</Table>

			{showModal && (
				<MultiSignatureDetail
					transaction={showModal}
					isOpen={!!showModal}
					wallet={wallet}
					onClose={() => setShowModal(undefined)}
				/>
			)}
		</div>
	);
};
