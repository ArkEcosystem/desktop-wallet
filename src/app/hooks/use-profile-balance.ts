import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { useEffect, useState } from "react";

interface BalanceProperties {
	profile?: Contracts.IProfile;
	isLoading?: boolean;
}

export const useProfileBalance = ({ profile, isLoading = false }: BalanceProperties) => {
	const [convertedBalance, setConvertedBalance] = useState(BigNumber.ZERO);

	const balance = profile?.status().isRestored() ? profile?.convertedBalance() : convertedBalance;

	useEffect(() => {
		if (isLoading) {
			return;
		}

		if (!balance) {
			return;
		}

		if (balance?.isEqualTo(convertedBalance)) {
			return;
		}

		setConvertedBalance(balance);
	}, [isLoading, balance, convertedBalance]);

	return {
		convertedBalance,
	};
};
