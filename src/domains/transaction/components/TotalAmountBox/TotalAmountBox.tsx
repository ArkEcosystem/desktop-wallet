import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Amount } from "app/components/Amount";
import { Icon } from "app/components/Icon";
import React from "react";

type Props = {
	amount: BigNumber;
	fee: BigNumber;
};

export const TotalAmountBox = ({ amount, fee }: Props) => (
	<div className="border rounded-lg border-theme-neutral-300">
		<div className="relative p-3">
			<div className="grid grid-cols-2 divide-x divide-gray-400">
				<div className="flex flex-col justify-center px-6 py-5">
					<span className="text-sm text-theme-neutral">Transaction(s) Amount</span>
					<Amount
						className="mt-2 font-semibold"
						data-testid="total-amount-box__transaction-amount"
						ticker="ARK"
						value={amount}
					/>
				</div>

				<div className="flex flex-col justify-center px-6 py-5 text-right">
					<span className="text-sm text-theme-neutral">Transaction fee</span>
					<Amount
						ticker="ARK"
						value={fee}
						className="mt-2 text-lg font-semibold"
						data-testid="total-amount-box__transaction-fee"
					/>
				</div>
			</div>

			<div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center h-full text-center">
				<div className="px-1 py-2 bg-white">
					<Icon name="Plus" width={15} height={15} />
				</div>
			</div>
		</div>
		<div className="flex flex-col items-center border-t rounded-b-lg border-theme-neutral-300 justfiy-center py-7 bg-theme-neutral-contrast">
			<span className="text-sm text-theme-neutral">Total Amount</span>
			<Amount
				ticker="ARK"
				value={amount.plus(fee)}
				className="text-2xl font-bold"
				data-testid="total-amount-box__total"
			/>
		</div>
	</div>
);
