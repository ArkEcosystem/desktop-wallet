import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { boolean } from "@storybook/addon-knobs";
import { EnvironmentProvider } from "app/contexts";
import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";
import { WalletsDecorator } from "utils/storybook";

import { VoteDetail } from "./VoteDetail";

export default {
	title: "Domains / Transaction / Components / VoteDetail",
	decorators: [
		(storyFn: any) => (
			<WalletsDecorator count={1} withDelegates={true}>
				{storyFn}
			</WalletsDecorator>
		),
	],
};

// const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

export const Default = ({ env }: { env: Environment }) => (
	<EnvironmentProvider env={env}>
		<VoteDetail
			isOpen={boolean("Is Open", true)}
			onClose={() => alert("closed")}
			transaction={{ ...TransactionFixture, blockId: () => "adsad12312xsd1w312e1s13203e12" }}
			wallet={TransactionFixture.wallet()}
		/>
	</EnvironmentProvider>
);
