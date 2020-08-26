import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { DelegateTable } from "./DelegateTable";

export default {
	title: "Domains / Vote / Components / DelegateTable",
	decorators: [
		(storyFn: any) => (
			<WalletsDecorator count={1} withDelegates={true}>
				{storyFn}
			</WalletsDecorator>
		),
	],
};

export const Default = ({ delegates }: { delegates: ReadOnlyWallet[] }) => (
	<DelegateTable coin="ARK" delegates={delegates} />
);

export const SelectMultiple = ({ delegates }: { delegates: ReadOnlyWallet[] }) => (
	<DelegateTable coin="LSK" delegates={delegates} />
);
