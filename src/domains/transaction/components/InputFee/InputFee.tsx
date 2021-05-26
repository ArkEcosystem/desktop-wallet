import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { ButtonGroup, ButtonGroupOption } from "app/components/ButtonGroup";
import { InputRange } from "app/components/Input";
import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";

export type InputFeeProps = {
	defaultValue?: string;
	value?: string;
	min: string;
	avg: string;
	max: string;
	step: number;
	showFeeOptions?: boolean;
	onChange?: (value: string) => void;
};

export const InputFee = memo(({ onChange, step, showFeeOptions, ...props }: InputFeeProps) => {
	const { t } = useTranslation();

	// @TODO remove this after sdk update: no transformation should be applied on the values
	const toHuman = (value: string): string => BigNumber.make(value ?? "0").toHuman();

	const defaultValue = toHuman(props.defaultValue ?? "0");
	const value = toHuman(props.value ?? "0");
	const avg = +toHuman(props.avg);
	const min = +toHuman(props.min);
	const max = +toHuman(props.max);

	const [fee, setFee] = useState<string>(value || defaultValue || `${avg}`);

	const handleFeeChange = (feeValue: string): void => {
		setFee(feeValue);
		onChange?.(feeValue);
	};

	console.log({
		defaultValue,
		value,
		avg,
		min,
		max,
	});

	const isOptionDisabled = (value: number) => value === 0 || (min === avg && avg === max);

	return (
		<div data-testid="InputFee" className="flex space-x-2">
			<div className="flex-1">
				<InputRange
					disabled={!showFeeOptions}
					name="fee"
					value={fee}
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
						isSelected={() => !isOptionDisabled(min) && +fee === min}
						setSelectedValue={() => handleFeeChange(`${min}`)}
					>
						{t("TRANSACTION.FEES.SLOW")}
					</ButtonGroupOption>

					<ButtonGroupOption
						disabled={isOptionDisabled(avg)}
						value={avg}
						isSelected={() => !isOptionDisabled(avg) && +fee === avg}
						setSelectedValue={() => handleFeeChange(`${avg}`)}
					>
						{t("TRANSACTION.FEES.AVERAGE")}
					</ButtonGroupOption>

					<ButtonGroupOption
						disabled={isOptionDisabled(max)}
						value={max}
						isSelected={() => !isOptionDisabled(max) && +fee === max}
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
