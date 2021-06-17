import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

enum InputFeeViewType {
	Simple,
	Advanced,
}

enum InputFeeSimpleValue {
	Slow = "slow",
	Average = "average",
	Fast = "fast",
}

const DEFAULT_SIMPLE_VALUE = InputFeeSimpleValue.Average;
const DEFAULT_VIEW_TYPE = InputFeeViewType.Simple;

type InputFeeSimpleOptions = {
	[key in InputFeeSimpleValue]: {
		label: string;
		displayValue: string;
		displayValueConverted: BigNumber;
	};
};

interface InputFeeAdvancedProperties {
	onChange: (value: string) => void;
	value: string;
	min: string;
	max: string;
	step: number;
	disabled?: boolean;
}

interface InputFeeSimpleProperties {
	options: InputFeeSimpleOptions;
	onChange: (value: InputFeeSimpleValue) => void;
	value: InputFeeSimpleValue;
	ticker: string;
	exchangeTicker: string;
	showConvertedValues: boolean;
	loading?: boolean;
}

interface InputFeeProperties {
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
	onChangeViewType: (value: InputFeeViewType) => void;
	onChangeSimpleValue: (value: InputFeeSimpleValue) => void;
}

export { DEFAULT_SIMPLE_VALUE, DEFAULT_VIEW_TYPE, InputFeeSimpleValue, InputFeeViewType };

export type { InputFeeAdvancedProperties, InputFeeProperties, InputFeeSimpleOptions, InputFeeSimpleProperties };
