import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { useEffect, useRef, useState } from "react";

export type InputFee = {
	display: string;
	value: string;
};

export const useFeeFormat = ({ defaultValue, value, avg }: any) => {
	const toHuman = (inputValue: string | number) => BigNumber.make(inputValue).divide(1e8).toString();
	const defaultFeeValue = value || defaultValue || avg;
	const defaultHuman = toHuman(defaultFeeValue);

	const [fee, setFee] = useState<InputFee>({ display: defaultHuman, value: defaultFeeValue });

	const feeFromValue = (feevalue?: string | number): InputFee => {
		const value = BigNumber.make(feevalue || 0);
		return {
			display: value.divide(1e8).toString(),
			value: value.toString(),
		};
	};

	const updatedFee = useRef(fee);
	useEffect(() => {
		updatedFee.current = feeFromValue(fee?.value);
	}, [fee]);

	useEffect(() => {
		if (!value && !defaultValue) {
			setFee(feeFromValue(value));
		}

		const isFeeOutdated = !BigNumber.make(value).isEqualTo(updatedFee.current.value);
		if (isFeeOutdated) {
			setFee(feeFromValue(value));
		}
	}, [value, defaultValue, updatedFee]);

	return {
		fee,
		toHuman,
		updateFee: setFee,
	};
};
