import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { ButtonGroup, ButtonGroupOption } from "app/components/ButtonGroup";
import { InputRange } from "app/components/Input";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";

export interface InputFeeProps {
	value: string;
	min: BigNumber;
	avg: BigNumber;
	max: BigNumber;
	step: number;
	showFeeOptions?: boolean;
	onChange: (value: string) => void;
}

export const InputFee = memo(({ onChange, step, showFeeOptions, ...props }: InputFeeProps) => {
	const { t } = useTranslation();

	const value = props.value || "";
	const avg = +props.avg;
	const min = +props.min;
	const max = +props.max;

	const handleFeeChange = (feeValue: string): void => {
		onChange(feeValue);
	};

	const isOptionDisabled = (value: number) => value === 0 || (min === avg && avg === max);

	return (
		<div data-testid="InputFee" className="flex space-x-2">
			<div className="flex-1">
				<InputRange
					disabled={!showFeeOptions}
					name="fee"
					value={value}
					min={+min}
					max={+max}
					step={step}
					onChange={handleFeeChange}
				/>
			</div>

			{showFeeOptions && (
				<ButtonGroup>
					<ButtonGroupOption
						disabled={isOptionDisabled(min)}
						value={min}
						isSelected={() => !isOptionDisabled(min) && +value === min}
						setSelectedValue={() => handleFeeChange(`${min}`)}
					>
						{t("TRANSACTION.FEES.SLOW")}
					</ButtonGroupOption>

					<ButtonGroupOption
						disabled={isOptionDisabled(avg)}
						value={avg}
						isSelected={() => !isOptionDisabled(avg) && +value === avg}
						setSelectedValue={() => handleFeeChange(`${avg}`)}
					>
						{t("TRANSACTION.FEES.AVERAGE")}
					</ButtonGroupOption>

					<ButtonGroupOption
						disabled={isOptionDisabled(max)}
						value={max}
						isSelected={() => !isOptionDisabled(max) && +value === max}
						setSelectedValue={() => handleFeeChange(`${max}`)}
					>
						{t("TRANSACTION.FEES.FAST")}
					</ButtonGroupOption>
				</ButtonGroup>
			)}
		</div>
	);
});

InputFee.displayName = "InputFee";
