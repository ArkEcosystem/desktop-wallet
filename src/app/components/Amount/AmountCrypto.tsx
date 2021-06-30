import React from "react";

import { AmountProperties } from "./Amount.contracts";
import { formatCrypto, formatWithSign } from "./Amount.helpers";

const AmountCrypto: React.FC<AmountProperties> = ({
	ticker,
	value,
	locale,
	isNegative,
	withSign,
	className,
}: AmountProperties) => {
	const amount = formatCrypto({ locale, ticker, value });

	const formatted = !withSign ? amount : formatWithSign(amount, !!isNegative);

	return (
		<span data-testid="AmountCrypto" className={className}>
			{formatted}
		</span>
	);
};

export { AmountCrypto };
