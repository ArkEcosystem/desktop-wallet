import { number, select, text, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { Address } from "./Address";

export default {
	title: "Components / Formatted Address",
	decorators: [withKnobs],
};

export const Default = () => {
	const address = text("Address", "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT");
	const walletName = text("Wallet Name", "My wallet");
	const maxChars = number("Maximum characters", 20);
	const size = select("Size", ["small", "default", "large"], "default");

	return (
		<div className="">
			<div className="mb-10 text-md">Formatted (truncated) address with optional wallet name</div>
			<div className="mb-10">
				<Address address={address} maxChars={maxChars} walletName={walletName} size={size} />
			</div>
		</div>
	);
};
