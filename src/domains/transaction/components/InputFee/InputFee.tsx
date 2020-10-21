import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { InputRange } from "app/components/Input";
import { SelectionBar, SelectionBarOption } from "app/components/SelectionBar";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export type InputFeeProps = {
	defaultValue: any;
	value?: any;
	min: string;
	avg: string;
	max: string;
	step: number;
	onChange?: (value: { display: string; value: string }) => void;
};

export type InputFee = {
	display: string;
	value: string;
};

// TODO: Remove defaultValue?
export const InputFee = ({ defaultValue, value, avg, min, max, onChange, step }: InputFeeProps) => {
	const { t } = useTranslation();

	const toHuman = (value: string | number) => BigNumber.make(value).divide(1e8).toString();

	const minHuman = toHuman(min);
	const maxHuman = toHuman(max);
	const avgHuman = toHuman(avg);

	const defaultFeeValue = value || defaultValue || avg;
	const defaultHuman = toHuman(defaultFeeValue);

	const [fee, setFee] = useState<InputFee>({ display: defaultHuman, value: defaultFeeValue });

	const handleFeeChange = (currency: InputFee) => {
		setFee(currency);
		onChange?.(currency);
	};

	const updatedFee = useRef(fee);
	useEffect(() => {
		updatedFee.current = fee;
	}, [fee]);

	useEffect(() => {
		if (!value && !defaultValue) {
			setFee({ display: "0", value: BigNumber.make("0").times(1e8).toString() });
		}

		const isFeeOutdated = !BigNumber.make(value).isEqualTo(updatedFee.current.value);
		if (isFeeOutdated) {
			setFee({ display: BigNumber.make(value).divide(1e8).toString(), value });
		}
	}, [value, defaultValue, updatedFee]);

	return (
		<div data-testid="InputFee" className="flex space-x-2">
			<div className="flex-1">
				<InputRange
					name="fee"
					avg={avg}
					value={fee}
					min={minHuman}
					max={maxHuman}
					step={step}
					onChange={onChange}
				/>
			</div>
			<div>
				<SelectionBar>
					<SelectionBarOption
						value={minHuman}
						isValueChecked={() => fee.display === minHuman}
						setCheckedValue={() => handleFeeChange({ display: minHuman, value: min })}
					>
						{t("TRANSACTION.FEES.MIN")}
					</SelectionBarOption>

					<SelectionBarOption
						value={avgHuman}
						isValueChecked={() => fee.display === avgHuman}
						setCheckedValue={() => handleFeeChange({ display: avgHuman, value: avg })}
					>
						{t("TRANSACTION.FEES.AVERAGE")}
					</SelectionBarOption>

					<SelectionBarOption
						value={maxHuman}
						isValueChecked={() => fee.display === maxHuman}
						setCheckedValue={() => handleFeeChange({ display: maxHuman, value: max })}
					>
						{t("TRANSACTION.FEES.MAX")}
					</SelectionBarOption>
				</SelectionBar>
			</div>
		</div>
	);
};
