import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionMemo, TransactionRecipients } from "domains/transaction/components/TransactionDetail";
import { evaluateFee } from "domains/transaction/utils";
import React from "react";
import { useFormContext } from "react-hook-form";

export const TransferLedgerReview = ({ wallet }: { wallet: ReadWriteWallet }) => {
	const { getValues } = useFormContext();

	const { fee, recipients, smartbridge } = getValues();

	let amount = BigNumber.ZERO;
	for (const recipient of recipients) {
		amount = amount.plus(recipient.amount);
	}

	return (
		<>
			<TransactionRecipients currency={wallet.currency()} recipients={recipients} border={false} />

			{smartbridge && <TransactionMemo memo={smartbridge} />}

			<div className="mt-2">
				<TotalAmountBox amount={amount} fee={evaluateFee(fee)} ticker={wallet.currency()} />
			</div>
		</>
	);
};
