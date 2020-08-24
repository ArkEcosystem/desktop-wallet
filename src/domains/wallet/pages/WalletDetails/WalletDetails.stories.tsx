import { Environment, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import React from "react";
import { MemoryRouter, Route } from "react-router";
import { WalletsDecorator } from "utils/storybook";

import { WalletDetails } from "./WalletDetails";

export default {
	title: "Domains / Wallet / Pages / WalletDetails",
	decorators: [
		(storyFn: any) => (
			<WalletsDecorator count={1} withDelegates={true}>
				{storyFn}
			</WalletsDecorator>
		),
	],
};

export const Default = ({
	env,
	profile,
	wallets,
}: {
	env: Environment;
	profile: Profile;
	wallets: ReadWriteWallet[];
}) => (
	<EnvironmentProvider env={env}>
		<MemoryRouter initialEntries={[`/profiles/${profile.id()}/wallets/${wallets[0].id()}`]}>
			<Route path="/profiles/:profileId/wallets/:walletId" component={() => <WalletDetails />} />
		</MemoryRouter>
	</EnvironmentProvider>
);

export const Empty = () => <WalletDetails />;

export const MultipleWallets = ({
	env,
	profile,
	wallets,
}: {
	env: Environment;
	profile: Profile;
	wallets: ReadWriteWallet[];
}) => (
	<EnvironmentProvider env={env}>
		<MemoryRouter initialEntries={[`/profiles/${profile.id()}/wallets/${wallets[0].id()}`]}>
			<Route path="/profiles/:profileId/wallets/:walletId" component={() => <WalletDetails />} />
		</MemoryRouter>
	</EnvironmentProvider>
);
