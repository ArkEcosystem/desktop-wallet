import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

type SufficientFundsParams = {
	wallet: ReadWriteWallet;
	fee?: any;
	amount?: any;
};

export const evaluateFee = (fee: any) => {
	if (fee?.value) return BigNumber.make(fee.value);

	return BigNumber.make(fee);
};

export const hasSufficientFunds = ({ wallet, fee = 0, amount = 0 }: SufficientFundsParams) => {
	const feeValue = evaluateFee(fee);
	const total = feeValue.plus(amount);

	return wallet.balance().isGreaterThanOrEqualTo(total);
};
