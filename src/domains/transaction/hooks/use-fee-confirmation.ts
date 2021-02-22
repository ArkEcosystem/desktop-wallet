import { TransactionFee } from "@arkecosystem/platform-sdk/dist/contracts";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { FeeWarningVariant } from "domains/transaction/components/FeeWarning";
import { useEffect, useState } from "react";

export const useFeeConfirmation = (fee: number | string, fees: TransactionFee) => {
	const [requireFeeConfirmation, setRequireFeeConfirmation] = useState<FeeWarningVariant | undefined>();

	useEffect(() => {
		if (!fee) {
			return;
		}

		const value = BigNumber.make(fee);

		if (value.isLessThan(fees?.min)) {
			setRequireFeeConfirmation(FeeWarningVariant.Low);
		}

		if (value.isGreaterThan(fees?.static)) {
			setRequireFeeConfirmation(FeeWarningVariant.High);
		}

		if (value.isGreaterThanOrEqualTo(fees?.min) && value.isLessThanOrEqualTo(fees?.static)) {
			setRequireFeeConfirmation(undefined);
		}
	}, [fee, fees]);

	return { requireFeeConfirmation };
};
