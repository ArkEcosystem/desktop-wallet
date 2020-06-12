import React from "react";
import { Recipient } from "./Recipient";
import { withKnobs, text } from "@storybook/addon-knobs";

import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";

export default {
	title: "Basic / Recipient",
	decorators: [withKnobs],
};

export const Default = () => <Recipient address={text("Address", "Address")} amount="-88.84557 ARK" />;

export const WithoutBorder = () => <Recipient address={text("Address", "Address")} border={false} />;

export const WithExtra = () => <Recipient address={text("Address", "Address")} amount="-88.84557 ARK" />;

export const MultipleRows = () => (
	<div>
		<Recipient address={text("Address", "Address")} amount="-88.84557 ARK" border={false} />

		<Recipient address={text("Address", "Address")} amount="-88.84557 ARK" />

		<Recipient address={text("Address", "Address")} amount="-88.84557 ARK" />
	</div>
);
