import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { useCallback, useEffect, useState } from "react";

interface BalanceProps {
	profile?: Contracts.IProfile;
	isLoading?: boolean;
}

export const useProfileBalance = ({ profile, isLoading = false }: BalanceProps) => {
	const [convertedBalance, setConvertedBalance] = useState(BigNumber.ZERO);

	const balance = profile?.status().isRestored() ? profile?.convertedBalance() : convertedBalance;

	const updateBalance = useCallback(() => {
		try {
			if (balance) {
				setConvertedBalance(balance);
			}
		} catch {
			// Ignore error from converted balance
		}
	}, [balance, setConvertedBalance]);

	useEffect(() => {
		if (isLoading) {
			return;
		}

		if (balance?.isEqualTo(convertedBalance)) {
			return;
		}

		updateBalance();
	}, [isLoading, updateBalance, balance, convertedBalance]);

	return {
		convertedBalance,
	};
};
