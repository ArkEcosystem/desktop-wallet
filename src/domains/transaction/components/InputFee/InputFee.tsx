import { ButtonGroup, ButtonGroupOption } from "app/components/ButtonGroup";
import { InputRange } from "app/components/Input";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";

import { useFeeFormat } from "./hooks";

export type InputFeeProps = {
	defaultValue?: any;
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
export const InputFee = memo(({ defaultValue, value, avg, min, max, onChange, step }: InputFeeProps) => {
	const { t } = useTranslation();

	const { fee, toHuman, updateFee } = useFeeFormat({ defaultValue, value, avg });

	const avgHuman = toHuman(avg);
	const minHuman = toHuman(min);
	const maxHuman = toHuman(max);

	const handleFeeChange = (currency: InputFee) => {
		updateFee(currency);
		onChange?.(currency);
	};

	const isDisabled = (value: string) => value === "0" || (min === avg && avg === max);

	return (
		<div data-testid="InputFee" className="flex space-x-2">
			<div className="flex-1">
				<InputRange
					name="fee"
					avg={avgHuman}
					value={fee}
					min={minHuman}
					max={maxHuman}
					step={step}
					onChange={handleFeeChange}
				/>
			</div>

			<ButtonGroup>
				<ButtonGroupOption
					disabled={isDisabled(min)}
					value={minHuman}
					isSelected={() => !isDisabled(min) && fee.value === min}
					setSelectedValue={() => handleFeeChange({ display: minHuman, value: min })}
				>
					{t("TRANSACTION.FEES.SLOW")}
				</ButtonGroupOption>

				<ButtonGroupOption
					disabled={isDisabled(avg)}
					value={avgHuman}
					isSelected={() => !isDisabled(avg) && fee.value === avg}
					setSelectedValue={() => handleFeeChange({ display: avgHuman, value: avg })}
				>
					{t("TRANSACTION.FEES.AVERAGE")}
				</ButtonGroupOption>

				<ButtonGroupOption
					disabled={isDisabled(max)}
					value={maxHuman}
					isSelected={() => !isDisabled(max) && fee.value === max}
					setSelectedValue={() => handleFeeChange({ display: maxHuman, value: max })}
				>
					{t("TRANSACTION.FEES.FAST")}
				</ButtonGroupOption>
			</ButtonGroup>
		</div>
	);
});
