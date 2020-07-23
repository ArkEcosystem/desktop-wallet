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
			publicKey="02ff171adaef486b7db9fc160b28433d20cf43163d56fd28fee72145f0d5219a4b"
		/>
	);
};
