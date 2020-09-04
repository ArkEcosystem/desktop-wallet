import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { InputRange } from "app/components/Input";
import { SelectionBar, SelectionBarOption } from "app/components/SelectionBar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type InputFeeProps = {
	defaultValue: string;
	value?: string;
	avg: string;
	min: string;
	max: string;
	step: number;
	onChange?: (value: string) => void;
};

// TODO: Remove defaultValue?
export const InputFee = ({ defaultValue, value, avg, min, max, onChange, step }: InputFeeProps) => {
	const { t } = useTranslation();

	const minHuman = BigNumber.make(min).divide(1e8).toNumber();
	const maxHuman = BigNumber.make(max).divide(1e8).toNumber();

	const [fee, setFee] = useState<string>(defaultValue);

	const handleFeeChange = (fee: any) => {
		onChange?.(fee);
		setFee(fee);
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
						setCheckedValue={handleFeeChange}
					>
						{t("TRANSACTION.FEES.MIN")}
					</SelectionBarOption>

					<SelectionBarOption
						value={avg}
						isValueChecked={() => fee === avg}
						setCheckedValue={handleFeeChange}
					>
						{t("TRANSACTION.FEES.AVERAGE")}
					</SelectionBarOption>
				</SelectionBar>
			</div>
		</div>
	);
};
