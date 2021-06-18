import { Amount } from "app/components/Amount";
import { ButtonGroup, ButtonGroupOption } from "app/components/ButtonGroup";
import { InputRange } from "app/components/Input";
import { Skeleton } from "app/components/Skeleton";
import React from "react";

import { InputFeeAdvancedProperties, InputFeeSimpleProperties, InputFeeSimpleValue } from "./InputFee.contracts";

export const InputFeeAdvanced = ({ onChange, value, min, max, step, disabled }: InputFeeAdvancedProperties) => (
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
}: InputFeeSimpleProperties) => (
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
						<Skeleton width={100} className="my-1 h-3" />
					) : (
						<>
							<div className="text-sm font-normal">
								{displayValue} {ticker}
							</div>
							{showConvertedValues && (
								<div className="mt-3 text-sm font-normal text-theme-secondary-500">
									<Amount ticker={exchangeTicker} value={displayValueConverted} />
								</div>
							)}
						</>
					)}
				</div>
			</ButtonGroupOption>
		))}
	</ButtonGroup>
);
