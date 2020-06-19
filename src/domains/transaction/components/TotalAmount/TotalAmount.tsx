import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Icon } from "app/components/Icon";
import React from "react";

type Props = {
	transactionAmount: string;
	transactionFee: string;
};

export const TotalAmount = ({ transactionAmount, transactionFee }: Props) => {
	const calculateValue = (value) => {
		const fraction = Math.pow(10, magnitude! * -1);
		const amount = BigNumber.make(value).times(fraction);

		return amount.toNumber();
	};

	return (
		<div className="w-full border rounded-lg">
			<div className="py-5 flex justify-between items-center px-10">
				<div className="flex flex-col">
					<span>Transaction(s) Amount</span>
					<span>1.00 ARK</span>
				</div>
				<div className="border-r">
					<Icon name="Plus" />
				</div>
				<div className="flex flex-col">
					<span>Transaction fee</span>
					<span>0.09660435 ARK</span>
				</div>
			</div>
			<div className="border-t flex flex-col justfiy-center items-center py-5">
				<span>Total Amount</span>
				<span className="font-bold text-2xl">1.09660435 ARK</span>
			</div>
		</div>
	);
};
