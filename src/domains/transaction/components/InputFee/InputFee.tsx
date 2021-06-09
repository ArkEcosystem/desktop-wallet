import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Switch } from "app/components/Switch";
import { useActiveProfile } from "app/hooks";
import { useExchangeRate } from "app/hooks/use-exchange-rate";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { InputFeeAdvanced } from "./InputFeeAdvanced";
import { InputFeeSimple } from "./InputFeeSimple";

enum ViewType {
	Simple,
	Advanced,
}

interface Props {
	value: string;
	min: string;
	avg: string;
	max: string;
	step: number;
	showFeeOptions?: boolean;
	onChange: (value: string) => void;
	network?: Networks.Network;
	loading?: boolean;
}

export const InputFee = ({ onChange, step, showFeeOptions, network, loading, avg, min, max, value }: Props) => {
	const { t } = useTranslation();
	const profile = useActiveProfile();

	const [viewType, setViewType] = useState<ViewType>(ViewType.Simple);

	const ticker = network?.ticker();
	const exchangeTicker = profile.settings().get(Contracts.ProfileSetting.ExchangeCurrency) as string;
	const { convert } = useExchangeRate({ ticker, exchangeTicker });

	return (
		<div data-testid="InputFee" className="relative">
			<div className="absolute right-0 -mt-7">
				<Switch
					small
					value={viewType}
					onChange={setViewType}
					leftOption={{
						label: t("TRANSACTION.INPUT_FEE_VIEW_TYPE.SIMPLE"),
						value: ViewType.Simple,
					}}
					rightOption={{
						label: t("TRANSACTION.INPUT_FEE_VIEW_TYPE.ADVANCED"),
						value: ViewType.Advanced,
					}}
				/>
			</div>

			{viewType === ViewType.Simple ? (
				<InputFeeSimple
					min={min}
					max={max}
					avg={avg}
					minConverted={convert(min)}
					maxConverted={convert(max)}
					avgConverted={convert(avg)}
					value={value}
					loading={loading || !ticker}
					ticker={ticker!}
					exchangeTicker={exchangeTicker}
					onChange={onChange}
					showConvertedValues={!!network?.isLive()}
				/>
			) : (
				<InputFeeAdvanced value={value} onChange={onChange} />
			)}
		</div>
	);
};
