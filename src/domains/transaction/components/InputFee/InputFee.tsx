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
	showFeeOptions?: boolean;
	onChange?: (value: { display: string; value: string }) => void;
};

export type InputFee = {
	display: string;
	value: string;
};

export const InputFee = memo(
	({ defaultValue, value, avg, min, max, onChange, step, showFeeOptions }: InputFeeProps) => {
		const { t } = useTranslation();

		const { fee, toHuman, updateFee } = useFeeFormat({ defaultValue, value, avg });

		const avgHuman = toHuman(avg);
		const minHuman = toHuman(min);
		const maxHuman = toHuman(max);

		const handleFeeChange = (currency: InputFee) => {
			updateFee(currency);
			onChange?.(currency);
		};

		const isOptionDisabled = (value: string) => value === "0" || (min === avg && avg === max);

		return (
			<div data-testid="InputFee" className="flex space-x-2">
				<div className="flex-1">
					<InputRange
						disabled={!showFeeOptions}
						name="fee"
						avg={avgHuman}
						value={fee}
						min={minHuman}
						max={maxHuman}
						step={step}
						onChange={handleFeeChange}
					/>
				</div>

				{showFeeOptions && (
					<ButtonGroup>
						<ButtonGroupOption
							disabled={isOptionDisabled(min)}
							value={minHuman}
							isSelected={() => !isOptionDisabled(min) && fee.value === min}
							setSelectedValue={() => handleFeeChange({ display: minHuman, value: min })}
						>
							{t("TRANSACTION.FEES.SLOW")}
						</ButtonGroupOption>

						<ButtonGroupOption
							disabled={isOptionDisabled(avg)}
							value={avgHuman}
							isSelected={() => !isOptionDisabled(avg) && fee.value === avg}
							setSelectedValue={() => handleFeeChange({ display: avgHuman, value: avg })}
						>
							{t("TRANSACTION.FEES.AVERAGE")}
						</ButtonGroupOption>

						<ButtonGroupOption
							disabled={isOptionDisabled(max)}
							value={maxHuman}
							isSelected={() => !isOptionDisabled(max) && fee.value === max}
							setSelectedValue={() => handleFeeChange({ display: maxHuman, value: max })}
						>
							{t("TRANSACTION.FEES.FAST")}
						</ButtonGroupOption>
					</ButtonGroup>
				)}
			</div>
		);
	},
);
