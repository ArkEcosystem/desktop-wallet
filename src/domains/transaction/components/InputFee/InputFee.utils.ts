import { BigNumber } from "@arkecosystem/platform-sdk-support";

export enum InputFeeViewType {
	Simple,
	Advanced,
}

export enum InputFeeSimpleValue {
	Slow = "slow",
	Average = "average",
	Fast = "fast",
}

export type InputFeeSimpleOptions = {
	[key in InputFeeSimpleValue]: {
		label: string;
		displayValue: string;
		displayValueConverted: BigNumber;
	};
};
