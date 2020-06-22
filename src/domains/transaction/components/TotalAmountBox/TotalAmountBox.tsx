import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Icon } from "app/components/Icon";
import React from "react";

type Props = {
	transactionAmount: string;
	transactionFee: string;
	magnitude?: number;
};

export const TotalAmountBox = ({ transactionAmount, transactionFee, magnitude }: Props) => {
	const totalAmount = BigNumber.make(transactionAmount).plus(transactionFee).decimalPlaces(magnitude).toFixed();

	return (
		<div className="border rounded-lg border-theme-neutral-300">
			<div className="relative p-3">
				<div className="grid grid-cols-2 divide-x divide-gray-400">
					<div className="flex flex-col justify-center px-6 py-5">
						<span className="text-sm text-theme-neutral-500">Transaction(s) Amount</span>
						<span className="mt-3" data-testid="total-amount-box__transaction-amount">
							{transactionAmount} ARK
						</span>
					</div>

					<div className="flex flex-col justify-center px-6 py-5 text-right">
						<span className="text-sm text-theme-neutral-500">Transaction fee</span>
						<span className="mt-3 mr-2" data-testid="total-amount-box__transaction-fee">
							{transactionFee} ARK
						</span>
					</div>
				</div>

				<div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center h-full text-center">
					<div className="px-1 py-2 bg-white">
						<Icon name="Plus" width={15} height={15} />
					</div>
				</div>
			</div>
			<div className="flex flex-col items-center border-t rounded-b-lg border-theme-neutral-300 justfiy-center py-7 bg-theme-neutral-100">
				<span className="text-sm text-theme-neutral-500">Total Amount</span>
				<span className="text-2xl font-bold" data-testid="total-amount-box__total">
					{totalAmount} ARK
				</span>
			</div>
		</div>
	);
};

TotalAmountBox.defaultProps = {
	magnitude: 8,
};
