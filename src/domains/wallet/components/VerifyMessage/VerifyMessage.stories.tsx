import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { VerifyMessage } from "./VerifyMessage";

export default {
	title: "Domains / Wallet / Components / VerifyMessage",
	decorators: [withKnobs],
};

export const Default = () => {
	return (
		<VerifyMessage
			isOpen={boolean("isOpen", true)}
			handleClose={() => alert("closed")}
			onSubmit={console.log}
			profileId="c73889ad-a15e-4f63-84c4-19704b98f472"
			signatory="03600a30cb66c6f6275ead993078d691764629c4f9244e5d38fea73483f31821cc"
			walletPublicKey="034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192"
		/>
	);
};
