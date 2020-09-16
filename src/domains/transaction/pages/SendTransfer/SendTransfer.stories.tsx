import { Environment, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import React from "react";
import { MemoryRouter, Route } from "react-router";
import { WalletsDecorator } from "utils/storybook";

import { SendTransfer } from "./SendTransfer";

export default {
	title: "Domains / Transaction / Pages / Transaction Send",
	decorators: [(storyFn: any) => <WalletsDecorator count={1}>{storyFn}</WalletsDecorator>],
};

export const Default = ({
	env,
	profile,
	wallets,
}: {
	env: Environment;
	profile: Profile;
	wallets: ReadWriteWallet[];
}) => {
	const contact = profile.contacts().create("Test contact");
	contact.setAddresses([
		{
			address: "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
			coin: "ARK",
			name: "John Doe",
			network: "ark.devnet",
		},
	]);

	return (
		<EnvironmentProvider env={env}>
			<MemoryRouter initialEntries={[`/profiles/${profile.id()}/transactions/${wallets[0].id()}/transfer`]}>
				<Route component={() => <SendTransfer />} path="/profiles/:profileId/transactions/:walletId/transfer" />
			</MemoryRouter>
		</EnvironmentProvider>
	);
};
