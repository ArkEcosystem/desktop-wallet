import { Environment, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import React from "react";
import { MemoryRouter, Route } from "react-router";
import { WalletsDecorator } from "utils/storybook";

import { SendEntityRegistration } from "./SendEntityRegistration";

export default {
	title: "Domains / Transaction / Pages / SendEntityRegistration",
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
		<MemoryRouter
			initialEntries={[`/profiles/${profile.id()}/wallets/${wallets[0].id()}/send-entity-registration`]}
		>
			<Route
				path="/profiles/:profileId/wallets/:walletId/send-entity-registration"
				component={() => <SendEntityRegistration />}
			/>
		</MemoryRouter>
	</EnvironmentProvider>
);
