import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import React from "react";
import { MemoryRouter, Route } from "react-router";
import { WalletsDecorator } from "utils/storybook";

import { TransactionSend } from "./TransactionSend";

export default {
	title: "Domains / Transaction / Pages / Transaction Send",
	decorators: [(storyFn: any) => <WalletsDecorator count={1}>{storyFn}</WalletsDecorator>],
};

export const Default = ({ env, profile }: { env: Environment; profile: Profile }) => {
	const contact = profile.contacts().create("Test contact");
	contact.setAddresses([
		{
			address: "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
			coin: "ARK",
			name: "John Doe",
			network: "devnet",
		},
	]);

	return (
		<EnvironmentProvider env={env}>
			<MemoryRouter initialEntries={[`/profiles/${profile.id()}/transactions/transfer`]}>
				<Route component={() => <TransactionSend />} path="/profiles/:profileId/transactions/transfer" />
			</MemoryRouter>
		</EnvironmentProvider>
	);
};
