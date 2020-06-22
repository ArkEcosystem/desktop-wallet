import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Icon } from "app/components/Icon";
import React from "react";

type Props = {
	transactionAmount: string;
	transactionFee: string;
	magnitude?: number;
};

export const TotalAmountBox = ({ transactionAmount, transactionFee, magnitude }: Props) => {
	const totalAmount = new BigNumber(transactionAmount).plus(transactionFee).decimalPlaces(magnitude).toFixed();

	return (
		<div className="border border-theme-neutral-300 rounded-lg">
			<div className="relative p-3">
				<div className="grid grid-cols-2 divide-x divide-gray-400">
					<div className="flex flex-col justify-center px-6 py-5">
						<span className="text-sm text-theme-neutral-500">Transaction(s) Amount</span>
						<span className="mt-3" data-testid="total-amount-box__transaction-amount">
							{transactionAmount} ARK
						</span>
					</div>

					<div className="flex flex-col justify-center text-right px-6 py-5">
						<span className="text-sm text-theme-neutral-500">Transaction fee</span>
						<span className="mt-3 mr-2" data-testid="total-amount-box__transaction-fee">
							{transactionFee} ARK
						</span>
					</div>
				</div>

				<div className="absolute flex items-center justify-center h-full top-0 bottom-0 left-0 right-0 text-center">
					<div className="bg-white px-1 py-2">
						<Icon name="Plus" width={15} height={15} />
					</div>
				</div>
			</div>
			<div className="border-t border-theme-neutral-300 rounded-b-lg flex flex-col justfiy-center items-center py-7 bg-theme-neutral-100">
				<span className="text-sm text-theme-neutral-500">Total Amount</span>
				<span className="font-bold text-2xl" data-testid="total-amount-box__total">
					{totalAmount} ARK
				</span>
			</div>
		</div>
	);
};

TotalAmountBox.defaultProps = {
	magnitude: 8,
};
