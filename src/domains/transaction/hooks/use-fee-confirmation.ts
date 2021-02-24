import { TransactionFee } from "@arkecosystem/platform-sdk/dist/contracts";
import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks";
import { FeeWarningVariant } from "domains/transaction/components/FeeWarning";
import { useCallback, useEffect, useMemo, useState } from "react";

type CallbackFunction = () => void;

export const useFeeConfirmation = (fee: number | string, fees: TransactionFee) => {
	const [showFeeWarning, setShowFeeWarning] = useState(false);
	const [feeWarningVariant, setFeeWarningVariant] = useState<FeeWarningVariant | undefined>();

	const activeProfile = useActiveProfile();
	const { persist } = useEnvironmentContext();

	useEffect(() => {
		if (!fee) {
			return;
		}

		const value = BigNumber.make(fee);

		if (value.isLessThan(fees?.min)) {
			setFeeWarningVariant(FeeWarningVariant.Low);
		}

		if (value.isGreaterThan(fees?.static)) {
			setFeeWarningVariant(FeeWarningVariant.High);
		}

		if (value.isGreaterThanOrEqualTo(fees?.min) && value.isLessThanOrEqualTo(fees?.static)) {
			setFeeWarningVariant(undefined);
		}
	}, [fee, fees]);

	const dismissFeeWarning = useCallback(
		async (callback: CallbackFunction, suppressWarning: boolean) => {
			setShowFeeWarning(false);

			if (suppressWarning) {
				activeProfile.settings().set(ProfileSetting.DoNotShowFeeWarning, true);
				await persist(activeProfile);
			}

			const result: any = callback();

			if (result instanceof Promise) {
				await result;
			}
		},
		[activeProfile, persist],
	);

	const requireFeeConfirmation = useMemo(
		() => feeWarningVariant !== undefined && !activeProfile.settings().get(ProfileSetting.DoNotShowFeeWarning),
		[activeProfile, feeWarningVariant],
	);

	return {
		dismissFeeWarning,
		feeWarningVariant,
		requireFeeConfirmation,
		showFeeWarning,
		setShowFeeWarning,
	};
};
