import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Divider } from "app/components/Divider";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionRecipients } from "domains/transaction/components/TransactionDetail";
import { evaluateFee } from "domains/transaction/utils";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const TransferLedgerReview = ({ wallet }: { wallet: ReadWriteWallet }) => {
	const { getValues, watch } = useFormContext();
	const { t } = useTranslation();

	// getValues does not get the value of `defaultValues` on first render
	const [watched] = useState(() => watch());
	const fee = getValues("fee") || watched.fee;
	const recipients = getValues("recipients") || watched.recipients;

	let amount = BigNumber.ZERO;
	for (const recipient of recipients) {
		amount = amount.plus(recipient.amount);
	}

	return (
		<>
			<Divider />
			<div className="flex flex-col space-y-6">
				<h2 className="text-2xl font-bold">{t("TRANSACTION.TRANSACTION_DETAILS")}</h2>

				<TransactionRecipients
					currency={wallet.currency()}
					recipients={getValues("recipients")}
					borderPosition="bottom"
					paddingPosition="bottom"
				/>

				<div>
					<TotalAmountBox amount={amount} fee={evaluateFee(fee)} ticker={wallet.currency()} />
				</div>
			</div>
		</>
	);
};
