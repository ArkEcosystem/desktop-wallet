import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { ContactUs } from "./ContactUs";

export default { title: "Domains / Help / Components / ContactUs" };

export const Default = () => (
	<ContactUs
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
		onCancel={() => alert("cancelled")}
		onSend={() => alert("sent")}
	/>
);
