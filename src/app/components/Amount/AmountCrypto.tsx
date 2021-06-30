import React from "react";

import { AmountProperties } from "./Amount.contracts";
import { formatCrypto, formatWithSign } from "./Amount.helpers";

const AmountCrypto: React.FC<AmountProperties> = ({
	className,
	isNegative = false,
	locale,
	showSign,
	showTicker = true,
	ticker,
	value,
}: AmountProperties) => {
	const amount = formatCrypto({ locale, ticker, value });

	let formattedAmount = amount;

	if (!showTicker) {
		formattedAmount = formattedAmount.split(" ").slice(0, -1).join(" ");
	}

	if (showSign) {
		formattedAmount = formatWithSign(formattedAmount, isNegative);
	}

	return (
		<span data-testid="AmountCrypto" className={className}>
			{formattedAmount}
		</span>
	);
};

export { AmountCrypto };
