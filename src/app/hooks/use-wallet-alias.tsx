import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useEnvironmentContext } from "app/contexts";

type Props = {
	address: string;
	profile: Contracts.IProfile;
	coinId?: string;
	networkId?: string;
};

export const useWalletAlias = ({ address, profile, coinId, networkId }: Props) => {
	const { env } = useEnvironmentContext();

	const contact = profile.contacts().findByAddress(address)[0];

	if (contact) {
		return contact.name();
	}

	try {
		const alias = profile.wallets().findByAddress(address)?.displayName();

		if (alias) {
			return alias;
		}

		if (coinId && networkId) {
			const delegate = env.delegates().findByAddress(coinId, networkId, address);
			return delegate.username();
		}
	} catch {
		//
	}
};
