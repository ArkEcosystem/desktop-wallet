import { boolean } from "@storybook/addon-knobs";
import React from "react";

import { SelectDelegate } from "./SelectDelegate";

export default { title: "Transactions / Components / Select Delegate Modal" };

export const Default = () => <SelectDelegate isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />;

export const Multiple = () => (
	<SelectDelegate allowMultiple={true} isOpen={boolean("Is Open", true)} onClose={() => alert("closed")} />
);
