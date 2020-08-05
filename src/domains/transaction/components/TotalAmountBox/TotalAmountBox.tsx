import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Icon } from "app/components/Icon";
import React from "react";

type Props = {
	amount: BigNumber;
	fee: BigNumber;
};

export const TotalAmountBox = ({ amount, fee }: Props) => (
	<div className="border-theme-neutral-300 border rounded-lg">
		<div className="relative p-3">
			<div className="grid grid-cols-2 divide-x divide-gray-400">
				<div className="flex flex-col justify-center px-6 py-5">
					<span className="text-theme-neutral text-sm">Transaction(s) Amount</span>
					<span className="mt-2 font-semibold" data-testid="total-amount-box__transaction-amount">
						{amount.toHuman(8)} ARK
					</span>
				</div>

				<div className="flex flex-col justify-center px-6 py-5 text-right">
					<span className="text-theme-neutral text-sm">Transaction fee</span>
					<span className="mt-2 text-lg font-semibold" data-testid="total-amount-box__transaction-fee">
						{fee.toHuman(8)} ARK
					</span>
				</div>
			</div>

			<div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center h-full text-center">
				<div className="px-1 py-2 bg-white">
					<Icon name="Plus" width={15} height={15} />
				</div>
			</div>
		</div>
		<div className="border-theme-neutral-300 justfiy-center py-7 bg-theme-neutral-contrast flex flex-col items-center border-t rounded-b-lg">
			<span className="text-theme-neutral text-sm">Total Amount</span>
			<span className="text-2xl font-bold" data-testid="total-amount-box__total">
				{amount.plus(fee).toHuman(8)} ARK
			</span>
		</div>
	</div>
);
