import { action } from "@storybook/addon-actions";
import React from "react";

import { networks } from "../../data";
import { CreateWallet } from "./CreateWallet";

export default { title: "Domains / Wallet / Pages / CreateWallet" };

const mnemonic = "lorem ipsum dolor sit amet consectetur adipisicing elit nihil nisi natus adipisci";

export const Default = () => (
	<CreateWallet
		mnemonic={mnemonic}
		networks={networks}
		onCopy={action("onCopy")}
		onDownload={action("onDownload")}
		onSubmit={action("onSubmit")}
	/>
);
