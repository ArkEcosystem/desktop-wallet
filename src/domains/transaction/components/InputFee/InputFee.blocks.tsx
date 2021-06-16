import { Amount } from "app/components/Amount";
import { ButtonGroup, ButtonGroupOption } from "app/components/ButtonGroup";
import { InputRange } from "app/components/Input";
import { Skeleton } from "app/components/Skeleton";
import React from "react";

import { InputFeeAdvancedProps, InputFeeSimpleProps, InputFeeSimpleValue } from "./InputFee.contracts";

export const InputFeeAdvanced = ({ onChange, value, min, max, step, disabled }: InputFeeAdvancedProps) => (
	<InputRange disabled={disabled} value={value} min={+min} max={+max} step={step} onChange={onChange} />
);

export const InputFeeSimple = ({
	options,
	onChange,
	value,
	ticker,
	exchangeTicker,
	showConvertedValues,
	loading,
}: InputFeeSimpleProps) => (
	<ButtonGroup>
		{Object.entries(options).map(([optionValue, { label, displayValue, displayValueConverted }]) => (
			<ButtonGroupOption
				key={optionValue}
				value={displayValue}
				isSelected={() => optionValue === value}
				setSelectedValue={() => onChange(optionValue as InputFeeSimpleValue)}
			>
				<div>
					<div className="mb-3">{label}</div>
					{loading ? (
						<Skeleton width={100} className="h-3 my-1" />
					) : (
						<>
							<div className="font-normal text-sm">
								{displayValue} {ticker}
							</div>
							{showConvertedValues && (
								<div className="font-normal text-sm text-theme-secondary-500 mt-3">
									<Amount normalize={false} ticker={exchangeTicker} value={displayValueConverted} />
								</div>
							)}
						</>
					)}
				</div>
			</ButtonGroupOption>
		))}
	</ButtonGroup>
);
