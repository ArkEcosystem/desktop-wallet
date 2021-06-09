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
		<ButtonGroup className="w-full">
			{options.map(({ label, value: optionValue, valueConverted }, index) => (
				<ButtonGroupOption
					className="w-full justify-center py-2"
					key={index}
					disabled={isDisabled(optionValue)}
					value={min}
					isSelected={() => !isDisabled(optionValue) && value === optionValue}
					setSelectedValue={() => onChange(`${optionValue}`)}
				>
					<div>
						<div className="text-lg mb-1">{label}</div>
						{loading ? (
							<Skeleton width={100} className="h-4 mt-1 mb-2" />
						) : (
							<>
								<div>
									{optionValue} {ticker}
								</div>
								{showConvertedValues && (
									<div className="text-sm font-normal mt-1">
										<Amount normalize ticker={exchangeTicker} value={valueConverted} />
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
