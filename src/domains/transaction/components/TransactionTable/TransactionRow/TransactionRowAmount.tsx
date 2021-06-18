import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { Amount } from "app/components/Amount";
import { Label } from "app/components/Label";
import React from "react";

interface Properties {
	isSent: boolean;
	wallet: Contracts.IReadWriteWallet;
	total: number;
	convertedTotal?: number;
	exchangeCurrency?: string;
}

export const BaseTransactionRowAmount = ({ isSent, wallet, total, convertedTotal, exchangeCurrency }: Properties) => {
	const isNegative = total !== 0 && isSent;

	if (exchangeCurrency) {
		return (
			<Amount
				data-testid="TransactionRowAmount"
				value={convertedTotal!}
				ticker={exchangeCurrency}
				className="text-theme-secondary-text"
			/>
		);
	}

	const color = isSent ? "danger" : "success";

	return (
		<Label data-testid="TransactionRowAmount" color={color} className="whitespace-nowrap">
			<Amount ticker={wallet.currency()} value={total} isNegative={isNegative} showSign />
		</Label>
	);
};

export const TransactionRowAmount = ({
	transaction,
	exchangeCurrency,
}: {
	transaction: DTO.ExtendedTransactionData;
	exchangeCurrency?: string;
}) => (
	<BaseTransactionRowAmount
		isSent={transaction.isSent()}
		wallet={transaction.wallet()}
		total={transaction.total()}
		convertedTotal={transaction.convertedTotal()}
		exchangeCurrency={exchangeCurrency}
	/>
);
