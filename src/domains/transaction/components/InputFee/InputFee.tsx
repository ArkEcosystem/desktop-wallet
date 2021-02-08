import { InputRange } from "app/components/Input";
import { ButtonGroup, ButtonGroupOption } from "app/components/ButtonGroup";
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
					disabled={!min}
					value={minHuman}
					isSelected={() => !!min && fee.display === minHuman}
					setSelectedValue={() => handleFeeChange({ display: minHuman, value: min })}
				>
					{t("TRANSACTION.FEES.SLOW")}
				</ButtonGroupOption>

				<ButtonGroupOption
					disabled={!avg}
					value={avgHuman}
					isSelected={() => !!avg && fee.display === avgHuman}
					setSelectedValue={() => handleFeeChange({ display: avgHuman, value: avg })}
				>
					{t("TRANSACTION.FEES.AVERAGE")}
				</ButtonGroupOption>

				<ButtonGroupOption
					disabled={!max}
					value={maxHuman}
					isSelected={() => !!max && fee.display === maxHuman}
					setSelectedValue={() => handleFeeChange({ display: maxHuman, value: max })}
				>
					{t("TRANSACTION.FEES.FAST")}
				</ButtonGroupOption>
			</ButtonGroup>
		</div>
	);
});
