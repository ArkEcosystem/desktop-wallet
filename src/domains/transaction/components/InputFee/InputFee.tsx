import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { InputRange } from "app/components/Input";
import { SelectionBar, SelectionBarOption } from "app/components/SelectionBar";
import React, { useEffect, useState } from "react";
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

// TODO: Remove defaultValue?
export const InputFee = ({ defaultValue, value, avg, min, max, onChange, step }: InputFeeProps) => {
	const { t } = useTranslation();

	const minHuman = BigNumber.make(min).divide(1e8).toString();
	const maxHuman = BigNumber.make(max).divide(1e8).toString();
	const avgHuman = BigNumber.make(avg).divide(1e8).toString();

	const [fee, setFee] = useState<any>(defaultValue);

	const handleFeeChange = (currency: { display: string; value: string }) => {
		setFee(currency);
		onChange?.(currency);
	};

	useEffect(() => {
		if (value && value !== fee) {
			const amount = BigNumber.make(value).divide(1e8).toString();
			setFee(amount);
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
