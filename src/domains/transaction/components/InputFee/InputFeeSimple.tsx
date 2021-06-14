import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Amount } from "app/components/Amount";
import { ButtonGroup, ButtonGroupOption } from "app/components/ButtonGroup";
import { Skeleton } from "app/components/Skeleton";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
	avg: string;
	max: string;
	min: string;
	avgConverted: BigNumber;
	maxConverted: BigNumber;
	minConverted: BigNumber;
	onChange: (value: string) => void;
	value: string;
	ticker: string;
	exchangeTicker: string;
	showConvertedValues: boolean;
	loading?: boolean;
}

export const InputFeeSimple = ({
	avg,
	max,
	min,
	avgConverted,
	maxConverted,
	minConverted,
	onChange,
	value,
	ticker,
	exchangeTicker,
	showConvertedValues,
	loading,
}: Props) => {
	const { t } = useTranslation();

	const isDisabled = (val: string) => !+val || (min === avg && avg === max);
	const isSelected = (val: string) => !isDisabled(val) && val === value;

	const options: { label: string; value: string; valueConverted: BigNumber }[] = [
		{
			label: t("TRANSACTION.FEES.SLOW"),
			value: min,
			valueConverted: minConverted,
		},
		{
			label: t("TRANSACTION.FEES.AVERAGE"),
			value: avg,
			valueConverted: avgConverted,
		},
		{
			label: t("TRANSACTION.FEES.FAST"),
			value: max,
			valueConverted: maxConverted,
		},
	];

	return (
		<ButtonGroup>
			{options.map(({ label, value: optionValue, valueConverted }, index) => (
				<ButtonGroupOption
					key={index}
					disabled={isDisabled(optionValue)}
					value={optionValue}
					isSelected={() => isSelected(optionValue)}
					setSelectedValue={() => onChange(`${optionValue}`)}
				>
					<div>
						<div className="mb-3">{label}</div>
						{loading ? (
							<Skeleton width={100} className="h-3 my-1" />
						) : (
							<>
								<div className="font-normal text-sm">
									{optionValue} {ticker}
								</div>
								{showConvertedValues && (
									<div className="font-normal text-sm text-theme-secondary-500 mt-3">
										<Amount normalize={false} ticker={exchangeTicker} value={valueConverted} />
									</div>
								)}
							</>
						)}
					</div>
				</ButtonGroupOption>
			))}
		</ButtonGroup>
	);
};
