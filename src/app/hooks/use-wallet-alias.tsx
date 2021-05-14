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

	if (contact) {
		return contact.addresses().findByAddress(address)[0].name();
	}

	try {
		const displayName = wallet!.displayName();
		return displayName;
	} catch {
		//
	}
};
