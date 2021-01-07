import { ExtendedTransactionData, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Amount } from "app/components/Amount";
import { Label } from "app/components/Label";
import React from "react";

type Props = {
	isSent: boolean;
	wallet?: ReadWriteWallet;
	total: BigNumber;
	convertedTotal?: BigNumber;
	exchangeCurrency?: string;
};

export const BaseTransactionRowAmount = ({ isSent, wallet, total, convertedTotal, exchangeCurrency }: Props) => {
	const isNegative = !total.isZero() && isSent;

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
			<Amount ticker={wallet?.currency() || ""} value={total} isNegative={isNegative} showSign />
		</Label>
	);
};

export const TransactionRowAmount = ({
	transaction,
	exchangeCurrency,
}: {
	transaction: ExtendedTransactionData;
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
