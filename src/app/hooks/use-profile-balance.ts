import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { useEffect, useState, useCallback } from "react";

type BalanceProps = {
	profile?: Contracts.IProfile;
	isLoading?: boolean;
};

export const useProfileBalance = ({ profile, isLoading = false }: BalanceProps) => {
	const [convertedBalance, setConvertedBalance] = useState(BigNumber.ZERO);

	const updateBalance = useCallback(() => {
		try {
			const balance = profile?.convertedBalance() as BigNumber;
			if (balance) {
				setConvertedBalance(balance);
			}
		} catch {}
	}, [profile]);

	useEffect(() => {
		if (isLoading) {
			return;
		}
		updateBalance();
	}, [profile, isLoading, updateBalance]);

	return {
		convertedBalance,
	};
};
