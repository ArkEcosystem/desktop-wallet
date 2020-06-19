import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Icon } from "app/components/Icon";
import React from "react";

type Props = {
	transactionAmount: string;
	transactionFee: string;
};

export const TotalAmountBox = ({ transactionAmount, transactionFee }: Props) => {
	const calculateValue = (value) => {
		const fraction = Math.pow(10, magnitude! * -1);
		const amount = BigNumber.make(value).times(fraction);

		return amount.toNumber();
	};

	return (
		<div className="w-full border border-theme-neutral-300 rounded-lg">
			<div className="mt-1 py-5 flex justify-between items-center px-10">
				<div className="flex flex-col">
					<span className="text-sm text-theme-neutral-500">Transaction(s) Amount</span>
					<span className="mt-3">1.00 ARK</span>
				</div>

				<div className="mr-3">
					<Icon name="Plus" />
				</div>

				<div className="flex flex-col text-right">
					<span className="text-sm text-theme-neutral-500">Transaction fee</span>
					<span className="mt-3 mr-3">0.09660435 ARK</span>
				</div>
			</div>
			<div className="border-t border-theme-neutral-300 rounded-b-lg flex flex-col justfiy-center items-center py-7 bg-theme-neutral-100">
				<span className="text-sm text-theme-neutral-500">Total Amount</span>
				<span className="font-bold text-2xl">1.09660435 ARK</span>
			</div>
		</div>
	);
};
