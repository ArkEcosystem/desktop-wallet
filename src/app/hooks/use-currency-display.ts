import { Currency } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { isNil } from "@arkecosystem/utils";
import { useCallback } from "react";

type CurrencyInput = {
	display: string;
	value: string;
};

export const useCurrencyDisplay = () => {
	const formatRange = useCallback((inputValue: any, maxNumber: string | number): number[] => {
		const sanitized = !isNil(inputValue?.display)
			? BigNumber.make(inputValue?.display)
			: BigNumber.make(inputValue);
		return [Math.min(sanitized.toNumber(), Number(maxNumber))];
	}, []);

	const convertToCurrency = useCallback((value: CurrencyInput | any): CurrencyInput => {
		if (!isNil(value.display)) {
			return value;
		}
		return Currency.fromString(String(value));
	}, []);

	return {
		formatRange,
		convertToCurrency,
	};
};
