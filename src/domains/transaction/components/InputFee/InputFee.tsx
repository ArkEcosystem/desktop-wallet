import { Currency } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { InputRange } from "app/components/Input";
import { SelectionBar, SelectionBarOption } from "app/components/SelectionBar";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type InputFeeProps = {
	defaultValue: any;
	value?: string | undefined;
	min: string;
	avg: string;
	max: string;
	step: number;
	onChange?: (value: { display: string; value: string }) => void;
};

// TODO: Remove defaultValue?
export const InputFee = ({ defaultValue, value, avg, min, max, onChange, step, magnitude }: InputFeeProps) => {
	const { t } = useTranslation();
	const convertValue = useCallback((value: string) => Currency.fromString(value, magnitude), [magnitude]);

	const minHuman = BigNumber.make(min).divide(1e8).toString();
	const maxHuman = BigNumber.make(max).divide(1e8).toString();
	const avgHuman = BigNumber.make(avg).divide(1e8).toString();

	const [fee, setFee] = useState<any>(defaultValue);

	const handleFeeChange = (currency: { display?: string; value: string }) => {
		setFee(currency);
		onChange?.(currency);
	};

	useEffect(() => {
		if (value && value !== fee) {
			setFee(value);
		}
	}, [fee, value]);

	return (
		<div data-testid="InputFee" className="flex space-x-2">
			<div className="flex-1">
				<InputRange
					name="fee"
					defaultValue={fee}
					value={fee}
					min={minHuman}
					max={maxHuman}
					step={step}
					onChange={handleFeeChange}
				/>
			</div>
			<div>
				<SelectionBar>
					<SelectionBarOption
						value={min}
						isValueChecked={() => fee === min}
						setCheckedValue={() => handleFeeChange(convertValue(minHuman))}
					>
						{t("TRANSACTION.FEES.MIN")}
					</SelectionBarOption>

					<SelectionBarOption
						value={avg}
						isValueChecked={() => fee === avg}
						setCheckedValue={() => handleFeeChange(convertValue(avgHuman))}
					>
						{t("TRANSACTION.FEES.AVERAGE")}
					</SelectionBarOption>

					<SelectionBarOption
						value={max}
						isValueChecked={() => fee === max}
						setCheckedValue={() => handleFeeChange(convertValue(maxHuman))}
					>
						{t("TRANSACTION.FEES.MAX")}
					</SelectionBarOption>
				</SelectionBar>
			</div>
		</div>
	);
};

InputFee.defaultProps = {
	magnitude: 8,
};
