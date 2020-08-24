import { Contracts } from "@arkecosystem/platform-sdk";
import { Amount } from "app/components/Amount";
import { Label } from "app/components/Label";
import React from "react";

type Props = {
	transaction: Contracts.TransactionDataType;
	exchangeCurrency?: string;
};

export const TransactionRowAmount = ({ transaction, exchangeCurrency }: Props) => {
	if (exchangeCurrency) {
		return (
			/* @ts-ignore */
			<Amount
				value={transaction.convertedTotal()}
				ticker={exchangeCurrency}
				className="text-theme-neutral-dark"
				data-testid="TransactionRowAmount"
			/>
		);
	}

	const color = transaction.isSent() ? "danger" : "success";

	return (
		<Label data-testid="TransactionRowAmount" color={color}>
			{/* @ts-ignore */}
			<Amount ticker={transaction.wallet()?.currency() || ""} value={transaction.total()} />
		</Label>
	);
};
