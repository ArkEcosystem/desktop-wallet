import { Currency } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { isNil } from "@arkecosystem/utils";
import { useCallback } from "react";

type CurrencyInput = {
	display: string;
	value: string;
};

export const useCurrencyDisplay = () => {
	const formatRange = useCallback((inputValues: any, maxNumber: string | number): number[] => {
		const sanitized = !isNil(inputValues[0]?.display)
			? BigNumber.make(inputValues[0]?.display)
			: BigNumber.make(inputValues[0]);
		return [Math.min(sanitized.toNumber(), Number(maxNumber))];
	}, []);

	const converToCurrency = useCallback((value: CurrencyInput | any): CurrencyInput => {
		if (!isNil(value.display)) {
			return value;
		}
		return Currency.fromString(String(value));
	}, []);

	return {
		formatRange,
		converToCurrency,
	};
};
