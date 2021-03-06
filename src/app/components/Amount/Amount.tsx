import React from "react";

import { AmountProperties, DEFAULT_TICKER } from "./Amount.contracts";
import { getDecimalsByTicker } from "./Amount.helpers";
import { AmountCrypto } from "./AmountCrypto";
import { AmountFiat } from "./AmountFiat";

const Amount: React.FC<AmountProperties> = (properties: AmountProperties) => {
	const isFiat = getDecimalsByTicker(properties.ticker || DEFAULT_TICKER) <= 2;

	if (isFiat) {
		return <AmountFiat {...properties} />;
	}

	return <AmountCrypto {...properties} />;
};

export { Amount };
