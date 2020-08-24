import { Environment, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import React from "react";
import { MemoryRouter, Route } from "react-router";
import { WalletsDecorator } from "utils/storybook";

import { SendIPFSTransaction } from "./SendIPFSTransaction";

export default {
	title: "Domains / Transaction / Pages / SendIPFSTransaction",
	decorators: [(storyFn: any) => <WalletsDecorator count={3}>{storyFn}</WalletsDecorator>],
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
		<MemoryRouter initialEntries={[`/profiles/${profile.id()}/transactions/${wallets[0].id()}/ipfs`]}>
			<Route path="/profiles/:profileId/transactions/:walletId/ipfs" component={() => <SendIPFSTransaction />} />
		</MemoryRouter>
	</EnvironmentProvider>
);
