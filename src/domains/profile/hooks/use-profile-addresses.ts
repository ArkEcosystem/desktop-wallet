import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useMemo } from "react";

interface Address {
	id: string;
	address: string;
	alias?: string;
	network?: string;
	avatar: string;
	type: string;
}

export const useProfileAddresses = ({
	profile,
	network,
}: {
	profile: Contracts.IProfile;
	network?: Networks.Network;
}) => {
	const contacts = profile.contacts().values();
	const profileWallets = profile.wallets().values();

	return useMemo(() => {
		const allAddresses: Address[] = [];
		const profileAddresses: Address[] = [];
		const contactAddresses: Address[] = [];

		const isNetworkSelected = (addressNetwork: string) => {
			if (!network?.id()) {
				return true;
			}

			return addressNetwork === network?.id();
		};

		for (const wallet of profileWallets) {
			if (!isNetworkSelected(wallet.network().id())) {
				continue;
			}

			const address = {
				id: wallet.id(),
				address: wallet.address(),
				alias: wallet.alias(),
				avatar: wallet.avatar(),
				type: "wallet",
				network: wallet.network().id(),
			};

			allAddresses.push(address);
			profileAddresses.push(address);
		}

		for (const contact of contacts) {
			for (const contactAddress of contact.addresses().values()) {
				if (!isNetworkSelected(contactAddress.network())) {
					continue;
				}

				const address = {
					id: contactAddress.id(),
					address: contactAddress.address(),
					alias: contact.name(),
					avatar: contactAddress.avatar(),
					network: contactAddress.network(),
					type: "contact",
				};

				allAddresses.push(address);
				contactAddresses.push(address);
			}
		}

		return {
			contactAddresses,
			allAddresses,
			profileAddresses,
		};
	}, [profileWallets, contacts, network]);
};
