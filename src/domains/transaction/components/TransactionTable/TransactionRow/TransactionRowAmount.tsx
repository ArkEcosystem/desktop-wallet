import { Contracts } from "@arkecosystem/platform-sdk";
import { Label } from "app/components/Label";
import React from "react";

type Props = {
	transaction: Contracts.TransactionDataType;
	currencyRate?: string;
};

export const TransactionRowAmount = ({ transaction, currencyRate }: Props) => {
	// Decouple logic to sdk or a specific component/hook
	const total = React.useMemo(() => {
		let value = transaction.amount();

		if (transaction.isSent()) {
			value = value.plus(transaction.fee());
		}

		if (currencyRate) {
			return value.times(currencyRate).toFixed(2);
		}

		return value.toFixed(8);
	}, [transaction, currencyRate]);

	if (currencyRate) {
		return (
			<span className="text-theme-neutral-dark" data-testid="TransactionRowAmount">
				{total}
			</span>
		);
	}

	const color = transaction.isSent() ? "danger" : "success";

	return (
		<Label data-testid="TransactionRowAmount" color={color}>
			{total}
		</Label>
	);
};
