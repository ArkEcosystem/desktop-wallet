import React from "react";

import { AmountProperties } from "./Amount.contracts";
import { formatFiat, formatWithSign } from "./Amount.helpers";

const AmountFiat: React.FC<AmountProperties> = ({
	ticker,
	value,
	isNegative = false,
	showSign,
	className,
}: AmountProperties) => {
	const amount = formatFiat({ ticker, value });

	let formattedAmount = amount;

	if (showSign) {
		formattedAmount = formatWithSign(formattedAmount, isNegative);
	}

	return (
		<span data-testid="AmountFiat" className={className}>
			{formattedAmount}
		</span>
	);
};

export { AmountFiat };
