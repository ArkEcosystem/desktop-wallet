import { InputRange } from "app/components/Input";
import { SelectionBar, SelectionBarOption } from "app/components/SelectionBar";
import React from "react";
import { useTranslation } from "react-i18next";

import { useFeeFormat } from "./hooks";

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
