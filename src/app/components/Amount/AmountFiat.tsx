import React from "react";

import { AmountProperties } from "./Amount.contracts";
import { formatFiat, formatWithSign } from "./Amount.helpers";

const AmountFiat: React.FC<AmountProperties> = ({
	ticker,
	value,
	isNegative,
	withSign,
	className,
}: AmountProperties) => {
	const amount = formatFiat({ value, ticker });

	const formatted = !withSign ? amount : formatWithSign(amount, !!isNegative);

	return (
		<span data-testid="AmountFiat" className={className}>
			{formatted}
		</span>
	);
};

export { AmountFiat };
