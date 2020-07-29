import { action } from "@storybook/addon-actions";
import React from "react";

import { Contacts } from "./Contacts";

export default { title: "Domains / Contact / Pages / Contacts" };

export const Default = () => {
	return (<Contacts onSearch={action("onSearch")} />);
};
