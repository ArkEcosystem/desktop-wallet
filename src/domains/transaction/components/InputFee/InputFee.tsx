import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Switch } from "app/components/Switch";
import { useExchangeRate } from "app/hooks/use-exchange-rate";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";

import { InputFeeAdvanced } from "./InputFeeAdvanced";
import { InputFeeSimple } from "./InputFeeSimple";

export enum InputFeeViewType {
	Simple = "simple",
	Advanced = "advanced",
}

const DEFAULT_VIEW_TYPE = InputFeeViewType.Simple;

interface Props {
	value: string;
	min: string;
	avg: string;
	max: string;
	step: number;
	disabled?: boolean;
	onChange: (value: string) => void;
	network?: Networks.Network;
	profile?: Contracts.IProfile;
	loading?: boolean;
	viewType?: InputFeeViewType;
	onChangeViewType: (viewType: InputFeeViewType) => void;
}

export const InputFee = memo(
	({
		onChange,
		step,
		disabled,
		network,
		loading,
		avg,
		min,
		max,
		value,
		profile,
		onChangeViewType,
		...props
	}: Props) => {
		const { t } = useTranslation();

		const viewType = props.viewType ?? DEFAULT_VIEW_TYPE;

		const ticker = network?.ticker();
		const exchangeTicker = profile?.settings().get<string>(Contracts.ProfileSetting.ExchangeCurrency);
		const { convert } = useExchangeRate({ ticker, exchangeTicker });

		if (disabled) {
			// @TODO update when implementing InputFeeAdvanced
			return <InputFeeAdvanced disabled min={min} max={max} step={step} value={value} onChange={onChange} />;
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

				{viewType === InputFeeViewType.Simple ? (
					<InputFeeSimple
						min={min}
						max={max}
						avg={avg}
						minConverted={convert(min)}
						maxConverted={convert(max)}
						avgConverted={convert(avg)}
						value={value}
						loading={loading || !ticker || !exchangeTicker}
						ticker={ticker!}
						exchangeTicker={exchangeTicker!}
						onChange={onChange}
						showConvertedValues={!!network?.isLive()}
					/>
				) : (
					<InputFeeAdvanced min={min} max={max} step={step} value={value} onChange={onChange} />
				)}
			</div>
		);
	},
);
