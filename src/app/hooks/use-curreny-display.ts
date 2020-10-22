// import { Currency } from "@arkecosystem/platform-sdk-intl";
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
		if (!isNil(value.display)) return value;

		return {
			display: BigNumber.make(value).toString(),
			value: BigNumber.make(value).divide(1e8).toString(),
		};
	}, []);

	const keepInRange = useCallback(
		(value: CurrencyInput, max: string): CurrencyInput => {
			const valueInRange = Number(value.display) > Number(max) ? converToCurrency(max.toString()) : value;
			return converToCurrency(valueInRange);
		},
		[converToCurrency],
	);

	return {
		formatRange,
		converToCurrency,
		keepInRange,
	};
};
