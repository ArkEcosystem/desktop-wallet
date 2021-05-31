import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { useMemo } from "react";

interface UseProfileBalanceInput {
	profile?: Contracts.IProfile;
	isLoading?: boolean;
}

interface UseProfileBalanceOutput {
	convertedBalance: BigNumber;
}

export const useProfileBalance = ({ profile, isLoading = false }: UseProfileBalanceInput): UseProfileBalanceOutput => {
	let convertedBalance: BigNumber = BigNumber.ZERO;

	try {
		convertedBalance = profile?.convertedBalance() ?? BigNumber.ZERO;
	} catch {
		// Ignore error from converted balance
	}

	return {
		convertedBalance: useMemo(() => (isLoading ? BigNumber.ZERO : convertedBalance), [convertedBalance, isLoading]),
	};
};
