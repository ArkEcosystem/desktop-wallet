import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { DelegateList } from "./DelegateList";

export default {
	title: "Domains / Vote / Components / DelegateList",
	decorators: [
		(storyFn: any) => (
			<WalletsDecorator count={1} withDelegates={true}>
				{storyFn}
			</WalletsDecorator>
		),
	],
};

export const Default = ({ delegates }: { delegates: any }) => (
	<DelegateList delegates={delegates.items().slice(0, 10)} />
);
