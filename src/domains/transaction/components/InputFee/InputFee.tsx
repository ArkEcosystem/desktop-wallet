import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { isNil } from "@arkecosystem/utils";
import { Switch } from "app/components/Switch";
import { useExchangeRate } from "app/hooks/use-exchange-rate";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { InputFeeAdvanced, InputFeeSimple } from "./InputFee.blocks";
import {
	DEFAULT_SIMPLE_VALUE,
	DEFAULT_VIEW_TYPE,
	InputFeeProperties,
	InputFeeSimpleOptions,
	InputFeeSimpleValue,
	InputFeeViewType,
} from "./InputFee.contracts";

export const InputFee: React.FC<InputFeeProperties> = memo(
	({
		min,
		avg,
		max,
		step,
		disabled,
		network,
		profile,
		loading,
		onChange,
		value,
		...properties
	}: InputFeeProperties) => {
		const { t } = useTranslation();

		const viewType = properties.viewType ?? DEFAULT_VIEW_TYPE;
		const simpleValue = properties.simpleValue ?? DEFAULT_SIMPLE_VALUE;
		const [advancedValue, setAdvancedValue] = useState(value);

		useEffect(() => {
			const setDefaultAdvancedValue = () => {
				if (avg && isNil(advancedValue)) {
					setAdvancedValue(avg.toString());
				}
			};

			setDefaultAdvancedValue();
		}, [avg, advancedValue]);

		const ticker = network?.ticker();
		const exchangeTicker = profile?.settings().get<string>(Contracts.ProfileSetting.ExchangeCurrency);
		const { convert } = useExchangeRate({ ticker, exchangeTicker });

		const options: InputFeeSimpleOptions = {
			[InputFeeSimpleValue.Slow]: {
				label: t("TRANSACTION.FEES.SLOW"),
				displayValue: min,
				displayValueConverted: convert(min),
			},
			[InputFeeSimpleValue.Average]: {
				label: t("TRANSACTION.FEES.AVERAGE"),
				displayValue: avg,
				displayValueConverted: convert(avg),
			},
			[InputFeeSimpleValue.Fast]: {
				label: t("TRANSACTION.FEES.FAST"),
				displayValue: max,
				displayValueConverted: convert(max),
			},
		};

		const onChangeViewType = (newValue: InputFeeViewType) => {
			properties.onChangeViewType(newValue);

			if (newValue === InputFeeViewType.Simple) {
				const feeValue = options[simpleValue].displayValue;
				onChange(feeValue.toString());
			}

			if (newValue === InputFeeViewType.Advanced) {
				/* istanbul ignore next */
				onChange(advancedValue ?? "");
			}
		};

		const onChangeSimpleValue = (newValue: InputFeeSimpleValue) => {
			properties.onChangeSimpleValue(newValue);

			const feeValue = options[newValue].displayValue;
			onChange(feeValue.toString());
		};

		const onChangeAdvancedValue = (newValue: string) => {
			setAdvancedValue(newValue);
			onChange(newValue);
		};

		if (disabled) {
			return (
				<InputFeeAdvanced
					disabled
					min={min}
					max={max}
					step={step}
					value={advancedValue ?? ""}
					onChange={onChangeAdvancedValue}
				/>
			);
		}

		return (
			<div data-testid="InputFee" className="relative">
				<div className="absolute right-0 -mt-7">
					<Switch
						disabled={loading}
						size="sm"
						value={viewType}
						onChange={onChangeViewType}
						leftOption={{
							label: t("TRANSACTION.INPUT_FEE_VIEW_TYPE.SIMPLE"),
							value: InputFeeViewType.Simple,
						}}
						rightOption={{
							label: t("TRANSACTION.INPUT_FEE_VIEW_TYPE.ADVANCED"),
							value: InputFeeViewType.Advanced,
						}}
					/>
				</div>

				{viewType === InputFeeViewType.Simple && (
					<InputFeeSimple
						options={options}
						loading={loading || !ticker || !exchangeTicker}
						ticker={ticker!}
						exchangeTicker={exchangeTicker!}
						showConvertedValues={!!network?.isLive()}
						value={simpleValue}
						onChange={onChangeSimpleValue}
					/>
				)}

				{viewType === InputFeeViewType.Advanced && (
					<InputFeeAdvanced
						min={min}
						max={max}
						step={step}
						value={advancedValue ?? ""}
						onChange={onChangeAdvancedValue}
					/>
				)}
			</div>
		);
	},
);
