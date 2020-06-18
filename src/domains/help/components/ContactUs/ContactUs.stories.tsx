import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { ContactUs } from "./ContactUs";

export default { title: "Help / Components / Contact Us" };

export const Default = () => (
	<ContactUs
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onCancel={() => alert("cancelled")}
		onSend={() => alert("sent")}
	/>
);
