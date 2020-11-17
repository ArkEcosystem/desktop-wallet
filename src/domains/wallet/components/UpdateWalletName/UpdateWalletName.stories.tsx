import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";
import { env, getDefaultProfileId } from "utils/testing-library";

import { UpdateWalletName } from "./UpdateWalletName";

export default {
	title: "Domains / Wallet / Components / UpdateWalletName",
	decorators: [withKnobs],
};

export const Default = () => {
	const profile = env.profiles().findById(getDefaultProfileId());
	const wallet = profile.wallets().first();

	return (
		<UpdateWalletName
			wallet={wallet}
			profile={profile}
			isOpen={boolean("Is Open", true)}
			onClose={() => alert("closed")}
			onCancel={() => alert("cancelled")}
			onSave={() => alert("saved")}
		/>
	);
};
