import { Contracts } from "@arkecosystem/platform-sdk-profiles";

type Props = {
	address: string;
	profile: Contracts.IProfile;
};

export const useWalletAlias = ({ address, profile }: Props) => {
	const wallet = profile.wallets().findByAddress(address);
	const contact = profile.contacts().findByAddress(address)[0];

	if (!wallet && !contact) {
		return;
	}

	if (wallet?.alias()) {
		return wallet?.alias();
	}

	if (contact) {
		const contactWallet = contact.addresses().findByAddress(address)[0];
		return contactWallet.name();
	}

	if (wallet?.isKnown()) {
		return wallet?.knownName();
	}

	if (wallet?.hasSyncedWithNetwork() && wallet?.username()) {
		return wallet?.username();
	}
};
