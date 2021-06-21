import { Amount, AmountCrypto } from "app/components/Amount";
import { ButtonGroup, ButtonGroupOption } from "app/components/ButtonGroup";
import { InputRange } from "app/components/Input";
import { Skeleton } from "app/components/Skeleton";
import React from "react";

import { InputFeeAdvancedProperties, InputFeeSimpleProperties, InputFeeSimpleValue } from "./InputFee.contracts";

export const InputFeeAdvanced: React.FC<InputFeeAdvancedProperties> = ({
	onChange,
	value,
	min,
	max,
	step,
	disabled,
}: InputFeeAdvancedProperties) => (
	<InputRange disabled={disabled} value={value} min={+min} max={+max} step={step} onChange={onChange} />
);

export const InputFeeSimple: React.FC<InputFeeSimpleProperties> = ({
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
				<div className="flex flex-col space-y-2">
					<div>{label}</div>
					{loading ? (
						<Skeleton width={100} className="my-1 h-3" />
					) : (
						<>
							<AmountCrypto ticker={ticker} value={displayValue} className="text-sm" />
							{showConvertedValues && (
								<Amount
									ticker={exchangeTicker}
									value={displayValueConverted}
									className="text-sm text-theme-secondary-500"
								/>
							)}
						</>
					)}
				</div>
			</ButtonGroupOption>
		))}
	</ButtonGroup>
);
