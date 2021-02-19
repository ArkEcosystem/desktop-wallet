import { Network } from "@arkecosystem/platform-sdk/dist/coins";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { useMemo } from "react";

type Address = {
	id: string;
	address: string;
	alias?: string;
	network?: string;
	avatar: string;
	type: string;
};

export const useProfileAddresses = ({ profile, network }: { profile: Profile; network?: Network }) => {
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

		profileWallets.forEach((wallet) => {
			if (!isNetworkSelected(wallet.network().id())) {
				return;
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
		});

		contacts.forEach((contact) => {
			contact
				.addresses()
				.values()
				.forEach((contactAddress) => {
					if (!isNetworkSelected(contactAddress.network())) {
						return;
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
				});
		});

		return {
			contactAddresses,
			allAddresses,
			profileAddresses,
		};
	}, [profileWallets, contacts, network]);
};
