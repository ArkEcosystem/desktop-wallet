import { text, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { Recipient } from "./Recipient";

export default {
	title: "Basic / Recipient",
	decorators: [withKnobs],
};

export const Default = () => <Recipient address={text("Address", "Address")} amount="-88.84557 ARK" />;

export const WithoutBorder = () => (
	<Recipient address={text("Address", "Address")} amount="-88.84557 ARK" border={false} />
);

export const WithExtra = () => <Recipient address={text("Address", "Address")} amount="-88.84557 ARK" />;

export const MultipleRows = () => (
	<div>
		<Recipient address={text("Address", "Address")} amount="-88.84557 ARK" border={false} />

		<Recipient address={text("Address", "Address")} amount="-88.84557 ARK" />

		<Recipient address={text("Address", "Address")} amount="-88.84557 ARK" />
	</div>
);
