import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Switch } from "app/components/Switch";
import { useExchangeRate } from "app/hooks/use-exchange-rate";
import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";

import { InputFeeSimpleOptions, InputFeeSimpleValue, InputFeeViewType } from "./InputFee.utils";
import { InputFeeAdvanced } from "./InputFeeAdvanced";
import { InputFeeSimple } from "./InputFeeSimple";

interface InputFeeProps {
	min: string;
	avg: string;
	max: string;
	step: number;
	disabled?: boolean;
	network?: Networks.Network;
	profile?: Contracts.IProfile;
	loading?: boolean;
	viewType?: InputFeeViewType;
	simpleValue?: InputFeeSimpleValue;
	value: string;
	onChange: (value: string) => void;
	onChangeViewType?: (value: InputFeeViewType) => void;
	onChangeSimpleValue?: (value: InputFeeSimpleValue) => void;
}

const DEFAULT_VIEW_TYPE = InputFeeViewType.Simple;
const DEFAULT_SIMPLE_VALUE = InputFeeSimpleValue.Average;

export const InputFee = memo(
	({ min, avg, max, step, disabled, network, profile, loading, onChange, value, ...props }: InputFeeProps) => {
		const { t } = useTranslation();

		const viewType = props.viewType ?? DEFAULT_VIEW_TYPE;
		const simpleValue = props.simpleValue ?? DEFAULT_SIMPLE_VALUE;
		const [advancedValue, setAdvancedValue] = useState<string>(value || avg);

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

		const onChangeViewType = (val: InputFeeViewType) => {
			props.onChangeViewType?.(val);

			if (val === InputFeeViewType.Simple) {
				onChange(simpleValue);
			}

			if (val === InputFeeViewType.Advanced) {
				onChange(advancedValue);
			}
		};

		const onChangeSimpleValue = (val: InputFeeSimpleValue) => {
			props.onChangeSimpleValue?.(val);

			const feeValue = options[val].displayValue;
			onChange(feeValue);
		};

		const onChangeAdvancedValue = (val: string) => {
			setAdvancedValue(val);
			onChange(val);
		};

		if (disabled) {
			// @TODO update when implementing InputFeeAdvanced
			return (
				<InputFeeAdvanced
					disabled
					min={min}
					max={max}
					step={step}
					value={advancedValue}
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
						value={advancedValue}
						onChange={onChangeAdvancedValue}
					/>
				)}
			</div>
		);
	},
);
