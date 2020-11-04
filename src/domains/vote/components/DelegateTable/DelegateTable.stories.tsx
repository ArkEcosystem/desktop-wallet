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
	<DelegateTable delegates={delegates} maxVotes={1} selectedWallet="D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax" />
);

export const SelectMultiple = ({ delegates }: { delegates: ReadOnlyWallet[] }) => (
	<DelegateTable delegates={delegates} maxVotes={10} selectedWallet="D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax" />
);
