import { boolean, text, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { SignMessage } from "./SignMessage";

export default { title: "Domains / Wallet / Components / SignMessage", decorators: [withKnobs] };

export const Default = () => {
	const signatoryAddress = text("Address", "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT");
	const isOpen = boolean("Is Open?", true);
	const isSigned = boolean("Is Signed?", false);

	return (
		<SignMessage
			signatoryAddress={signatoryAddress}
			isOpen={isOpen}
			isSigned={isSigned}
			onClose={() => alert("Close action")}
			onCancel={() => alert("Cancel action")}
			onSign={() => alert("Sign action")}
		/>
	);
};
