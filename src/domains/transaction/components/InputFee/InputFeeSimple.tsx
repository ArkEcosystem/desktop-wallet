import { Amount } from "app/components/Amount";
import { ButtonGroup, ButtonGroupOption } from "app/components/ButtonGroup";
import { Skeleton } from "app/components/Skeleton";
import React from "react";

import { InputFeeSimpleOptions, InputFeeSimpleValue } from "./InputFee.utils";

interface Props {
	options: InputFeeSimpleOptions;
	onChange: (value: InputFeeSimpleValue) => void;
	value: InputFeeSimpleValue;
	ticker: string;
	exchangeTicker: string;
	showConvertedValues: boolean;
	loading?: boolean;
}

export const InputFeeSimple = ({
	options,
	onChange,
	value,
	ticker,
	exchangeTicker,
	showConvertedValues,
	loading,
}: Props) => (
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
