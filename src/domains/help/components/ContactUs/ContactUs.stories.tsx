import React from "react";
import { ContactUs } from "./";
import { boolean } from "@storybook/addon-knobs";

export default { title: "Modals / ContactUs" };

export const Default = () => (
	<ContactUs
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onCancel={() => alert("cancelled")}
		onSend={() => alert("sent")}
	/>
);
