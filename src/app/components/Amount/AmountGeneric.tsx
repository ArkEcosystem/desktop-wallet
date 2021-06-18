import React from "react";

import { AmountProperties } from "./Amount.contracts";
import { getDecimalsByTicker } from "./Amount.helpers";
import { AmountCrypto } from "./AmountCrypto";
import { AmountFiat } from "./AmountFiat";

const AmountGeneric: React.FC<AmountProperties> = (properties: AmountProperties) => {
	const isFiat = getDecimalsByTicker(properties.ticker) < 2;

	if (isFiat) {
		return <AmountFiat {...properties} />;
	}

	return <AmountCrypto {...properties} />;
};

export { AmountGeneric };
