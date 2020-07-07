import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Label } from "app/components/Label";
import React from "react";

type Props = {
	amount: string;
	fee: string;
	currencyRate?: string;
	isSent?: boolean;
};

export const TransactionRowAmount = ({ amount, fee, isSent, currencyRate }: Props) => {
	// Decouple logic to sdk or a specific component/hook
	const total = React.useMemo(() => {
		let value = BigNumber.make(amount);

		if (isSent) {
			value = value.plus(fee);
		}

		if (currencyRate) {
			return value.times(currencyRate).toFixed(2);
		}

		return value.toFixed(8);
	}, [amount, fee, isSent, currencyRate]);

	if (currencyRate) {
		return <span data-testid="TransactionRowAmount">{total}</span>;
	}

	const color = isSent ? "success" : "danger";

	return (
		<Label data-testid="TransactionRowAmount" color={color}>
			{total}
		</Label>
	);
};
