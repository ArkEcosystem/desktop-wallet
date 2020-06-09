import React from "react";
import { ContactUs } from "./";
import { Button } from "app/components/Button";
import { withKnobs, boolean, text } from "@storybook/addon-knobs";

export default { title: "Help / Components / ContactUs" };

export const Default = () => (
	<ContactUs
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onCancel={() => alert("cancelled")}
		onSend={() => alert("sent")}
	/>
);
