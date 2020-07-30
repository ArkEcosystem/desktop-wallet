import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { VerifyMessage } from "./VerifyMessage";

export default {
	title: "Domains / Wallet / Components / VerifyMessage",
	decorators: [withKnobs],
};

export const Default = () => (
	<VerifyMessage
		isOpen={boolean("isOpen", true)}
		onClose={() => alert("closed")}
		onSubmit={console.log}
		profileId="b999d134-7a24-481e-a95d-bc47c543bfc9"
		signatory="03600a30cb66c6f6275ead993078d691764629c4f9244e5d38fea73483f31821cc"
		walletId="ac38fe6d-4b67-4ef1-85be-17c5f6841129"
	/>
);
