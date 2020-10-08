import { Contracts } from "@arkecosystem/platform-sdk";
import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

import { Signatures } from "./Signatures";

type Transaction = ExtendedTransactionData | Contracts.SignedTransactionData;

const isExtendedTransation = (transaction: Transaction): transaction is ExtendedTransactionData =>
	!!(transaction as ExtendedTransactionData).isConfirmed;

export const FirstStep = ({ transaction }: { transaction: Transaction }) => {
	const { t } = useTranslation();
	const canBeSigned = !isExtendedTransation(transaction)
		? transaction.isMultiSignature()
		: transaction.wallet().transaction().canBeSigned(transaction.id());

	return (
		<section data-testid="MultiSignatureDetail__first-step">
			<TransactionDetail
				label={t("TRANSACTION.SENDER")}
				extra={<Avatar address={transaction.sender()} />}
				border={false}
			>
				<Address address={transaction.sender()} />
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.RECIPIENT")} extra={<Avatar address={transaction.recipient()} />}>
				<Address address={transaction.recipient()} />
			</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.AMOUNT")}
				extra={
					<Circle className="border-theme-danger-contrast text-theme-danger-400">
						<Icon name="Sent" width={16} height={16} />
					</Circle>
				}
			>
				<Label color="danger">
					<Amount
						ticker={isExtendedTransation(transaction) ? transaction.wallet().currency() : ""}
						value={transaction.amount()}
					/>
				</Label>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")}>
				<Amount
					ticker={isExtendedTransation(transaction) ? transaction.wallet().currency() : ""}
					value={transaction.fee()}
				/>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TIMESTAMP")}>
				{isExtendedTransation(transaction) && transaction.timestamp()}
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.CONFIRMATIONS")} paddingPosition="top">
				{t("TRANSACTION.MODAL_MULTISIGNATURE_DETAIL.WAITING_FOR_SIGNATURES")}
			</TransactionDetail>

			{canBeSigned ? (
				<TransactionDetail label={t("TRANSACTION.CONFIRMATIONS")} className="pb-0">
					{t("TRANSACTION.MODAL_MULTISIGNATURE_DETAIL.WAITING_FOR_SIGNATURES")}
				</TransactionDetail>
			) : null}

			<div className="px-10 pt-8 mt-8 -mx-10 text-black border-t border-gray-500">
				<Signatures />
			</div>
		</section>
	);
};
